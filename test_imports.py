#!/usr/bin/env python3
"""
Test script to verify imports work correctly
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Test importing the Flask app
    from app.backend.app import app
    print("✅ Successfully imported Flask app")
    
    # Test creating the app
    test_app = app
    print("✅ Successfully created app instance")
    
    print("✅ All imports working correctly!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1) 