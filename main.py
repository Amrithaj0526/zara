#!/usr/bin/env python3
"""
Main entry point for Render deployment
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app from flask_app.py
from flask_app import app

if __name__ == "__main__":
    app.run(debug=False) 