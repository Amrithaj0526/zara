#!/bin/bash

echo "🚀 Building Zara Frontend for Production..."
echo "=========================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo "🌐 Ready for deployment!" 