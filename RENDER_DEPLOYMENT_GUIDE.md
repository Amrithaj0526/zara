# Render Deployment Guide for Zara Application

## ✅ **Fixed Issues**
- ✅ Added `gunicorn` to requirements.txt
- ✅ Added `psycopg2-binary` for PostgreSQL support
- ✅ Updated main.py to properly expose Flask app
- ✅ Created gunicorn configuration
- ✅ Updated Procfile for production deployment

## 🚀 **Step-by-Step Render Deployment**

### **Phase 1: Database Setup**

#### **Step 1: Create PostgreSQL Database**
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `prok-database`
   - **Database**: `prok_db`
   - **User**: `prok_user`
   - **Region**: Choose closest to you
4. Click **"Create Database"**
5. **Save the connection string** from the "Connections" tab

### **Phase 2: Backend Deployment**

#### **Step 2: Create Web Service for Backend**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Choose branch: `main` (or your deployment branch)

#### **Step 3: Configure Backend Service**
- **Name**: `prok-backend`
- **Root Directory**: `app/backend`
- **Runtime**: `Python 3`
- **Region**: Same as your database

#### **Step 4: Set Build and Start Commands**

**Build Command**:
```bash
pip install -r requirements.txt
```

**Start Command**:
```bash
gunicorn main:app --bind 0.0.0.0:$PORT
```

#### **Step 5: Set Environment Variables**

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `FLASK_ENV` | `production` | Flask environment |
| `PYTHON_VERSION` | `3.10.12` | Python version |
| `DATABASE_URL` | `postgresql://prok_user:password@host:port/prok_db` | Your PostgreSQL connection string |
| `SECRET_KEY` | `zara-secret-key-2024-production-deployment-secure-random-string-12345` | Flask secret key |
| `JWT_SECRET_KEY` | `zara-jwt-secret-key-2024-production-deployment-secure-random-string-67890` | JWT secret key |
| `ALLOWED_ORIGINS` | `https://your-frontend-url.onrender.com` | CORS allowed origins (update after frontend deployment) |

#### **Step 6: Deploy Backend**
1. Click **"Create Web Service"**
2. Wait for build to complete (3-5 minutes)
3. Note your backend URL (e.g., `https://prok-backend.onrender.com`)

### **Phase 3: Frontend Deployment**

#### **Step 7: Create Static Site for Frontend**
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Choose branch: `main` (or your deployment branch)

#### **Step 8: Configure Frontend Service**
- **Name**: `prok-frontend`
- **Root Directory**: `app/frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### **Step 9: Set Frontend Environment Variables**
- **Variable Name**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (use your actual backend URL)

#### **Step 10: Deploy Frontend**
1. Click **"Create Static Site"**
2. Wait for build to complete (2-3 minutes)
3. Note your frontend URL (e.g., `https://prok-frontend.onrender.com`)

### **Phase 4: Final Configuration**

#### **Step 11: Update Backend CORS**
1. Go back to your backend service
2. Go to **"Environment"** tab
3. Update `ALLOWED_ORIGINS` with your frontend URL
4. Click **"Manual Deploy"** → **"Deploy latest commit"**

## 🔧 **Updated Files for Deployment**

### **requirements.txt** (Updated)
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-JWT-Extended==4.5.2
Flask-Cors==4.0.0
python-dotenv==1.0.1
Flask-Limiter==3.5.0
mysqlclient==2.2.0
pytest==7.4.0
black==23.7.0
flake8==6.1.0 
pillow
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

### **main.py** (Updated)
```python
"""
Main application entry point for development and production
"""
from app import create_app

# Create the Flask app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    # Development server
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### **Procfile** (Updated)
```
web: cd app/backend && gunicorn main:app --bind 0.0.0.0:$PORT
```

## 🐛 **Troubleshooting**

### **If Backend Deployment Fails**:
1. **Check Build Logs**: Look for Python dependency issues
2. **Verify Requirements**: Ensure `gunicorn` is in requirements.txt
3. **Check Environment Variables**: Ensure all required variables are set
4. **Database Connection**: Verify `DATABASE_URL` is correct

### **If Frontend Deployment Fails**:
1. **Check Build Logs**: Look for npm dependency issues
2. **Verify Package.json**: Ensure it exists in app/frontend/
3. **Check Environment Variables**: Ensure `VITE_API_URL` is set

### **If Frontend Can't Connect to Backend**:
1. **Verify URLs**: Check `VITE_API_URL` points to correct backend
2. **Check CORS**: Ensure `ALLOWED_ORIGINS` includes frontend URL
3. **Test API**: Visit backend URL directly to verify it's running

## ✅ **Success Indicators**

Your deployment is successful when:
- ✅ Backend responds at `https://your-backend-url.onrender.com`
- ✅ Frontend loads at `https://your-frontend-url.onrender.com`
- ✅ Users can register and login
- ✅ All features work (posts, profiles, messaging, jobs)
- ✅ File uploads work correctly
- ✅ No CORS errors in browser console

## 🔄 **Post-Deployment Steps**

1. **Test All Features**:
   - User registration/login
   - Profile creation/editing
   - Post creation and viewing
   - File uploads
   - Messaging functionality
   - Job board features

2. **Monitor Performance**:
   - Check response times
   - Monitor error rates
   - Set up alerts for downtime

3. **Security Review**:
   - Verify HTTPS is working
   - Check CORS configuration
   - Ensure secrets are secure

## 📊 **Environment Variables Reference**

### **Backend Environment Variables**
```env
FLASK_ENV=production
PYTHON_VERSION=3.10.12
DATABASE_URL=postgresql://prok_user:password@host:port/prok_db
SECRET_KEY=your-secure-secret-key-here
JWT_SECRET_KEY=your-secure-jwt-secret-key-here
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
```

### **Frontend Environment Variables**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🎯 **Deployment Checklist**

- [ ] PostgreSQL database created
- [ ] Backend service deployed with gunicorn
- [ ] Frontend service deployed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] All features tested
- [ ] Performance monitored
- [ ] Security verified

Your Zara application is now ready for production deployment on Render! 🚀 