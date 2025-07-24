#!/usr/bin/env python3
"""
Test script to verify gunicorn installation and app loading
"""

import sys
import os

def test_gunicorn():
    """Test if gunicorn can be imported and app can be loaded"""
    try:
        import gunicorn
        print(f"✅ Gunicorn imported successfully: {gunicorn.__version__}")
    except ImportError as e:
        print(f"❌ Failed to import gunicorn: {e}")
        return False
    
    try:
        from app import create_app
        app = create_app()
        print("✅ Flask app created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create Flask app: {e}")
        return False

if __name__ == "__main__":
    success = test_gunicorn()
    sys.exit(0 if success else 1) 