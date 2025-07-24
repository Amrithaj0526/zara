#!/bin/bash

# Direct Backend Installation Script
# Installs all Flask dependencies directly without requirements.txt

echo "🚀 Installing Zara Backend Dependencies..."

# Create virtual environment if it doesn't exist
if [ ! -d "app/backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv app/backend/venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source app/backend/venv/bin/activate

# Install Flask and core dependencies
echo "📥 Installing Flask and core dependencies..."
pip install Flask==2.3.3

# Install database dependencies
echo "🗄️ Installing database dependencies..."
pip install Flask-SQLAlchemy==3.0.5
pip install Flask-Migrate==4.0.5
pip install psycopg2-binary==2.9.9
pip install mysqlclient==2.2.0

# Install authentication and security
echo "🔐 Installing authentication dependencies..."
pip install Flask-JWT-Extended==4.5.2
pip install python-dotenv==1.0.1

# Install CORS and rate limiting
echo "🌐 Installing CORS and rate limiting..."
pip install Flask-Cors==4.0.0
pip install Flask-Limiter==3.5.0

# Install image processing
echo "🖼️ Installing image processing..."
pip install Pillow==10.0.1

# Install development tools
echo "🛠️ Installing development tools..."
pip install pytest==7.4.0
pip install black==23.7.0
pip install flake8==6.1.0

# Install production server
echo "🚀 Installing production server..."
pip install gunicorn==21.2.0

echo ""
echo "✅ Backend dependencies installed successfully!"
echo ""
echo "🔧 To activate the environment:"
echo "   source app/backend/venv/bin/activate"
echo ""
echo "🚀 To run the backend:"
echo "   export FLASK_APP=app.backend.app:app && flask run"
echo ""
echo "📊 To run with gunicorn:"
echo "   gunicorn main:app" 