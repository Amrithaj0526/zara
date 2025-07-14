#!/bin/bash

echo "🚀 Deploying Zara Backend..."
echo "============================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
flask db upgrade

# Start the application
echo "🌐 Starting Flask application..."
echo "📍 Server will be available at: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop"

python main.py 