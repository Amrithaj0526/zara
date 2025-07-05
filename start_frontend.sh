#!/bin/bash

echo "🚀 Starting Zara Frontend..."
echo "================================"

# Change to frontend directory
cd app/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Frontend starting at http://localhost:5173"
echo "🛑 Press Ctrl+C to stop"
echo "=" * 50

npm run dev 