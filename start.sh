#!/bin/bash

echo "🚀 Starting Zara Backend..."
echo "================================"

# Change to backend directory
cd app/backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
else
    echo "📦 Installing Flask dependencies..."
    pip install flask flask-sqlalchemy flask-migrate flask-cors flask-jwt-extended flask-limiter pymysql
fi

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Create database tables
echo "🗄️ Setting up database..."
python -c "
from app import create_app
from extensions import db
app = create_app()
with app.app_context():
    db.create_all()
    print('✅ Database tables created successfully!')
"

# Start the server
echo "🌐 Starting Flask server at http://localhost:5000"
echo "🛑 Press Ctrl+C to stop"
echo "================================"

flask run --host=0.0.0.0 --port=5000 --debug 