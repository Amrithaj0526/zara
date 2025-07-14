"""
Main application entry point for development and production
"""
from app import create_app

# Create the Flask app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    # Development server
    app.run(debug=True, host='0.0.0.0', port=5000) 