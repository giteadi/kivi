# 🔐 Project Credentials & Server Access Information

> **Confidential** — Master reference for server access, database credentials, third-party API keys, and test accounts for the Kivi Platform.

---

## 🖥️ Production Server Access

| Item | Value | Notes |
|------|-------|-------|
| **Production Domain** | `https://dashboard.iplanbymsl.in` | SSL managed via Let's Encrypt / Certbot |
| **Server Public IP** | `195.35.45.17` | Ubuntu 24.04 LTS VPS |
| **SSH User (Upload/Dev)** | `aditya` | Primary user for uploads and development |
| **SSH Key Path** | `~/.ssh/id_ed25519` | Local key on Mac |
| **SSH Key Passphrase** | `1234` | Required when loading key / connecting |
| **Sudo / Root Password** | `RuhiRiya@12345` | Root & sudo password for server administration |
| **Direct Root SSH** | Key only / Disabled password | Use `aditya` and `sudo` |

### Quick SSH Commands:
```bash
# Connect with aditya using key and passphrase:
sshpass -P passphrase -p 1234 ssh -i ~/.ssh/id_ed25519 aditya@195.35.45.17

# Run sudo commands non-interactively:
echo 'RuhiRiya@12345' | sudo -S <command>
```

---

## 🗄️ Database Credentials (MySQL)

| Parameter | Value |
|-----------|-------|
| **DB Host** | `localhost` / `127.0.0.1` |
| **DB Port** | `3306` |
| **DB Name** | `kivi` |
| **DB User** | `root` |
| **DB Password** | `Tiger@123` |

### Database CLI Commands:
```bash
# Connect to MySQL on server:
mysql -u root -pTiger@123 kivi

# Backup database:
mysqldump -u root -pTiger@123 kivi > /root/dashboard/backup_$(date +%F).sql

# Restore database:
mysql -u root -pTiger@123 kivi < /path/to/dump.sql
```

---

## 💳 Payment Gateway (Razorpay)

| Parameter | Value |
|-----------|-------|
| **Key ID** | Configured in server `.env` (`RAZORPAY_KEY_ID`) |
| **Key Secret** | Configured in server `.env` (`RAZORPAY_KEY_SECRET`) |
| **Webhook Secret** | Configured in server `.env` (`RAZORPAY_WEBHOOK_SECRET`) |
| **Currency** | `INR` |

---

## 👥 Default / Test User Credentials

| Role | Email | Password | Phone |
|------|-------|----------|-------|
| **Super Admin** | `superadmin@mindsaidlearning.com` | `super123` | `+91-9876543212` |
| **Admin** | `admin@mindsaidlearning.com` | `admin123` | `+91-9876543210` |
| **Admin 2** | `admin2@mindsaidlearning.com` | `admin123` | `+91-9876543211` |
| **Therapist** | `dr.sarah.johnson@mindsaidlearning.com` | `therapist123` | `+91-9876543211` |
| **Therapist** | `katre@gmail.com` | `Tiger@123` | `9516696009` |
| **Parent** | `parent.john.smith@gmail.com` | `parent123` | `+91-9876543213` |
| **Student/Examinee** | `student@example.com` | `student123` | `+91-9876543214` |

---

## 🌐 Server File Paths & Ports

| Component | Path / Port |
|-----------|-------------|
| **Frontend Root** | `/var/www/dashboard/` |
| **Backend Root** | `/root/dashboard/server/` |
| **Backend Port** | `3005` (proxied by Nginx to `/api/`) |
| **PM2 Process Name** | `dashboard` (ID: 4) |
| **Nginx Config** | `/etc/nginx/sites-available/` & `/etc/nginx/sites-enabled/` |
| **Uploaded Forms** | `/root/dashboard/server/uploads/forms/` |
| **Uploaded Templates** | `/root/dashboard/server/uploads/templates/` |
| **Uploaded Conners** | `/root/dashboard/server/uploads/coners/` |

