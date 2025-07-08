from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.user import User

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 