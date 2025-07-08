from flask import Blueprint, request, jsonify, current_app, url_for
from app.backend.extensions import db
from app.backend.models.post import Post
from app.backend.models.user import User
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.backend.models.comment import Comment
from app.backend.models.profile import Profile

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploads'))

posts_bp = Blueprint('posts', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file(file):
    if file and allowed_file(file.filename):
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > MAX_FILE_SIZE:
            return False, 'File too large (max 10MB)'
        return True, ''
    return False, 'Invalid file type'

def serialize_post(post):
    user_profile = Profile.query.filter_by(user_id=post.user_id).first()
    return {
        'id': post.id,
        'content': post.content,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat(),
        'likes': post.likes,
        'tags': post.tags.split(',') if post.tags else [],
        'user': {
            'id': post.user.id,
            'name': post.user.name,
            'avatar': user_profile.image if user_profile else None,
            'job_title': user_profile.job_title if user_profile else None
        },
        'comments': [
            {
                'id': c.id,
                'user_id': c.user_id,
                'user_name': c.user.name,
                'user_avatar': c.user.profile.image if c.user.profile else None,
                'content': c.content,
                'created_at': c.created_at.isoformat()
            } for c in post.comments
        ]
    }

@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    content = request.form.get('content')
    file = request.files.get('media')
    
    if not user_id or not content:
        return jsonify({'error': 'user_id and content are required'}), 400
    
    media_url = None
    if file:
        valid, msg = validate_file(file)
        if not valid:
            return jsonify({'error': msg}), 400
        filename = secure_filename(f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}")
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        media_url = url_for('posts.uploaded_file', filename=filename, _external=True)
    
    post = Post(user_id=user_id, content=content, media_url=media_url)
    db.session.add(post)
    db.session.commit()
    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'content': post.content,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat()
    }), 201

@posts_bp.route('/', methods=['GET'])
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            'id': post.id,
            'user_id': post.user_id,
            'content': post.content,
            'media_url': post.media_url,
            'created_at': post.created_at.isoformat()
        }
        for post in posts
    ])

@posts_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return current_app.send_static_file(os.path.join(UPLOAD_FOLDER, filename)) 

@posts_bp.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    return jsonify({'likes': post.likes}), 200

@posts_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')
    if not content:
        return jsonify({'error': 'Content required'}), 400
    comment = Comment(post_id=post_id, user_id=user_id, content=content)
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added'}), 201

@posts_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
    return jsonify([
        {
            'id': c.id,
            'user_id': c.user_id,
            'user_name': c.user.name,
            'user_avatar': c.user.profile.image if c.user.profile else None,
            'content': c.content,
            'created_at': c.created_at.isoformat()
        } for c in comments
    ]) 