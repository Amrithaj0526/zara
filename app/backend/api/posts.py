from flask import Blueprint, request, jsonify, current_app, url_for
from extensions import db
from models.post import Post
from models.user import User
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.comment import Comment
from models.profile import Profile
from sqlalchemy import desc, asc, func
from functools import lru_cache

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploads'))

posts_bp = Blueprint('posts', __name__)

# Caching for categories and tags
@lru_cache(maxsize=1)
def get_categories():
    try:
        return [c[0] for c in db.session.query(Post.category).distinct() if c[0]]
    except Exception:
        return []

@lru_cache(maxsize=1)
def get_popular_tags():
    try:
        tag_counts = db.session.query(Post.tags, func.count(Post.id)).group_by(Post.tags).order_by(desc(func.count(Post.id))).limit(10).all()
        tags = []
        for tag_str, _ in tag_counts:
            if tag_str:
                tags.extend([t.strip() for t in tag_str.split(',') if t.strip()])
        return list(set(tags))
    except Exception:
        return []

@posts_bp.route('/categories', methods=['GET'])
def categories():
    return jsonify(get_categories())

@posts_bp.route('/popular-tags', methods=['GET'])
def popular_tags():
    return jsonify(get_popular_tags())

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
            'name': post.user.username,
            'avatar': user_profile.image if user_profile else None,
            'job_title': user_profile.job_title if user_profile else None
        },
                    'comments': [
                {
                    'id': c.id,
                    'user_id': c.user_id,
                    'user_name': c.user.username,
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
    # Filtering
    search = request.args.get('search', '', type=str)
    category = request.args.get('category', '', type=str)
    visibility = request.args.get('visibility', '', type=str)
    tags = request.args.getlist('tags')
    sort = request.args.get('sort', 'created_at', type=str)
    order = request.args.get('order', 'desc', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    user_id = request.args.get('user_id', type=int)

    query = Post.query
    if search:
        query = query.filter(Post.content.ilike(f'%{search}%'))
    if category:
        query = query.filter(Post.category == category)
    if visibility:
        query = query.filter(Post.visibility == visibility)
    if tags:
        for tag in tags:
            query = query.filter(Post.tags.ilike(f'%{tag}%'))
    if user_id:
        query = query.filter(Post.user_id == user_id)

    # Sorting
    if sort == 'likes':
        sort_col = Post.likes
    elif sort == 'views':
        sort_col = Post.views if hasattr(Post, 'views') else Post.created_at
    else:
        sort_col = Post.created_at
    sort_col = desc(sort_col) if order == 'desc' else asc(sort_col)
    query = query.order_by(sort_col)

    # Pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    posts = pagination.items
    total = pagination.total

    def serialize_post(post):
        user_profile = Profile.query.filter_by(user_id=post.user_id).first()
        return {
            'id': post.id,
            'content': post.content,
            'media_url': post.media_url,
            'created_at': post.created_at.isoformat(),
            'likes': post.likes,
            'tags': post.tags.split(',') if post.tags else [],
            'category': getattr(post, 'category', None),
            'visibility': getattr(post, 'visibility', None),
            'user': {
                'id': post.user.id,
                'name': post.user.username,
                'avatar': user_profile.image if user_profile else None,
                'job_title': user_profile.job_title if user_profile else None
            },
            'comments': [
                {
                    'id': c.id,
                    'user_id': c.user_id,
                    'user_name': c.user.username,
                    'user_avatar': c.user.profile.image if c.user.profile else None,
                    'content': c.content,
                    'created_at': c.created_at.isoformat()
                } for c in post.comments
            ]
        }
    return jsonify({
        'posts': [serialize_post(p) for p in posts],
        'total': total,
        'page': page,
        'per_page': per_page
    })

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