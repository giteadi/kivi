# 🚀 Deployment Guide & Server Management

> Standard Operating Procedure for deploying frontend and backend updates from local Mac to the production Ubuntu server.

---

## 🖥️ Server Summary

| Property | Value |
|----------|-------|
| Domain | `https://dashboard.iplanbymsl.in` |
| IP | `195.35.45.17` |
| SSH User | `aditya` (Key: `~/.ssh/id_ed25519`, Passphrase: `1234`) |
| Sudo Password | `RuhiRiya@12345` |
| Frontend Path | `/var/www/dashboard/` |
| Backend Path | `/root/dashboard/server/` |
| PM2 Process | `dashboard` (Port: `3005`) |

---

## 📦 1. Frontend Deployment

### Step A: Build locally
```bash
cd /Users/adityasharma/Desktop/kivi/client
npm run build
```

### Step B: Archive and upload to server
```bash
tar -czf /tmp/kivi-dist.tar.gz -C /Users/adityasharma/Desktop/kivi/client/dist .
sshpass -P passphrase -p 1234 scp -i ~/.ssh/id_ed25519 /tmp/kivi-dist.tar.gz aditya@195.35.45.17:/tmp/kivi-dist.tar.gz
```

### Step C: Deploy on server
```bash
sshpass -P passphrase -p 1234 ssh -i ~/.ssh/id_ed25519 aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S bash -c 'rm -rf /var/www/dashboard/* && tar -xzf /tmp/kivi-dist.tar.gz -C /var/www/dashboard/ && chown -R www-data:www-data /var/www/dashboard && chmod -R 755 /var/www/dashboard && rm -f /tmp/kivi-dist.tar.gz && systemctl reload nginx && echo DEPLOYMENT_SUCCESS'"
```

---

## ⚙️ 2. Backend Deployment (Changed Files Only)

### Example: Uploading updated `parse_excel.py`
```bash
# Upload changed file to /tmp:
sshpass -P passphrase -p 1234 scp -i ~/.ssh/id_ed25519 server/scripts/parse_excel.py aditya@195.35.45.17:/tmp/parse_excel.py

# Move to server directory, set ownership, and restart PM2:
sshpass -P passphrase -p 1234 ssh -i ~/.ssh/id_ed25519 aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S bash -c 'cp /tmp/parse_excel.py /root/dashboard/server/scripts/parse_excel.py && chown aditya:aditya /root/dashboard/server/scripts/parse_excel.py && rm -f /tmp/parse_excel.py && pm2 restart dashboard && echo BACKEND_RESTART_SUCCESS'"
```

---

## 🔄 3. Full Backend Deployment (Entire Server Directory)

```bash
# From Mac:
cd /Users/adityasharma/Desktop/kivi
rsync -avz --exclude=node_modules --exclude=.env -e "ssh -i ~/.ssh/id_ed25519" server/ aditya@195.35.45.17:/tmp/kivi-server/

# On Server:
echo 'RuhiRiya@12345' | sudo -S bash -c 'rm -rf /root/dashboard/server/* && cp -r /tmp/kivi-server/* /root/dashboard/server/ && cd /root/dashboard/server && npm install && pm2 restart dashboard && pm2 save'
```

---

## 🔍 4. Verification Commands

```bash
# Check Frontend:
curl -sI https://dashboard.iplanbymsl.in | head -n 5

# Check Backend API health:
curl -s https://dashboard.iplanbymsl.in/api/test

# Check PM2 process status:
sshpass -P passphrase -p 1234 ssh -i ~/.ssh/id_ed25519 aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S pm2 status"
```

