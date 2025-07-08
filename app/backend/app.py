from flask import Flask, jsonify, send_from_directory
from app.backend.config import Config
from app.backend.extensions import db, migrate, jwt
from app.backend.api import auth_bp, profile_bp, posts_bp, feed_bp, jobs_bp, messaging_bp
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from app.backend.models.profile import Profile

# Instantiate Limiter globally
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(
        app,
        origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    limiter.init_app(app)

    # Root route to confirm server is working
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Zara API is running!',
            'endpoints': {
                'auth': '/auth',
                'profile': '/profile', 
                'posts': '/posts',
                'feed': '/feed',
                'jobs': '/jobs',
                'messaging': '/messaging'
            }
        })

    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(posts_bp, url_prefix='/posts')
    app.register_blueprint(feed_bp, url_prefix='/feed')
    app.register_blueprint(jobs_bp, url_prefix='/jobs')
    app.register_blueprint(messaging_bp, url_prefix='/messaging')

    # Import models inside app context for migrations
    with app.app_context():
        from app.backend.models.user import User
        # Import other models as needed

    return app

# For CLI/legacy support
_app = None
def get_app():
    global _app
    if _app is None:
        _app = create_app()
    return _app 