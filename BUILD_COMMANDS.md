# 🛠️ WayaWheel Build & Deployment Guide

This document provides the exact commands required to build and deploy the WayaWheel AI Roulette application from scratch.

## 📋 Prerequisites
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- **Git**
- **Supabase Account** (for the Global Doom Leaderboard)
- **AI API Keys** (Grok/Gemini)

---

## 🚀 Full Build Sequence

### 1. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example to .env and fill in your Supabase and AI keys
cp .env.example .env
```

### 2. Frontend Build
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Build the production bundle
npm run build
```

### 3. Desktop Application Build (Electron)
```bash
# Navigate to desktop directory
cd ../desktop

# Install dependencies
npm install

# Package the app for Windows
npm run build
```

### 4. Deployment to Production
If you have the `deploy.sh` script configured:
```bash
# Return to root
cd ..

# Execute deployment script
chmod +x deploy.sh
./deploy.sh
```

---

## 🛠️ Development Mode (Local Run)
To run the entire stack for testing:

1. **Start Backend:**
   ```bash
   cd server && npm start
   ```
2. **Start Frontend:**
   ```bash
   cd client && npm start
   ```
3. **Start Desktop App:**
   ```bash
   cd desktop && npm start
   ```

## 📦 Build Artifacts
- **Frontend:** `client/build/`
- **Backend:** `server/`
- **Desktop:** `desktop/dist/` (contains .exe installers)