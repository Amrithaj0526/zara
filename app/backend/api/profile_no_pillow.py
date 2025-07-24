from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.user import User
from app.backend.models.profile import Profile
from flask_jwt_extended import jwt_required, get_jwt_identity
from markupsafe import escape
from werkzeug.utils import secure_filename
import time
import os

profile_bp = Blueprint('profile', __name__)
 
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../../uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image_simple(image, save_path):
    """Simple image save without compression"""
    image.save(save_path)
    return save_path

def serialize_profile(profile):
    return {
        'id': profile.id,
        'user_id': profile.user_id,
        'first_name': profile.first_name,
        'last_name': profile.last_name,
        'skills': profile.skills,
        'experience': profile.experience,
        'education': profile.education,
        'image': profile.image,
        'job_title': profile.job_title,
        'company': profile.company,
        'social_links': profile.social_links,
    }

@profile_bp.route('', methods=['GET'])
@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's profile"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get user and profile
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            # Create profile with default names if it doesn't exist
            profile = Profile(user_id=user_id, first_name='First', last_name='Last')
            db.session.add(profile)
            db.session.commit()
        
        return jsonify({
            'id': profile.id,
            'user_id': profile.user_id,
            'bio': profile.bio,
            'location': profile.location,
            'skills': profile.skills,
            'experience': profile.experience,
            'education': profile.education,
            'image': profile.image,
            'user': {
                'username': user.username,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        print(f"Profile get error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@profile_bp.route('', methods=['PUT'])
@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user's profile"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        # Update profile fields
        if 'first_name' in data:
            profile.first_name = escape(data['first_name'])
        if 'last_name' in data:
            profile.last_name = escape(data['last_name'])
        if 'bio' in data:
            profile.bio = escape(data['bio'])
        if 'location' in data:
            profile.location = escape(data['location'])
        if 'skills' in data:
            profile.skills = data['skills']
        if 'experience' in data:
            profile.experience = data['experience']
        if 'education' in data:
            profile.education = data['education']
        if 'job_title' in data:
            profile.job_title = escape(data['job_title'])
        if 'company' in data:
            profile.company = escape(data['company'])
        if 'social_links' in data:
            profile.social_links = data['social_links']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': serialize_profile(profile)
        }), 200
        
    except Exception as e:
        print(f"Profile update error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@profile_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Get a specific user's profile"""
    try:
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        return jsonify(serialize_profile(profile)), 200
        
    except Exception as e:
        print(f"User profile get error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@profile_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    """Upload profile image"""
    try:
        user_id = int(get_jwt_identity())
        
        if 'image' not in request.files:
            return jsonify({'message': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'message': 'No image file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'message': 'Invalid file type. Only PNG, JPG, JPEG allowed'}), 400
        
        if file.content_length and file.content_length > MAX_FILE_SIZE:
            return jsonify({'message': 'File too large. Maximum 5MB allowed'}), 400
        
        # Generate unique filename
        timestamp = int(time.time())
        filename = f"profile_{user_id}_{timestamp}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save file without compression for now
        file.save(filepath)
        
        # Update profile with image path
        profile = Profile.query.filter_by(user_id=user_id).first()
        if profile:
            profile.image = filename
            db.session.commit()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image': filename
        }), 200
        
    except Exception as e:
        print(f"Image upload error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500 