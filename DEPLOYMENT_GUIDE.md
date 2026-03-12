# Kivi Dashboard - Complete Deployment Guide

## 📋 Overview
This guide provides complete instructions for deploying the Kivi Educational Therapy Management Dashboard to production server.

## 🖥️ Server Information
- **Domain:** `dashboard.iplanbymsl.in`
- **IP Address:** `195.35.45.17`
- **SSH Access:** `root@195.35.45.17`
- **SSH Password:** `Bazeer@12345`
- **Database Password:** `Tiger@123`
- **Operating System:** Ubuntu 22.04 LTS
- **Web Server:** Nginx
- **Process Manager:** PM2
- **Database:** MySQL 8.0

## 📁 Folder Structure
```
/var/www/dashboard/          # Frontend (Nginx root)
/root/dashboard/             # Backend & Server files
├── server/                  # Node.js application
│   ├── database.js          # Database configuration
│   ├── index.js            # Main server file
│   ├── package.json        # Dependencies
│   └── .env                # Environment variables
├── client/                  # Source files
└── kivi_local_dump.sql     # Database backup
```

## 🚀 Deployment Steps

### 1. Local Development Setup
```bash
# Clone repository
git clone https://github.com/giteadi/kivi.git
cd kivi

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Configure environment
cp client/.env.example client/.env
# Edit .env with proper API URL
```

### 2. Database Export (Local)
```bash
# Export local database
mysqldump -u root kivi > kivi_local_dump.sql

# Upload to server
sshpass -p Bazeer@12345 scp kivi_local_dump.sql root@195.35.45.17:/root/dashboard/
```

### 3. Server Database Setup
```bash
# Connect to server
sshpass -p Bazeer@12345 ssh root@195.35.45.17

# Create database
mysql -u root -pTiger@123 -e "CREATE DATABASE IF NOT EXISTS kivi;"

# Import data
mysql -u root -pTiger@123 kivi < /root/dashboard/kivi_local_dump.sql
```

### 4. Backend Deployment
```bash
# Upload backend files
tar -czf server-files.tar.gz server/
sshpass -p Bazeer@12345 scp server-files.tar.gz root@195.35.45.17:/root/dashboard/

# Extract on server
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "cd /root/dashboard && tar -xzf server-files.tar.gz"

# Install dependencies
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "cd /root/dashboard/server && npm install"

# Start with PM2
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "cd /root/dashboard/server && pm2 start npm --name kivi -- run dev"

# Save PM2 configuration
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "pm2 save"
```

### 5. Frontend Deployment
```bash
# Build frontend
cd client && npm run build

# Upload build
sshpass -p Bazeer@12345 scp -r dist/ root@195.35.45.17:/var/www/dashboard/

# Set proper permissions
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "chown -R www-data:www-data /var/www/dashboard"
```

### 6. Nginx Configuration
Create/Update `/etc/nginx/sites-available/dashboard`:

```nginx
upstream dashboard_backend {
    server 127.0.0.1:3005;
    keepalive 64;
}

server {
    if ($host = dashboard.iplanbymsl.in) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name dashboard.iplanbymsl.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.iplanbymsl.in;
    ssl_certificate /etc/letsencrypt/live/api.iplanbymsl.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.iplanbymsl.in/privkey.pem;

    root /var/www/dashboard;
    index index.html;

    access_log /var/log/nginx/dashboard-access.log;
    error_log /var/log/nginx/dashboard-error.log;

    client_max_body_size 50M;

    # API proxy - IMPORTANT: /api/ with trailing slash
    location /api/ {
        proxy_pass http://dashboard_backend;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
    }

    # Health check
    location /health {
        proxy_pass http://dashboard_backend/health;
    }

    # Frontend files
    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d dashboard.iplanbymsl.in

# Test renewal
certbot renew --dry-run
```

## 🔧 SSH Commands Reference

### File Operations
```bash
# Upload files
sshpass -p Bazeer@12345 scp file.txt root@195.35.45.17:/path/

# Download files
sshpass -p Bazeer@12345 scp root@195.35.45.17:/path/file.txt .

# Upload directory
sshpass -p Bazeer@12345 scp -r folder/ root@195.35.45.17:/path/
```

### Server Management
```bash
# Check services
pm2 status
pm2 logs kivi
systemctl status nginx
systemctl status mysql

# Restart services
pm2 restart kivi
systemctl reload nginx
systemctl restart mysql

# Check disk space
df -h
du -sh /var/www/dashboard
du -sh /root/dashboard
```

### Database Operations
```bash
# Connect to database
mysql -u root -pTiger@123 kivi

# List databases
mysql -u root -pTiger@123 -e "SHOW DATABASES;"

# Backup database
mysqldump -u root -pTiger@123 kivi > backup.sql

# Restore database
mysql -u root -pTiger@123 kivi < backup.sql
```

## 🛠️ Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:3005/api/dashboard/data

# Check PM2 logs
pm2 logs kivi --lines 50

# Restart backend
pm2 restart kivi
```

### Database Issues
```bash
# Test database connection
mysql -u root -pTiger@123 -e "SELECT 1;"

# Check database exists
mysql -u root -pTiger@123 -e "SHOW DATABASES LIKE 'kivi';"
```

### Frontend Issues
```bash
# Check nginx configuration
nginx -t

# Check frontend files exist
ls -la /var/www/dashboard/

# Check permissions
ls -ld /var/www/dashboard
```

### Permission Issues
```bash
# Fix frontend permissions
chown -R www-data:www-data /var/www/dashboard
chmod -R 755 /var/www/dashboard

# Fix backend permissions
chown -R root:root /root/dashboard
chmod -R 755 /root/dashboard
```

## 📊 Monitoring & Logs

### Application Logs
```bash
# PM2 logs
pm2 logs kivi
pm2 logs kivi --lines 100

# Nginx logs
tail -f /var/log/nginx/dashboard-access.log
tail -f /var/log/nginx/dashboard-error.log

# System logs
journalctl -u nginx -f
journalctl -u mysql -f
```

### Performance Monitoring
```bash
# Check resource usage
htop
df -h
free -h

# PM2 monitoring
pm2 monit
pm2 show kivi
```

### Health Checks
```bash
# API health check
curl -I https://dashboard.iplanbymsl.in/api/dashboard/data

# Frontend health check
curl -I https://dashboard.iplanbymsl.in/

# Database health check
mysql -u root -pTiger@123 -e "SELECT COUNT(*) FROM kivi_sessions;"
```

## 🔄 Update Procedures

### Backend Updates
```bash
# Upload new files
tar -czf server-update.tar.gz server/
sshpass -p Bazeer@12345 scp server-update.tar.gz root@195.35.45.17:/root/dashboard/

# Extract and restart
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "cd /root/dashboard && tar -xzf server-update.tar.gz && cd server && npm install && pm2 restart kivi"
```

### Frontend Updates
```bash
# Build and deploy
npm run build
sshpass -p Bazeer@12345 scp -r dist/ root@195.35.45.17:/var/www/dashboard/
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "chown -R www-data:www-data /var/www/dashboard"
```

### Database Updates
```bash
# Export local changes
mysqldump -u root kivi > kivi_updated.sql
sshpass -p Bazeer@12345 scp kivi_updated.sql root@195.35.45.17:/root/dashboard/
sshpass -p Bazeer@12345 ssh root@195.35.45.17 "mysql -u root -pTiger@123 kivi < /root/dashboard/kivi_updated.sql"
```

## 📞 Support

### Emergency Contacts
- **Developer:** Aditya Sharma
- **Server Admin:** Server Administrator
- **Domain:** iplanbymsl.in

### Common Issues & Solutions
1. **500 Internal Server Error:** Check nginx error logs
2. **API Connection Failed:** Verify backend is running on port 3005
3. **Database Connection Failed:** Check MySQL service and credentials
4. **SSL Certificate Expired:** Run `certbot renew`

---

**Last Updated:** March 12, 2026
**Version:** 1.0
**Status:** Production Ready
