import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import Flask and create app
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

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

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app)
    
    # Import and register blueprints (only existing ones)
    from app.backend.api.auth import auth_bp
    from app.backend.api.feed import feed_bp
    from app.backend.api.posts import posts_bp
    from app.backend.api.profile import profile_bp
    from app.backend.api.jobs import jobs_bp
    from app.backend.api.messaging import messaging_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(feed_bp, url_prefix='/api/feed')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(messaging_bp, url_prefix='/api/messaging')
    
    @app.route('/')
    def home():
        return jsonify({"message": "Zara API is running!"})
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"})
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=False) 