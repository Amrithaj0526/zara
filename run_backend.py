#!/usr/bin/env python3
"""
Fast backend startup script
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    print("🚀 Starting Zara Backend...")
    
    # Change to backend directory
    backend_dir = Path("app/backend")
    os.chdir(backend_dir)
    
    # Activate virtual environment
    venv_python = "venv/bin/python"
    
    # Set environment variables
    os.environ['FLASK_APP'] = 'app.py'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    print("🌐 Server starting at http://localhost:5000")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 50)
    
    # Start the server
    subprocess.run([venv_python, "-m", "flask", "run", "--host=0.0.0.0", "--port=5000", "--debug"])

if __name__ == "__main__":
    main() 