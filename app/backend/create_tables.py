#!/usr/bin/env python3
"""
Simple script to create all database tables
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db

def main():
    print("Creating database tables...")
    
    app = create_app()
    
    with app.app_context():
        # Import all models to ensure they are registered
        from models.user import User
        from models.profile import Profile
        from models.post import Post
        from models.comment import Comment
        from models.job import Job
        from models.message import Message
        
        # Create all tables
        db.create_all()
        print("✅ All database tables created successfully!")
        print("Tables created:")
        for table in db.metadata.tables:
            print(f"  - {table}")

if __name__ == "__main__":
    main() 