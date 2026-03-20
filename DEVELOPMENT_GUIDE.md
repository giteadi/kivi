# 🚀 Local Development Setup Guide

## ✅ What's Been Set Up

### Environment Files
- **`.env`** (default) → `http://localhost:3005/api` ← Development
- **`.env.production`** → `https://dashboard.iplanbymsl.in/api` ← Production
- **`.env.development`** → `http://localhost:3005/api` ← Dev override
- **`vite.config.js`** → Proxy enabled for `/api` requests during dev

### How It Works
```
npm run dev (localhost)
    ↓
Browser requests go to http://localhost:5173
    ↓
Vite dev server proxies /api requests to http://localhost:3005
    ↓
Your local Node.js backend
    ↓
Local MySQL database
```

---

## 🎯 Development Workflow

### Step 1: Start Local Backend
```bash
cd /Users/adityasharma/Desktop/kivi/server
npm run dev
# OR
node index.js
```

Expected output:
```
Server is running on port 3005
Database initialized successfully
```

### Step 2: Start Frontend Dev Server
```bash
cd /Users/adityasharma/Desktop/kivi/client
npm run dev
```

Expected output:
```
  VITE v7.3.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

### Step 3: Open Browser
```
http://localhost:5173/
```

### Step 4: Check Console
Open DevTools (F12) and verify:
- ✅ `🌐 API Request:` logs show `http://localhost:3005/api`
- ✅ No 404 errors
- ✅ Data loads on dashboard/pages

---

## 🚀 Building for Production

When you're ready to deploy to production:

```bash
cd client
npm run build
```

This will:
1. Load `.env` + `.env.production`
2. Override `VITE_API_URL` to `https://dashboard.iplanbymsl.in/api`
3. Build minified production files in `dist/`

Then deploy:
```bash
sshpass -p Bazeer@12345 scp -r dist/* root@195.35.45.17:/var/www/dashboard/
```

---

## 🔍 Troubleshooting

### Issue: "Cannot GET /api/sessions"
**Cause:** Backend not running
**Fix:**
```bash
cd server && npm run dev
```

### Issue: Data still not loading
**Cause:** Wrong environment file being used
**Check:**
```bash
cd client
# Look at vite.config logs during dev startup
# Should show proxy config active
```

### Issue: CORS errors in console
**Cause:** Backend CORS not configured
**Fix:** Check `server/index.js` has localhost in CORS origin:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',  // ← This must be here
    'http://localhost:3000',
    'https://dashboard.iplanbymsl.in'
  ]
}));
```

---

## 📊 Environment Variable Rules

### During Development (`npm run dev`)
```
.env → .env.development (overrides)
VITE_API_URL = http://localhost:3005/api
```

### During Build (`npm run build`)
```
.env → .env.production (overrides)
VITE_API_URL = https://dashboard.iplanbymsl.in/api
```

### Never Commit
- `.env.local` (if created - add to .gitignore)
- Sensitive credentials in .env files

---

## 🔃 Quick Commands Cheat Sheet

```bash
# Start backend on localhost:3005
cd server && npm run dev

# Start frontend dev server (localhost:5173)
cd client && npm run dev

# Build for production
cd client && npm run build

# View built files (before deploying)
cd client && ls -la dist/

# Deploy to production
sshpass -p Bazeer@12345 scp -r client/dist/* root@195.35.45.17:/var/www/dashboard/

# Test backend API
curl http://localhost:3005/api/test

# Test production API  
curl https://dashboard.iplanbymsl.in/api/test
```

---

## 📝 Current Setup Summary

| Environment | API URL | Used When | Frontend Port |
|---|---|---|---|
| **Development** | `http://localhost:3005/api` | `npm run dev` | 5173 |
| **Production** | `https://dashboard.iplanbymsl.in/api` | `npm run build` | 443 (Nginx) |

---

## ⚠️ IMPORTANT: Don't Rebuild Constantly!

**OLD WORKFLOW (❌ Bad):**
- Make code change
- `npm run build`
- `scp dist/* to server`
- Refresh browser
- Repeat

**NEW WORKFLOW (✅ Good):**
- Backend running: `npm run dev` (in server folder)
- Frontend running: `npm run dev` (in client folder)
- Make code changes
- Browser hot-reloads automatically
- Only build when ready to deploy!

---

## 🎉 You're Ready!

1. ✅ Terminal 1: `cd server && npm run dev`
2. ✅ Terminal 2: `cd client && npm run dev`
3. ✅ Open: `http://localhost:5173`
4. ✅ Start coding!

No rebuilds needed until you deploy to production! 🚀
