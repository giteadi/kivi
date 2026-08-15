# Kivi — Frontend & Backend Deployment Guide

> Single source of truth for deploying the Kivi dashboard from the local Mac (`/Users/adityasharma/Desktop/kivi`) to the production Ubuntu server.

---

## 🖥️ Production Server

| Item | Value |
|------|-------|
| Domain | `https://dashboard.iplanbymsl.in` |
| Server IP | `195.35.45.17` |
| SSH user for upload | `aditya` (key: `~/.ssh/id_ed25519`, passphrase: `1234`) |
| Server root user | `root` (used for file permissions / restarts) |
| Frontend path | `/var/www/dashboard/` |
| Backend path | `/root/dashboard/server/` |
| Backend port | `3005` |
| PM2 process name | `kivi` |
| Web server | Nginx |

---

## 📦 Frontend Only (most common)

### 1. Build locally (Mac)

```bash
cd /Users/adityasharma/Desktop/kivi/client
npm run build
```

### 2. Upload to server with `rsync`

```bash
cd /Users/adityasharma/Desktop/kivi/client
rsync -avz dist/ aditya@195.35.45.17:/tmp/kivi-dist/
```

If the key is not auto-loaded:

```bash
rsync -avz -e "ssh -i ~/.ssh/id_ed25519" dist/ aditya@195.35.45.17:/tmp/kivi-dist/
```

Enter the key passphrase when prompted: `1234`

### 3. Move files into place (on the server)

```bash
sudo rm -rf /var/www/dashboard/*
rsync -a /tmp/kivi-dist/ /var/www/dashboard/
sudo chown -R www-data:www-data /var/www/dashboard
sudo chmod -R 755 /var/www/dashboard
find /var/www/dashboard/ -name "._*" -type f -delete
sudo systemctl reload nginx
```

### 4. Verify

```bash
ls -la /var/www/dashboard/
curl -I https://dashboard.iplanbymsl.in
```

---

## ⚙️ Backend Only

### 1. Package and upload (Mac)

```bash
cd /Users/adityasharma/Desktop/kivi
rsync -avz --exclude=node_modules --exclude=.env server/ aditya@195.35.45.17:/tmp/kivi-server/
```

### 2. Replace backend and restart (on the server)

```bash
# Backup current backend first (optional)
cp -r /root/dashboard/server /root/dashboard/server-backup-$(date +%Y%m%d-%H%M%S)

# Copy new files
sudo rm -rf /root/dashboard/server
sudo cp -r /tmp/kivi-server /root/dashboard/server

# Install dependencies and restart
cd /root/dashboard/server
npm install
pm2 restart kivi
pm2 save
```

### 3. Verify

```bash
pm2 status
pm2 logs kivi --lines 20
curl https://dashboard.iplanbymsl.in/api/test
```

---

## 🔄 Frontend + Backend Together

```bash
# --- Local (Mac) ---
cd /Users/adityasharma/Desktop/kivi/client
npm run build
rsync -avz dist/ aditya@195.35.45.17:/tmp/kivi-dist/

cd /Users/adityasharma/Desktop/kivi
rsync -avz --exclude=node_modules --exclude=.env server/ aditya@195.35.45.17:/tmp/kivi-server/

# --- Server (SSH) ---
sudo rm -rf /var/www/dashboard/*
rsync -a /tmp/kivi-dist/ /var/www/dashboard/
sudo chown -R www-data:www-data /var/www/dashboard
sudo chmod -R 755 /var/www/dashboard
find /var/www/dashboard/ -name "._*" -type f -delete

sudo rm -rf /root/dashboard/server
sudo cp -r /tmp/kivi-server /root/dashboard/server
cd /root/dashboard/server && npm install && pm2 restart kivi

sudo systemctl reload nginx
pm2 save
```

---

## 🗄️ Database (optional)

```bash
# Local: dump
mysqldump -u root -p kivi > /tmp/kivi_dump.sql

# Upload
rsync -avz /tmp/kivi_dump.sql aditya@195.35.45.17:/tmp/

# Server: restore
mysql -u root -pTiger@123 kivi < /tmp/kivi_dump.sql
```

---

## 🧰 Common Server Commands

```bash
# Services
pm2 status
pm2 logs kivi --lines 50
pm2 restart kivi
systemctl status nginx
systemctl reload nginx

# Permissions (if frontend 403/404)
sudo chown -R www-data:www-data /var/www/dashboard
sudo chmod -R 755 /var/www/dashboard
```

---

## ❗ Notes

- `root` direct SSH does **not** work for `scp`/`rsync` (publickey only). Always use `aditya` for uploads.
- `dist/` always uploads to `/tmp/kivi-dist/` first, then moves to `/var/www/dashboard/`. Never upload directly to `/var/www/dashboard/` as `aditya`.
- Nginx already proxies `/api/` to `localhost:3005`.
