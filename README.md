# 🏥 Kivi — Clinic & Assessment Dashboard Platform

> Production clinic administration, mental health assessment management, scheduling, spreadsheet reporting, and invoicing platform.

---

## 📌 Project Overview
- **Production URL:** [https://dashboard.iplanbymsl.in](https://dashboard.iplanbymsl.in)
- **Frontend Stack:** React 19, Vite, Tailwind CSS, Univer Sheets Core Preset, Redux Toolkit
- **Backend Stack:** Node.js, Express, PM2, Python 3 OpenXML Parser, MySQL 8.0, Nginx

---

## 📚 Documentation & Project Memory (`memory/`)

All architecture, credentials, database, and deployment specifications are organized in the [`memory/`](./memory/) directory:

- [🔐 **Server & Project Credentials** (`memory/CREDENTIALS.md`)](./memory/CREDENTIALS.md) — Server IP, SSH keys, passwords, MySQL credentials, test users, and API keys.
- [🏗️ **System Architecture** (`memory/ARCHITECTURE.md`)](./memory/ARCHITECTURE.md) — System components, Excel processing pipeline, Univer/Classic spreadsheet architecture, and module breakdown.
- [🚀 **Deployment Guide** (`memory/DEPLOYMENT.md`)](./memory/DEPLOYMENT.md) — One-click commands for deploying frontend (`dist`) and backend updates to production.
- [🗄️ **Database Schema** (`memory/DATABASE.md`)](./memory/DATABASE.md) — Core MySQL tables, models, relationships, and queries.

---

## 💻 Local Development

### 1. Start Both Backend & Frontend
```bash
./start-dev.sh
```
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3005/api
