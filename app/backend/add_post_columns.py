#!/usr/bin/env python3
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db
from sqlalchemy import text

def add_post_columns():
    app = create_app()
    with app.app_context():
        try:
            # Add category column
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE post ADD COLUMN category VARCHAR(100)"))
                conn.commit()
            print("✅ Added category column to post table")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("ℹ️  category column already exists")
            else:
                print(f"❌ Error adding category column: {e}")
        
        try:
            # Add visibility column
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE post ADD COLUMN visibility VARCHAR(20) DEFAULT 'public'"))
                conn.commit()
            print("✅ Added visibility column to post table")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("ℹ️  visibility column already exists")
            else:
                print(f"❌ Error adding visibility column: {e}")
        
        print("✅ Post table columns updated successfully!")

if __name__ == "__main__":
    add_post_columns() 