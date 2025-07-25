import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app
from app.backend.app import app

# This is the WSGI application that Render will use
application = app

if __name__ == "__main__":
    app.run(debug=False) 