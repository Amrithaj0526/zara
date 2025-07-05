#!/bin/bash

echo "🚀 Auto Starting Zara Full Stack..."
echo "=================================="

# Kill any existing processes
pkill -f "python.*main.py" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null

# Start backend
echo "🔧 Starting Backend..."
python run_backend.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
./start_frontend.sh &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "🌐 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:5173"
echo "🛑 Press Ctrl+C to stop both servers"
echo "=================================="

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 