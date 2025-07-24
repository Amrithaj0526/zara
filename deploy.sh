#!/bin/bash

# Zara App Deployment Script for Render
# This script helps prepare the application for deployment

echo "🚀 Preparing Zara App for Render Deployment..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found render.yaml configuration"

# Check backend requirements
if [ ! -f "app/backend/requirements.txt" ]; then
    echo "❌ Error: Backend requirements.txt not found"
    exit 1
fi

echo "✅ Backend requirements found"

# Check frontend package.json
if [ ! -f "app/frontend/package.json" ]; then
    echo "❌ Error: Frontend package.json not found"
    exit 1
fi

echo "✅ Frontend package.json found"

# Check main entry point
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py entry point not found"
    exit 1
fi

echo "✅ Main entry point found"

# Test backend build
echo "🔧 Testing backend build..."
cd app/backend
python3 -c "import sys; sys.path.append('.'); from app import create_app; app = create_app(); print('✅ Backend app created successfully')"
cd ../..

# Test frontend build
echo "🔧 Testing frontend build..."
cd app/frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ../..

echo ""
echo "🎉 All checks passed! Your app is ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Render"
echo "3. Deploy using the render.yaml configuration"
echo "4. Set up environment variables in Render dashboard"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md" 