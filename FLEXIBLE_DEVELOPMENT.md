# 🔄 Flexible Development Setup - Localhost & Production

You can now seamlessly switch between **localhost development** and **production development** without rebuilding!

---

## 🎯 Quick Switch Methods

### Method 1: Using the Switch Script (EASIEST) ⭐

```bash
# Switch to localhost development
./switch-env.sh local

# Switch to production development
./switch-env.sh production

# Check current mode
./switch-env.sh
```

### Method 2: Manual .env Edit

Edit `.env` file:

```bash
# For LOCALHOST development
VITE_API_URL=http://localhost:3005/api

# For PRODUCTION development
VITE_API_URL=https://dashboard.iplanbymsl.in/api
```

Save and restart `npm run dev`

---

## 🚀 Using Localhost Development

### Prerequisites:
1. **Backend running** on localhost:3005
2. **MySQL database** on localhost
3. **Vite proxy** will auto-enable

### Step-by-Step:

```bash
# 1. Switch to localhost
./switch-env.sh local

# Output:
# ✅ Switched to localhost
# Make sure backend is running: cd server && npm run dev

# 2. Start backend (Terminal 1)
cd server
npm run dev
# Wait for: "🚀 Server running on port 3005"

# 3. Start frontend (Terminal 2)
cd client
npm run dev
# Browser: http://localhost:5173

# 4. Data flows:
# Browser → localhost:5173
#   ↓ (proxy: /api → localhost:3005)
# Node.js Backend
#   ↓
# MySQL Database
```

---

## 🌐 Using Production Development

### Prerequisites:
1. **No local backend needed**
2. **Production server running** (already is)
3. **Proxy auto-disabled**

### Step-by-Step:

```bash
# 1. Switch to production
./switch-env.sh production

# Output:
# ✅ Switched to production
# Start frontend with: npm run dev

# 2. Start frontend (only one terminal)
cd client
npm run dev
# Browser: http://localhost:5173

# 3. Data flows:
# Browser → localhost:5173
#   ↓ (direct request, no proxy)
# https://dashboard.iplanbymsl.in/api
#   ↓ (Nginx routes to localhost:3005)
# Production Backend
#   ↓
# Production MySQL
```

---

## 📊 How It Works

### Vite Config Auto-Detection

The `vite.config.js` now automatically:

✅ **Detects VITE_API_URL** from `.env`
✅ **Enables proxy** if `http://localhost` detected
✅ **Disables proxy** if `https://` (production)
✅ **Uses correct API URL** for data fetching

```javascript
// Pseudo-logic:
if (VITE_API_URL.includes('localhost')) {
  enableProxy() // Proxy /api to localhost:3005
} else {
  disableProxy() // Direct requests to production
}
```

---

## 🔄 Environment Files

| File | Purpose | When Used |
|------|---------|-----------|
| `.env` | **Default** - Production API | `npm run dev` (default) |
| `.env.local` | **Alternative** - Localhost API | Copy to `.env` or use `.env.local` |
| `.env.production` | **Build target** - For `npm run build` | `npm run build` |

---

## 📝 Complete Workflows

### Development with Localhost

```bash
# 1. Switch to localhost
./switch-env.sh local

# 2. Terminal A: Backend
cd kivi/server && npm run dev

# 3. Terminal B: Frontend
cd kivi/client && npm run dev

# 4. Browser
http://localhost:5173
```

### Development with Production

```bash
# 1. Switch to production
./switch-env.sh production

# 2. Terminal: Frontend only
cd kivi/client && npm run dev

# 3. Browser
http://localhost:5173
# Data comes from https://dashboard.iplanbymsl.in
```

### Deploy to Production

```bash
# Frontend always builds with .env.production
cd client
npm run build

# Deploy built files
sshpass -p Bazeer@12345 scp -r dist/* root@195.35.45.17:/var/www/dashboard/
```

---

## 🛠️ Current Status

✅ Vite config auto-detects localhost vs production
✅ Proxy enabled/disabled automatically  
✅ Switch script for easy mode switching
✅ Works with BOTH localhost and production
✅ No need to constantly rebuild

---

## 💡 Pro Tips

### Always Check Current Mode
```bash
cd client && grep VITE_API_URL .env
```

### Kill Port if Stuck
```bash
# Stop process using port 5173
lsof -ti:5173 | xargs kill -9

# Stop process using port 3005
lsof -ti:3005 | xargs kill -9
```

### Restart Dev Server
```bash
# If you change .env, you MUST restart:
# Press Ctrl+C on npm run dev
# Then run again: npm run dev
```

---

## ✨ Key Features

1. **One Script** - Switch between localhost and production
2. **Smart Config** - Vite auto-detects and configures proxy
3. **No Rebuild** - Just restart `npm run dev` when switching
4. **Flexible** - Works with either setup
5. **Production Ready** - Build process uses correct URL

---

## 🐛 Troubleshooting

### Data not loading
1. Check current mode: `grep VITE_API_URL client/.env`
2. Verify browser shows correct API URL in Network tab
3. If localhost: ensure backend is running on port 3005
4. If production: ensure https://dashboard.iplanbymsl.in is accessible

### "ERR_CONNECTION_REFUSED"
- Localhost mode but backend not running
- Solution: `cd server && npm run dev`

### "CORS error" or "Cannot reach production"
- Production mode but Nginx proxy misconfigured
- Solution: Check on server: `sudo nginx -t`

---

**You now have a fully flexible development setup!** 🚀
