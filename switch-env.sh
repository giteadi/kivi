#!/bin/bash

# Development Mode Switcher - Switch between localhost and production

cd "$(dirname "$0")/client"

if [ "$1" == "local" ]; then
    echo "🔄 Switching to LOCALHOST mode..."
    cat > .env << 'EOF'
# Local Development - Using Localhost Backend
VITE_API_URL=http://localhost:3005/api
VITE_ENV=development
EOF
    echo "✅ Switched to localhost"
    echo "Make sure backend is running: cd server && npm run dev"
    echo ""
    echo "Start frontend with: npm run dev"
    
elif [ "$1" == "production" ] || [ "$1" == "prod" ]; then
    echo "🔄 Switching to PRODUCTION mode..."
    cat > .env << 'EOF'
# Development using Production API
VITE_API_URL=https://dashboard.iplanbymsl.in/api
VITE_ENV=development
EOF
    echo "✅ Switched to production"
    echo "Start frontend with: npm run dev"
    
else
    echo "Usage: ./switch-env.sh [local|production]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh local       # Use localhost backend (3005)"
    echo "  ./switch-env.sh production  # Use production server"
    echo ""
    echo "Current .env:"
    grep VITE_API_URL .env
fi
