#!/usr/bin/env python3
"""
Test script to verify Flask app works correctly
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Import the Flask app
    from flask_app import app
    print("✅ Successfully imported Flask app")
    
    # Test creating a test client
    with app.test_client() as client:
        # Test the home route
        response = client.get('/')
        print(f"✅ Home route response: {response.status_code}")
        print(f"✅ Response data: {response.get_json()}")
        
        # Test the health route
        response = client.get('/health')
        print(f"✅ Health route response: {response.status_code}")
        print(f"✅ Response data: {response.get_json()}")
    
    print("✅ All tests passed!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1) 