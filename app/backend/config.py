"""App configuration with safe MySQL password handling."""
import os
from datetime import timedelta
from urllib.parse import quote_plus

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    
    # Database
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = quote_plus(os.environ.get('MYSQL_PASSWORD', 'Ammu@123'))
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'PROK_DB')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS
    CORS_HEADERS = 'Content-Type' 