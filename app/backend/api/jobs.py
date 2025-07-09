from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 