from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.user import User
from app.backend.models.profile import Profile
from flask_jwt_extended import jwt_required, get_jwt_identity
from markupsafe import escape
from werkzeug.utils import secure_filename
from PIL import Image
import time
import os

profile_bp = Blueprint('profile', __name__)
 
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../../uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
THUMBNAIL_SIZE = (128, 128)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_and_save_image(image, save_path):
    img = Image.open(image)
    img = img.convert('RGB')
    img.save(save_path, optimize=True, quality=85)
    return save_path

def create_thumbnail(image, thumb_path):
    img = Image.open(image)
    img.thumbnail(THUMBNAIL_SIZE)
    img.save(thumb_path, optimize=True, quality=70)
    return thumb_path

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
        
        if not data:
            return jsonify({'message': 'No JSON data provided'}), 400
        
        # Get or create profile
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            profile = Profile(user_id=user_id, first_name='First', last_name='Last')
            db.session.add(profile)
        
        # Update profile fields
        if 'first_name' in data:
            profile.first_name = escape(data['first_name'][:80]) if data['first_name'] else None
        if 'last_name' in data:
            profile.last_name = escape(data['last_name'][:80]) if data['last_name'] else None
        if 'bio' in data:
            profile.bio = escape(data['bio'][:500]) if data['bio'] else None
        if 'location' in data:
            profile.location = escape(data['location'][:120]) if data['location'] else None
        if 'skills' in data:
            profile.skills = escape(data['skills']) if data['skills'] else None
        if 'experience' in data:
            profile.experience = escape(data['experience']) if data['experience'] else None
        if 'education' in data:
            profile.education = escape(data['education']) if data['education'] else None
        if 'job_title' in data:
            profile.job_title = escape(data['job_title'][:100]) if data['job_title'] else None
        if 'company' in data:
            profile.company = escape(data['company'][:100]) if data['company'] else None
        if 'social_links' in data:
            profile.social_links = escape(data['social_links']) if data['social_links'] else None

        # Remove validation call
        # validation_errors = profile.validate()
        # if validation_errors:
        #     return jsonify({'message': 'Validation failed', 'errors': validation_errors}), 400

        # Ensure first_name and last_name are present
        if not profile.first_name or not profile.last_name:
            return jsonify({'message': 'First name and last name are required.'}), 400
        
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
    """Get a specific user's public profile"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        return jsonify({
            'id': profile.id,
            'user_id': profile.user_id,
            'bio': profile.bio,
            'location': profile.location,
            'skills': profile.skills,
            'experience': profile.experience,
            'education': profile.education,
            'user': {
                'username': user.username
            }
        }), 200
        
    except Exception as e:
        print(f"Public profile get error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@profile_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = int(get_jwt_identity())
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
    file = request.files['image']
    if not file.filename or '.' not in file.filename:
        return jsonify({'message': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'message': 'Invalid file type. Only jpg, jpeg, png allowed.'}), 400
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)
    if file_length > MAX_FILE_SIZE:
        return jsonify({'message': 'File too large. Max 5MB allowed.'}), 400
    # Secure file naming
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"profile_{user_id}_{int(time.time())}.{ext}"
    filename = secure_filename(filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    # Save and compress image
    try:
        compress_and_save_image(file, save_path)
        # Create thumbnail
        thumb_filename = f"thumb_{filename}"
        thumb_path = os.path.join(UPLOAD_FOLDER, thumb_filename)
        create_thumbnail(save_path, thumb_path)
    except Exception as e:
        print(f"Image processing error: {str(e)}")
        return jsonify({'message': 'Image processing failed'}), 500
    # Update profile
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = Profile(user_id=user_id, first_name='First', last_name='Last')
        db.session.add(profile)
    profile.image = f"/uploads/{filename}"
    db.session.commit()
    return jsonify({'message': 'Image uploaded successfully', 'image_url': profile.image}), 200

# Routes will be implemented here 