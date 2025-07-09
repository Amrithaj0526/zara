from flask import Flask, jsonify, send_from_directory, request
from config import Config
from extensions import db, migrate, jwt
from api import auth_bp, profile_bp, posts_bp, feed_bp, jobs_bp, messaging_bp
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from models.profile import Profile

# Set a high rate limit for development. Adjust for production as needed.
limiter = Limiter(key_func=get_remote_address, default_limits=["5000 per day", "1000 per hour"])

@limiter.request_filter
def ip_whitelist():
    # Allow all OPTIONS requests (CORS preflight) to bypass rate limiting
    if request.method == "OPTIONS":
        return True
    # Exclude uploads/media/static files from rate limiting
    if request.path.startswith('/uploads/') or request.path.startswith('/posts/uploads/'):
        return True
    return False

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(
        app,
        origins=[
            r"http://localhost:\d+",
            r"http://127.0.0.1:\d+",
            "http://localhost:3000",
            "http://localhost:8080"
        ],
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

    @app.route('/posts/uploads/<filename>')
    def post_uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(posts_bp, url_prefix='/posts')
    app.register_blueprint(feed_bp, url_prefix='/feed')
    app.register_blueprint(jobs_bp, url_prefix='/jobs')
    app.register_blueprint(messaging_bp, url_prefix='/messaging')

    # Error handler to ensure CORS headers are added to error responses
    @app.errorhandler(500)
    def internal_error(error):
        response = jsonify({'error': 'Internal server error'})
        response.status_code = 500
        return response

    @app.errorhandler(404)
    def not_found(error):
        response = jsonify({'error': 'Not found'})
        response.status_code = 404
        return response

    # Import models inside app context for migrations
    with app.app_context():
        from models.user import User
        # Import other models as needed

    return app

# For CLI/legacy support
_app = None
def get_app():
    global _app
    if _app is None:
        _app = create_app()
    return _app 