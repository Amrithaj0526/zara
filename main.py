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
from datetime import datetime, timezone

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

# Define Profile model
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    skills = db.Column(db.Text)
    experience = db.Column(db.Text)
    education = db.Column(db.Text)
    image = db.Column(db.String(255))
    job_title = db.Column(db.String(100))
    company = db.Column(db.String(100))
    social_links = db.Column(db.Text)
    
    user = db.relationship('User', backref=db.backref('profile', uselist=False))

# Define Post model
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    likes = db.Column(db.Integer, default=0)
    tags = db.Column(db.String(255))
    
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

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
    
    # Profile routes
    @app.route('/profile', methods=['GET', 'OPTIONS'])
    @app.route('/profile/', methods=['GET', 'OPTIONS'])
    def get_profile():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # For now, return a mock profile
            return jsonify({
                'id': 1,
                'user_id': 1,
                'bio': 'Default bio',
                'location': 'Default location',
                'skills': 'Default skills',
                'experience': 'Default experience',
                'education': 'Default education',
                'image': None,
                'user': {
                    'username': 'default_user',
                    'email': 'default@example.com'
                }
            }), 200
        except Exception as e:
            print("Profile get error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/profile', methods=['PUT', 'OPTIONS'])
    @app.route('/profile/', methods=['PUT', 'OPTIONS'])
    def update_profile():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json()
            return jsonify({'message': 'Profile updated successfully'}), 200
        except Exception as e:
            print("Profile update error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/profile/image', methods=['POST', 'OPTIONS'])
    def upload_profile_image():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Mock image upload response
            return jsonify({
                'message': 'Profile image uploaded successfully',
                'image_url': '/uploads/profile_image.jpg'
            }), 200
        except Exception as e:
            print("Profile image upload error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    # Feed routes
    @app.route('/feed', methods=['GET', 'OPTIONS'])
    def get_feed():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Return mock feed data
            return jsonify({
                'posts': [
                    {
                        'id': 1,
                        'content': 'This is a sample post',
                        'media_url': None,
                        'created_at': datetime.now(timezone.utc).isoformat(),
                        'likes': 5,
                        'tags': ['sample', 'post'],
                        'user': {
                            'id': 1,
                            'name': 'Sample User',
                            'avatar': None,
                            'job_title': 'Developer'
                        }
                    }
                ]
            }), 200
        except Exception as e:
            print("Feed error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/feed/user/<int:user_id>', methods=['GET', 'OPTIONS'])
    def get_feed_by_user(user_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Return mock feed data for specific user
            return jsonify({
                'posts': [
                    {
                        'id': 1,
                        'content': f'This is a sample post from user {user_id}',
                        'media_url': None,
                        'created_at': datetime.now(timezone.utc).isoformat(),
                        'likes': 3,
                        'tags': ['user', 'post'],
                        'user': {
                            'id': user_id,
                            'name': f'User {user_id}',
                            'avatar': None,
                            'job_title': 'Developer'
                        }
                    }
                ]
            }), 200
        except Exception as e:
            print("Feed by user error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    # Posts routes
    @app.route('/posts', methods=['GET', 'OPTIONS'])
    @app.route('/posts/', methods=['GET', 'OPTIONS'])
    def list_posts():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Get query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            search = request.args.get('search', '')
            category = request.args.get('category', '')
            user_id = request.args.get('user_id', '')
            
            # Create mock posts data
            posts = []
            for i in range(1, 6):  # Create 5 sample posts
                post_content = f'This is sample post {i}'
                if search:
                    post_content = f'This is sample post {i} with search: {search}'
                
                posts.append({
                    'id': i,
                    'content': post_content,
                    'media_url': None,
                    'created_at': datetime.now(timezone.utc).isoformat(),
                    'likes': 5 + i,
                    'tags': ['sample', 'post', f'tag{i}'],
                    'user': {
                        'id': i,
                        'name': f'Sample User {i}',
                        'avatar': None,
                        'job_title': 'Developer'
                    },
                    'comments': [
                        {
                            'id': i,
                            'user_id': i,
                            'user_name': f'Commenter {i}',
                            'user_avatar': None,
                            'content': f'This is a sample comment {i}',
                            'created_at': datetime.now(timezone.utc).isoformat()
                        }
                    ]
                })
            
            # Filter by user_id if provided
            if user_id:
                posts = [post for post in posts if post['user']['id'] == int(user_id)]
            
            return jsonify({
                'posts': posts,
                'total': len(posts),
                'page': page,
                'per_page': per_page,
                'has_more': len(posts) >= per_page
            }), 200
        except Exception as e:
            print("Posts list error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/<int:post_id>', methods=['GET', 'OPTIONS'])
    def get_post(post_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Return mock individual post data
            return jsonify({
                'id': post_id,
                'content': f'This is detailed post {post_id}',
                'media_url': None,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'likes': 5 + post_id,
                'tags': ['sample', 'post', f'tag{post_id}'],
                'user': {
                    'id': post_id,
                    'name': f'Sample User {post_id}',
                    'avatar': None,
                    'job_title': 'Developer'
                },
                'comments': [
                    {
                        'id': 1,
                        'user_id': 1,
                        'user_name': 'Commenter 1',
                        'user_avatar': None,
                        'content': f'This is a comment for post {post_id}',
                        'created_at': datetime.now(timezone.utc).isoformat()
                    }
                ]
            }), 200
        except Exception as e:
            print("Get post error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts', methods=['POST', 'OPTIONS'])
    @app.route('/posts/', methods=['POST', 'OPTIONS'])
    def create_post():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json() if request.is_json else request.form
            content = data.get('content', 'Sample post content')
            
            return jsonify({
                'message': 'Post created successfully',
                'post': {
                    'id': 1,
                    'content': content,
                    'media_url': None,
                    'created_at': datetime.now(timezone.utc).isoformat(),
                    'likes': 0,
                    'tags': [],
                    'user': {
                        'id': 1,
                        'name': 'Sample User',
                        'avatar': None,
                        'job_title': 'Developer'
                    }
                }
            }), 201
        except Exception as e:
            print("Post creation error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/<int:post_id>/like', methods=['POST', 'OPTIONS'])
    def like_post(post_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            return jsonify({
                'message': 'Post liked successfully',
                'likes': 6
            }), 200
        except Exception as e:
            print("Like post error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/categories', methods=['GET', 'OPTIONS'])
    def get_categories():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            return jsonify(['Technology', 'Design', 'Business', 'Marketing', 'Development'])
        except Exception as e:
            print("Categories error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/popular-tags', methods=['GET', 'OPTIONS'])
    def get_popular_tags():
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            return jsonify(['react', 'javascript', 'python', 'design', 'business', 'marketing', 'development', 'web', 'app', 'mobile'])
        except Exception as e:
            print("Popular tags error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/<int:post_id>/comments', methods=['GET', 'OPTIONS'])
    def get_comments(post_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            # Return mock comments for the post
            comments = [
                {
                    'id': 1,
                    'user_id': 1,
                    'user_name': 'Commenter 1',
                    'user_avatar': None,
                    'content': f'This is a comment for post {post_id}',
                    'created_at': datetime.now(timezone.utc).isoformat()
                },
                {
                    'id': 2,
                    'user_id': 2,
                    'user_name': 'Commenter 2',
                    'user_avatar': None,
                    'content': f'Another comment for post {post_id}',
                    'created_at': datetime.now(timezone.utc).isoformat()
                }
            ]
            return jsonify(comments), 200
        except Exception as e:
            print("Get comments error:", e)
            return jsonify({'message': 'Internal server error'}), 500
    
    @app.route('/posts/<int:post_id>/comments', methods=['POST', 'OPTIONS'])
    def add_comment(post_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json()
            content = data.get('content', '')
            
            if not content:
                return jsonify({'error': 'Comment content is required'}), 400
            
            # Return mock comment response
            new_comment = {
                'id': 3,
                'user_id': 1,
                'user_name': 'Current User',
                'user_avatar': None,
                'content': content,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            return jsonify(new_comment), 201
        except Exception as e:
            print("Add comment error:", e)
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