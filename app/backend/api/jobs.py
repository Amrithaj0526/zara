from flask import Blueprint, request, jsonify
from app.backend.extensions import db
from app.backend.models.job import Job

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 