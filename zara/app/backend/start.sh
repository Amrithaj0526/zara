#!/bin/bash

echo "🚀 Starting Zara Backend with gunicorn..."
echo "=========================================="

# Set environment variables
export FLASK_ENV=production
export FLASK_APP=main:app
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Run database migrations before starting the server
flask db upgrade

# Start gunicorn with explicit Python path
echo "🌐 Starting server on port $PORT..."
echo "📍 Server will be available at: http://localhost:$PORT"

python -m gunicorn main:app \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 30 \
    --access-logfile - \
    --error-logfile - \
    --log-level info 