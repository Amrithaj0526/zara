#!/usr/bin/env python3
"""
Development database reset script
Resets the database and creates all tables for development
"""

import sys
import os

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.backend.app import create_app
from app.backend.extensions import db
from app.backend.models.user import User
from app.backend.models.profile import Profile
from app.backend.models.post import Post
from app.backend.models.job import Job
from app.backend.models.message import Message
from sqlalchemy import inspect

def reset_database():
    """Reset the database and create all tables"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🗑️  Dropping all existing tables...")
            db.drop_all()
            print("✅ All tables dropped successfully!")
            
            print("🏗️  Creating all database tables...")
            db.create_all()
            print("✅ All database tables created successfully!")
            
            # Verify tables exist
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Available tables: {tables}")
            
            # Create some sample data for development
            print("📝 Creating sample development data...")
            create_sample_data()
            
        except Exception as e:
            print(f"❌ Error resetting database: {str(e)}")
            return False
    
    return True

def create_sample_data():
    """Create sample data for development"""
    try:
        # Create a sample user
        sample_user = User(
            username='testuser',
            email='test@example.com',
            password_hash='hashed_password_here'  # In real app, this would be properly hashed
        )
        db.session.add(sample_user)
        db.session.commit()
        print("✅ Sample user created")
        
        # Create a sample profile
        sample_profile = Profile(
            user_id=sample_user.id,
            first_name='Test',
            last_name='User',
            bio='This is a sample profile for development',
            location='Test City',
            website='https://example.com'
        )
        db.session.add(sample_profile)
        db.session.commit()
        print("✅ Sample profile created")
        
    except Exception as e:
        print(f"⚠️  Warning: Could not create sample data: {str(e)}")
        # Don't fail the entire process if sample data creation fails
        pass

if __name__ == "__main__":
    print("🚀 Resetting development database...")
    print("⚠️  This will DROP all existing data!")
    
    # Ask for confirmation in development
    response = input("Are you sure you want to reset the database? (y/N): ")
    if response.lower() != 'y':
        print("❌ Database reset cancelled")
        sys.exit(0)
    
    success = reset_database()
    if success:
        print("✅ Database reset complete!")
        print("🎉 Your development database is ready!")
    else:
        print("❌ Database reset failed!")
        sys.exit(1) 