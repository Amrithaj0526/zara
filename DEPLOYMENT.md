# Zara Application Deployment Guide

This guide will help you deploy the Zara application to production environments.

## Prerequisites

- Git repository with your code
- Cloud hosting platform account (Render, Railway, Heroku, etc.)
- Database service (PostgreSQL recommended for production)

## Frontend Deployment

### 1. Environment Variables

Create a `.env` file in the `app/frontend/` directory:

```bash
# Copy the example file
cp app/frontend/env.example app/frontend/.env
```

Update the `.env` file with your production backend URL:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 2. Build Configuration

The frontend is configured with Vite and will automatically build for production when you run:

```bash
cd app/frontend
npm run build
```

### 3. Deployment Platforms

#### Render (Recommended)
1. Connect your GitHub repository
2. Set build command: `cd app/frontend && npm install && npm run build`
3. Set publish directory: `app/frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

#### Vercel
1. Import your GitHub repository
2. Set root directory to `app/frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

#### Netlify
1. Connect your GitHub repository
2. Set build command: `cd app/frontend && npm install && npm run build`
3. Set publish directory: `app/frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

## Backend Deployment

### 1. Environment Variables

Create a `.env` file in the `app/backend/` directory:

```bash
# Copy the example file
cp app/backend/env.example app/backend/.env
```

Update the `.env` file with your production settings:

```env
# Flask Configuration
SECRET_KEY=your-secure-secret-key-here
FLASK_ENV=production
FLASK_DEBUG=0

# Database Configuration (PostgreSQL recommended)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Configuration
JWT_SECRET_KEY=your-secure-jwt-secret-key-here

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://your-frontend-url.netlify.app
```

### 2. Database Setup

#### PostgreSQL (Recommended for Production)
1. Create a PostgreSQL database on your cloud provider
2. Get the connection string
3. Update `DATABASE_URL` in your environment variables

#### MySQL (Alternative)
If you prefer MySQL, update the environment variables:

```env
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_HOST=your-mysql-host
MYSQL_DB=your-database-name
```

### 3. Deployment Platforms

#### Render (Recommended)
1. Connect your GitHub repository
2. Set build command: `cd app/backend && pip install -r requirements.txt`
3. Set start command: `cd app/backend && python main.py`
4. Add environment variables from your `.env` file

#### Railway
1. Connect your GitHub repository
2. Set the root directory to `app/backend`
3. Add environment variables from your `.env` file
4. Railway will automatically detect Python and install dependencies

#### Heroku
1. Create a `Procfile` in the root directory:
   ```
   web: cd app/backend && python main.py
   ```
2. Deploy using Heroku CLI or GitHub integration
3. Add environment variables in Heroku dashboard

### 4. File Upload Configuration

For file uploads to work in production, you'll need to configure cloud storage:

#### Option 1: Local Storage (Simple)
The current setup uses local storage. For production, ensure your deployment platform supports file persistence.

#### Option 2: Cloud Storage (Recommended)
Update the upload configuration to use cloud storage services like AWS S3, Google Cloud Storage, or Cloudinary.

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secret keys
- Rotate secrets regularly

### 2. CORS Configuration
- Only allow your frontend domain in `ALLOWED_ORIGINS`
- Remove development URLs in production

### 3. Database Security
- Use strong database passwords
- Enable SSL connections
- Restrict database access to your application only

### 4. Rate Limiting
- The application includes rate limiting
- Adjust limits based on your needs

## Testing Deployment

### 1. Health Check
Test your backend API:
```bash
curl https://your-backend-url.onrender.com/
```

### 2. Frontend-Backend Communication
1. Deploy backend first
2. Update frontend environment variables with backend URL
3. Deploy frontend
4. Test authentication and API calls

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` includes your frontend URL
   - Ensure protocol (http/https) matches

2. **Database Connection Errors**
   - Verify `DATABASE_URL` format
   - Check database credentials
   - Ensure database is accessible from your deployment platform

3. **File Upload Issues**
   - Check file permissions
   - Verify upload directory exists
   - Consider using cloud storage

4. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check deployment platform environment variable settings
   - Restart application after adding variables

### Debug Mode
For debugging, temporarily enable debug mode:
```env
FLASK_DEBUG=1
FLASK_ENV=development
```

## Monitoring

### 1. Application Logs
Monitor your application logs for errors and performance issues.

### 2. Database Monitoring
Monitor database performance and connection issues.

### 3. Error Tracking
Consider integrating error tracking services like Sentry.

## Performance Optimization

### 1. Database Indexing
Ensure proper database indexes for frequently queried fields.

### 2. Caching
Consider implementing Redis for session storage and caching.

### 3. CDN
Use a CDN for static assets in production.

## Backup Strategy

### 1. Database Backups
Set up regular database backups.

### 2. File Backups
If using local storage, ensure regular backups of uploaded files.

### 3. Code Backups
Use version control (Git) for code backups.

## SSL/HTTPS

Ensure your deployment platform provides SSL certificates for HTTPS connections.

## Domain Configuration

1. Configure custom domains if needed
2. Update CORS settings with custom domain
3. Update environment variables with new URLs

## Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update environment variables as needed

### 2. Performance Monitoring
- Monitor application performance
- Optimize database queries
- Scale resources as needed

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Test locally with production-like environment
4. Contact platform support if needed 