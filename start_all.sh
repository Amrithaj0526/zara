#!/bin/bash

echo "🚀 Starting Zara Full Stack Application..."
echo "=========================================="

# Start backend in background
echo "🔧 Starting Backend..."
python run_backend.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting Frontend..."
./start_frontend.sh &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "🌐 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:5173"
echo "🛑 Press Ctrl+C to stop both servers"
echo "=" * 50

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 