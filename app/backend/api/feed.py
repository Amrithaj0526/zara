from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.post import Post
from app.backend.models.user import User

feed_bp = Blueprint('feed', __name__)
 
# Routes will be implemented here 