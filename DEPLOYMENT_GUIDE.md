# Zara App Deployment Guide for Render

## Project Structure Overview

```
zara/
├── app/
│   ├── backend/                 # Flask Backend API
│   │   ├── api/                # API routes and endpoints
│   │   ├── models/             # Database models
│   │   ├── migrations/         # Database migrations
│   │   ├── app.py              # Flask application factory
│   │   ├── config.py           # Configuration settings
│   │   ├── main.py             # Entry point for Render
│   │   └── requirements.txt    # Python dependencies
│   ├── frontend/               # React Frontend
│   │   ├── src/                # React source code
│   │   ├── public/             # Static assets
│   │   ├── package.json        # Node.js dependencies
│   │   └── vite.config.ts      # Vite configuration
│   └── uploads/                # File uploads directory
├── render.yaml                 # Render deployment configuration
└── main.py                     # Root entry point for backend
```

## Application Components

### 1. Backend (Flask API)
- **Framework**: Flask with SQLAlchemy
- **Database**: PostgreSQL (production) / MySQL (development)
- **Authentication**: JWT tokens
- **Features**: User auth, posts, feed, jobs, messaging, file uploads
- **Entry Point**: `app/backend/main.py`

### 2. Frontend (React)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Features**: User interface for all backend functionality
- **Entry Point**: `app/frontend/src/App.tsx`

### 3. Database
- **Production**: PostgreSQL (Render PostgreSQL)
- **Development**: MySQL
- **Migrations**: Alembic

## Render Deployment Setup

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your repository

### Step 2: Set Up PostgreSQL Database

1. **Create Database Service**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `zara-database`
   - Database: `zara_db`
   - User: `zara_user`
   - Click "Create Database"

2. **Get Database URL**
   - Copy the "External Database URL"
   - Format: `postgresql://user:password@host:port/database`

### Step 3: Deploy Backend API

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `zara-backend`

2. **Configure Backend Service**
   ```
   Build Command: pip install -r app/backend/requirements.txt
   Start Command: gunicorn app.backend.main:app
   Root Directory: app/backend
   ```

3. **Environment Variables**
   ```
   DATABASE_URL: [Your PostgreSQL URL from Step 2]
   SECRET_KEY: [Generate a random secret key]
   JWT_SECRET_KEY: [Generate a random JWT secret]
   ALLOWED_ORIGINS: https://your-frontend-url.onrender.com
   FLASK_ENV: production
   ```

### Step 4: Deploy Frontend

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Name: `zara-frontend`

2. **Configure Frontend Service**
   ```
   Build Command: cd app/frontend && npm install && npm run build
   Publish Directory: app/frontend/dist
   Root Directory: app/frontend
   ```

3. **Environment Variables**
   ```
   VITE_API_URL: https://your-backend-url.onrender.com
   ```

### Step 5: Update Configuration Files

1. **Update render.yaml** (see updated file below)
2. **Update CORS settings** in backend
3. **Update API endpoints** in frontend

### Step 6: Database Migrations

1. **Run migrations on backend deployment**
   - Add to start command: `flask db upgrade`
   - Or run manually in Render shell

## Updated Configuration Files

### Updated render.yaml
```yaml
services:
  # PostgreSQL Database
  - type: pserv
    name: zara-database
    env: postgresql
    plan: free
    ipAllowList: []

  # Backend API
  - type: web
    name: zara-backend
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn main:app
    envVars:
      - key: DATABASE_URL
        fromService:
          name: zara-database
          type: pserv
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: ALLOWED_ORIGINS
        sync: false
      - key: FLASK_ENV
        value: production
    workingDir: app/backend

  # Frontend Static Site
  - type: web
    name: zara-frontend
    env: static
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        sync: false
    workingDir: app/frontend
```

## Environment Variables Reference

### Backend Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Flask secret key for sessions
- `JWT_SECRET_KEY`: Secret for JWT token signing
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs
- `FLASK_ENV`: Set to 'production' for deployment

### Frontend Environment Variables
- `VITE_API_URL`: Backend API base URL

## Deployment Checklist

### Pre-Deployment
- [ ] Update `render.yaml` with correct configuration
- [ ] Ensure all environment variables are set
- [ ] Test database migrations locally
- [ ] Verify frontend builds successfully
- [ ] Check CORS settings for production URLs

### Post-Deployment
- [ ] Verify backend API is accessible
- [ ] Test database connections
- [ ] Run database migrations
- [ ] Verify frontend loads correctly
- [ ] Test authentication flow
- [ ] Check file upload functionality
- [ ] Monitor application logs

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check if database service is running
   - Ensure migrations are applied

2. **CORS Errors**
   - Update ALLOWED_ORIGINS with correct frontend URL
   - Check if frontend URL is accessible

3. **Build Failures**
   - Check requirements.txt for missing dependencies
   - Verify Node.js version compatibility
   - Check for TypeScript compilation errors

4. **File Upload Issues**
   - Ensure uploads directory has write permissions
   - Check if storage is properly configured

### Monitoring and Logs
- Use Render's built-in logging
- Monitor application performance
- Set up alerts for service failures

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use Render's environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS in production

## Performance Optimization

1. **Backend**
   - Enable gunicorn workers
   - Use connection pooling
   - Implement caching

2. **Frontend**
   - Optimize bundle size
   - Enable compression
   - Use CDN for static assets

3. **Database**
   - Add appropriate indexes
   - Monitor query performance
   - Regular maintenance

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security patches
   - Update Node.js and Python versions

2. **Backup Strategy**
   - Regular database backups
   - Version control for code
   - Document configuration changes

3. **Monitoring**
   - Set up health checks
   - Monitor error rates
   - Track performance metrics 