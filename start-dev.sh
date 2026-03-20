#!/bin/bash

# Kivi Local Development Setup Script
# Starts both backend and frontend servers

echo "🚀 Starting Kivi Development Environment..."
echo ""

# Check if ports are available
echo "📍 Checking if ports 3005 (backend) and 5173 (frontend) are available..."

# Kill any existing processes on these ports
lsof -ti:3005 > /dev/null 2>&1 && echo "⚠️  Port 3005 already in use, killing existing process..." && kill -9 $(lsof -ti:3005) 2>/dev/null

lsof -ti:5173 > /dev/null 2>&1 && echo "⚠️  Port 5173 already in use, killing existing process..." && kill -9 $(lsof -ti:5173) 2>/dev/null

echo ""
echo "Ports cleared. Starting services..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Terminal 1: Start backend
echo "📌 Starting Backend Server (Port 3005)..."
echo "   Command: cd $SCRIPT_DIR/server && npm run dev"
echo ""
(cd "$SCRIPT_DIR/server" && npm run dev) &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Terminal 2: Start frontend
echo "📌 Starting Frontend Dev Server (Port 5173)..."
echo "   Command: cd $SCRIPT_DIR/client && npm run dev"
echo ""
(cd "$SCRIPT_DIR/client" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo ""
echo "📱 Frontend: http://localhost:5173/"
echo "🔌 Backend API: http://localhost:3005/api"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
