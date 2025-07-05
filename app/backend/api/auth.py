from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models.user import User
from flask_jwt_extended import create_access_token
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import re
from markupsafe import escape

# Attach limiter to blueprint
limiter = Limiter(key_func=get_remote_address)

auth_bp = Blueprint('auth', __name__)

PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$')

@auth_bp.route('/signup', methods=['POST'])
@limiter.limit("5 per minute")
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No JSON data provided'}), 400
        
        username = escape(data.get('username', '').strip())
        email = escape(data.get('email', '').strip())
        password = data.get('password', '')

        # Debug logging
        print(f"Received signup data: username='{username}', email='{email}', password_length={len(password)}")

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
        print(f"Signup error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    identifier = escape(data.get('username') or data.get('email', '')).strip()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'message': 'Missing username/email or password'}), 400

    # Allow login with either username or email
    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

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

# Routes will be implemented here 