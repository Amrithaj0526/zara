#!/bin/bash

echo "🚀 Starting Zara Backend with gunicorn..."
echo "=========================================="

# Set environment variables
export FLASK_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start gunicorn with explicit Python path
echo "🌐 Starting server on port $PORT..."
echo "📍 Server will be available at: http://localhost:$PORT"

# Use python -m gunicorn instead of direct gunicorn command
python -m gunicorn main:app \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 30 \
    --access-logfile - \
    --error-logfile - \
    --log-level info 