#!/usr/bin/env python3
"""
Database setup script
"""

import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app', 'backend'))

from app import create_app
from extensions import db
from models.user import User
from models.profile import Profile
from sqlalchemy import inspect

def create_tables():
    """Create all database tables"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ All database tables created successfully!")
            
            # Verify tables exist
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Created tables: {tables}")
            
        except Exception as e:
            print(f"❌ Error creating tables: {str(e)}")
            return False
    
    return True

if __name__ == "__main__":
    print("🚀 Creating database tables...")
    success = create_tables()
    if success:
        print("✅ Database setup complete!")
    else:
        print("❌ Database setup failed!")
        sys.exit(1) 