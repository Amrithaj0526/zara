#!/bin/bash

echo "🚀 Building Zara Backend for Render..."
echo "======================================="

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Verify gunicorn installation
echo "🔍 Verifying gunicorn installation..."
python -c "import gunicorn; print('Gunicorn version:', gunicorn.__version__)"

# Run database migrations
echo "🗄️ Running database migrations..."
flask db upgrade

echo "✅ Build completed successfully!"
echo "🌐 Ready for deployment with gunicorn!" 