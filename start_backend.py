#!/usr/bin/env python3
"""
Auto-startup script for Zara backend
Handles all setup and runs the Flask server automatically
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(command, cwd=None, check=True):
    """Run a command and return the result"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            check=check,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        if e.stderr:
            print(f"Error output: {e.stderr}")
        return e

def setup_environment():
    """Set up the Python environment and dependencies"""
    print("🔧 Setting up environment...")
    
    # Change to the backend directory
    backend_dir = Path("app/backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    os.chdir(backend_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check if virtual environment exists
    venv_path = Path("venv")
    if not venv_path.exists():
        print("🔧 Creating virtual environment...")
        run_command("python3 -m venv venv")
    
    # Activate virtual environment and install dependencies
    print("📦 Installing dependencies...")
    
    # Use the virtual environment's pip
    pip_cmd = "venv/bin/pip" if os.name != 'nt' else r"venv\Scripts\pip"
    python_cmd = "venv/bin/python" if os.name != 'nt' else r"venv\Scripts\python"
    
    # Install requirements
    if Path("requirements.txt").exists():
        run_command(f"{pip_cmd} install -r requirements.txt")
    else:
        # Install common Flask dependencies
        run_command(f"{pip_cmd} install flask flask-sqlalchemy flask-migrate flask-cors flask-jwt-extended flask-limiter pymysql")
    
    return True

def setup_database():
    """Set up the database"""
    print("🗄️ Setting up database...")
    
    # Create database tables
    setup_script = """
from app.backend.app import create_app
from app.backend.extensions import db

app = create_app()
with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")
"""
    
    with open("setup_db.py", "w") as f:
        f.write(setup_script)
    
    # Run the setup script
    python_cmd = "venv/bin/python" if os.name != 'nt' else r"venv\Scripts\python"
    result = run_command(f"{python_cmd} setup_db.py", check=False)
    
    # Clean up
    if Path("setup_db.py").exists():
        Path("setup_db.py").unlink()
    
    return result.returncode == 0

def start_server():
    """Start the Flask development server"""
    print("🚀 Starting Flask server...")
    
    # Set environment variables
    os.environ['FLASK_APP'] = 'app.backend.app:create_app'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    # Use the virtual environment's python
    python_cmd = "venv/bin/python" if os.name != 'nt' else r"venv\Scripts\python"
    
    # Start the server
    print("🌐 Server starting at http://localhost:5000")
    print("📱 API endpoints available at http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Run the Flask app
        subprocess.run(
            f"{python_cmd} -m flask run --host=0.0.0.0 --port=5000 --debug",
            shell=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("🚀 Zara Backend Auto-Startup")
    print("=" * 50)
    
    # Store original directory
    original_dir = os.getcwd()
    
    try:
        # Setup environment
        if not setup_environment():
            print("❌ Environment setup failed!")
            return
        
        # Setup database
        if not setup_database():
            print("⚠️ Database setup had issues, but continuing...")
        
        # Start server
        start_server()
        
    except Exception as e:
        print(f"❌ Startup failed: {e}")
    finally:
        # Return to original directory
        os.chdir(original_dir)

if __name__ == "__main__":
    main() 