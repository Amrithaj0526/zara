#!/bin/bash

echo "🚀 Deploying Zara Backend to Render..."
echo "======================================="

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
flask db upgrade

# Start the application with gunicorn
echo "🌐 Starting application with gunicorn..."
echo "📍 Server will be available at: http://localhost:$PORT"
echo "🛑 Press Ctrl+C to stop"

# Use gunicorn for production
gunicorn main:app --bind 0.0.0.0:$PORT --workers 2 --timeout 30 