#!/bin/bash

# Kivi Dashboard - Quick Deployment Script
# Usage: ./deploy.sh [frontend|backend|both]

set -e

SERVER_IP="195.35.45.17"
SSH_USER="aditya"
FRONTEND_PATH="/var/www/dashboard"
BACKEND_PATH="/root/dashboard"
LOCAL_CLIENT_PATH="/Users/adityasharma/Desktop/kivi/client"
LOCAL_SERVER_PATH="/Users/adityasharma/Desktop/kivi/server"

echo "🚀 Kivi Dashboard Deployment Script"
echo "==================================="

# Function to deploy frontend
deploy_frontend() {
    echo "📦 Building frontend..."
    cd "$LOCAL_CLIENT_PATH"
    npm run build
    
    echo "📤 Uploading frontend to server..."
    tar -czf /tmp/kivi-dist.tar.gz -C dist .
    scp /tmp/kivi-dist.tar.gz $SSH_USER@$SERVER_IP:/tmp/
    
    echo "📂 Extracting frontend on server..."
    ssh $SSH_USER@$SERVER_IP "sudo rm -rf $FRONTEND_PATH/* && sudo tar -xzf /tmp/kivi-dist.tar.gz -C $FRONTEND_PATH && sudo chown -R www-data:www-data $FRONTEND_PATH"
    
    echo "✅ Frontend deployed successfully!"
}

# Function to deploy backend
deploy_backend() {
    echo "📦 Packaging backend..."
    cd "$LOCAL_SERVER_PATH"
    tar -czf /tmp/server-update.tar.gz --exclude='node_modules' .
    scp /tmp/server-update.tar.gz $SSH_USER@$SERVER_IP:/tmp/
    
    echo "📤 Deploying backend to server..."
    ssh $SSH_USER@$SERVER_IP "
        sudo mkdir -p $BACKEND_PATH && cd $BACKEND_PATH
        sudo tar -xzf /tmp/server-update.tar.gz
        cd server && sudo npm install
        sudo pm2 restart dashboard || sudo pm2 start index.js --name dashboard
        sudo pm2 save
    "
    
    echo "✅ Backend deployed successfully!"
}

# Main deployment logic
case "${1:-both}" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    both)
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo "Usage: ./deploy.sh [frontend|backend|both]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed!"
echo "🔗 URL: https://dashboard.iplanbymsl.in"
echo ""
echo "📊 Check status:"
echo "   ssh $SSH_USER@$SERVER_IP 'pm2 status'"
