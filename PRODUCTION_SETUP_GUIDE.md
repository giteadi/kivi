# Kivi Production Server Setup - Complete Guide

## 🔴 Issues Fixed
All frontend components were using direct `fetch('/api/...')` calls with relative paths instead of the centralized API service. This broke in production because:
1. Relative paths try to fetch from the current domain (dashboard.iplanbymsl.in)
2. Without Nginx proxy configuration, `/api` requests fail
3. Backend on port 3005 wasn't being reached

**FIXED:** All 16 components now use the `api` service which respects the `VITE_API_URL` environment variable.

---

## 📋 Production Server Details
- **Domain:** `https://dashboard.iplanbymsl.in`
- **IP Address:** `195.35.45.17`
- **SSH User:** `root`
- **Password:** `Bazeer@12345`
- **Database Password:** `Tiger@123`
- **Server OS:** Ubuntu 22.04 LTS
- **Frontend Location:** `/var/www/dashboard/`
- **Backend Location:** `/root/dashboard/server/`

---

## 🚀 CRITICAL: Nginx Configuration (MUST DO)

### The Main Issue
The production server needs Nginx to proxy `/api` requests to the Node.js backend running on port 3005.

### Step 1: SSH into Production Server
```bash
ssh root@195.35.45.17
# Password: Bazeer@12345
```

### Step 2: Create/Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/dashboard
```

### Replace with this configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dashboard.iplanbymsl.in;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dashboard.iplanbymsl.in;

    # SSL certificates (adjust paths if different)
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    # Frontend static files
    root /var/www/dashboard;
    index index.html index.htm;

    # Main frontend location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy - CRITICAL for data fetching
    location /api {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        
        # Headers to pass through
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache control
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Step 3: Enable Nginx Configuration
```bash
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/dashboard
sudo rm /etc/nginx/sites-enabled/default  # Remove default if exists
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## 🔧 Backend Setup

### Step 1: Install Dependencies
```bash
cd /root/dashboard/server
npm install
```

### Step 2: Verify Environment Variables
Check `/root/dashboard/server/.env`:
```
DATABASE=kivi
HOST=localhost
DB_USER=root
PASSWORD=Tiger@123
JWT_SECRET=kivi_secret_key_2024
NODE_ENV=production
PORT=3005

# Email
EMAIL_USER=adityasharma10102000@gmail.com
EMAIL_PASS=ntorfozwazlaronr

# Cloudinary
CLOUDINARY_CLOUD_NAME=wpcsars
CLOUDINARY_API_KEY=747261452285263
CLOUDINARY_API_SECRET=NpDuGV0bVVOtTKI89MDDMzgbJ2w

# Razorpay
RAZORPAY_KEY_ID=rzp_test_RSRL6CiapHiTg7
RAZORPAY_SECRET=byhGWz4BRJb6PIyka1zaJjXT
```

### Step 3: Start Backend with PM2
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the backend server
cd /root/dashboard/server
pm2 start npm --name kivi --interpreter bash -- run dev

# Save PM2 configuration to restart on reboot
pm2 save
pm2 startup
```

### Step 4: Check Backend Status
```bash
pm2 logs kivi  # View real-time logs
pm2 status     # Check if running
curl http://localhost:3005/api/test  # Test backend
```

---

## 🎨 Frontend Build & Deployment

### Step 1: Build Frontend Locally
```bash
cd client
npm run build
```

### Step 2: Deploy Built Files to Server
```bash
# From your local machine
sshpass -p Bazeer@12345 scp -r client/dist/* root@195.35.45.17:/var/www/dashboard/
```

### Step 3: Set Proper Permissions
```bash
# On production server
sudo chown -R www-data:www-data /var/www/dashboard
sudo chmod -R 755 /var/www/dashboard
```

---

## ✅ Testing the Setup

### Test 1: Check Backend Connectivity
```bash
curl -X GET https://dashboard.iplanbymsl.in/api/test
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-20T..."
}
```

### Test 2: Check Database Connection
```bash
curl -X GET https://dashboard.iplanbymsl.in/api/test/db
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection working",
  "result": {"test": 1}
}
```

### Test 3: Test Login Endpoint
```bash
curl -X POST https://dashboard.iplanbymsl.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test 4: Open Browser
Visit `https://dashboard.iplanbymsl.in` and check browser console for:
- Should see API calls like: `🌐 API Request: {method, url, ...}`
- URL should be: `https://dashboard.iplanbymsl.in/api/...`
- No 404 or CORS errors

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or 404 errors
**Cause:** API requests are not reaching the backend
**Solution:** 
1. Verify Nginx is configured correctly (check `/etc/nginx/sites-available/dashboard`)
2. Verify backend is running: `pm2 status`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Issue: CORS errors
**Cause:** Frontend origin not in CORS whitelist
**Solution:** Check `server/index.js` CORS configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://dashboard.iplanbymsl.in'  // ← Must be here
  ],
  credentials: true
}));
```

### Issue: Database connection errors
**Cause:** Database credentials wrong or database not running
**Solution:**
```bash
# Check MySQL is running
sudo service mysql status

# Test connection
mysql -u root -pTiger@123 -e "SELECT 1;"

# Check if kivi database exists
mysql -u root -pTiger@123 -e "SHOW DATABASES;"
```

### Issue: Backend crashes frequently
**Cause:** Check PM2 logs
**Solution:**
```bash
pm2 logs kivi --err  # View error logs
pm2 restart kivi     # Restart the service
pm2 save             # Save new configuration
```

---

## 📊 Environment Verification

### Frontend Environment (.env)
```
VITE_API_URL=https://dashboard.iplanbymsl.in/api
```

### Backend Environment (.env)
```
PORT=3005
NODE_ENV=production
DATABASE=kivi
HOST=localhost
DB_USER=root
PASSWORD=Tiger@123
```

---

## 🔄 Deployment Checklist

- [ ] Nginx configured with API proxy to port 3005
- [ ] Nginx restarted and configuration tested
- [ ] Backend dependencies installed
- [ ] Backend started with PM2
- [ ] `pm2 save` and `pm2 startup` configured
- [ ] Frontend built locally
- [ ] Built files deployed to `/var/www/dashboard/`
- [ ] Permissions set correctly on frontend directory
- [ ] Test endpoints return success responses
- [ ] Browser can access `https://dashboard.iplanbymsl.in`
- [ ] Browser API calls show in console logs
- [ ] Data is loading from API endpoints

---

## 📞 Quick Commands Reference

```bash
# Verify backend is running
pm2 status

# View backend logs
pm2 logs kivi

# Restart backend
pm2 restart kivi

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if port 3005 is listening
netstat -tulpn | grep 3005

# Test database connection
mysql -u root -pTiger@123 -e "SELECT 1;"
```

---

## ✨ Common Setup Issues

### Not in ROOT directory when pulling code
**Problem:** Code changes not deployed
**Always remember:** SSH into server, cd to project directory, then git pull

### Old frontend files still being served
**Solution:** Clear browser cache and rebuild
```bash
# On local machine
rm -rf client/dist
npm run build
sshpass -p Bazeer@12345 scp -r client/dist/* root@195.35.45.17:/var/www/dashboard/
```

### Backend not starting on reboot
**Solution:** Configure PM2 startup
```bash
pm2 save
pm2 startup
# Follow on-screen instructions
```

---

## 📝 Notes
- All API calls now go through the centralized `api` service in `client/src/services/api.js`
- The `VITE_API_URL` environment variable controls the API base URL
- In production, it's set to `https://dashboard.iplanbymsl.in/api`
- Nginx proxies `/api` requests to localhost:3005 where the backend listens
- All components use `api.method()` instead of direct `fetch()` calls
