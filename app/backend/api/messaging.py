from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.user import User

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 