#!/usr/bin/env python3
"""
Simple script to create all database tables
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.backend.app import create_app
from app.backend.extensions import db
from app.backend.models.user import User
from app.backend.models.profile import Profile
from app.backend.models.post import Post
from app.backend.models.comment import Comment
from app.backend.models.job import Job
from app.backend.models.message import Message

def main():
    print("Creating database tables...")
    
    app = create_app()
    
    with app.app_context():
        # Import all models to ensure they are registered
        # Create all tables
        db.create_all()
        print("✅ All database tables created successfully!")
        print("Tables created:")
        for table in db.metadata.tables:
            print(f"  - {table}")

if __name__ == "__main__":
    main() 