#!/usr/bin/env python3
"""
Clean Flask app for Render deployment
"""

import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import re
from markupsafe import escape

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Define User model globally
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # Database configuration - use SQLite for now to avoid psycopg2 issues
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    if database_url.startswith('postgresql://'):
        # Convert PostgreSQL URL to SQLite for now
        database_url = 'sqlite:///app.db'
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # Configure CORS properly
    CORS(app, resources={
        r"/*": {
            "origins": ["*"],  # Allow all origins for now
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
        }
    })
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # API Routes
    PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$')
    
    @app.route('/auth/signup', methods=['POST', 'OPTIONS'])
    @limiter.limit("5 per minute")
    def signup():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json() if request.is_json else request.form
            print("Received signup data:", data)
            
            if not data:
                return jsonify({'message': 'No JSON data provided'}), 400
            
            username = escape(data.get('username', '').strip())
            email = escape(data.get('email', '').strip())
            password = data.get('password', '')

            if not username or not email or not password:
                return jsonify({'message': 'Missing required fields: username, email, and password are required'}), 400

            if not PASSWORD_REGEX.match(password):
                return jsonify({'message': 'Password must be at least 8 characters, include a letter and a number.'}), 400

            # Check for existing user
            if User.query.filter((User.username == username) | (User.email == email)).first():
                return jsonify({'message': 'Username or email already exists'}), 400

            user = User(username=username, email=email)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()

            return jsonify({'message': 'User created successfully'}), 201
            
        except Exception as e:
            print("Signup error:", e)
            import traceback; traceback.print_exc()
            db.session.rollback()
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/auth/login', methods=['POST', 'OPTIONS'])
    @limiter.limit("10 per minute")
    def login():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json() if request.is_json else request.form
            print("Received login data:", data)
            identifier = escape(data.get('username') or data.get('email', '')).strip()
            password = data.get('password', '')

            if not identifier or not password:
                return jsonify({'message': 'Missing username/email or password'}), 400

            # Allow login with either username or email
            user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
            if not user:
                return jsonify({'message': 'User not found'}), 404
            if not user.check_password(password):
                return jsonify({'message': 'Incorrect password'}), 401

            token = create_access_token(identity=str(user.id))
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }), 200
            
        except Exception as e:
            print("Login error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    # Basic routes
    @app.route('/')
    def home():
        return jsonify({"message": "Zara API is running!"})
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"})
    
    @app.route('/api/test')
    def test():
        return jsonify({"message": "API is working!"})
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=False) 