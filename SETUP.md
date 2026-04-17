# Waya's Wheel of Regret - Setup & Fix Guide

## ð Quick Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Git installed
- Command prompt/terminal access

### Step 1: Clean Installation
```bash
# Navigate to project directory
cd C:\Users\steur\Desktop\WayaWheelWebApp

# Clean existing node_modules (if any)
rmdir /s /q node_modules
cd client
rmdir /s /q node_modules
cd ..
cd server
rmdir /s /q node_modules
cd ..

# Install all dependencies
npm install
```

### Step 2: Start Development Servers
```bash
# Option 1: Use the batch file (Windows)
start-dev.bat

# Option 2: Start manually in separate terminals
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

### Step 3: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## ð Troubleshooting Common Issues

### Issue: "Invalid options object" in React Scripts
**Solution**: The .env files should fix this. If it persists:
```bash
cd client
echo "PORT=3000" > .env
echo "BROWSER=default" >> .env
```

### Issue: Port already in use
**Solution**: Kill processes using the ports:
```bash
# Kill processes on port 3000
npx kill-port 3000

# Kill processes on port 5000  
npx kill-port 5000
```

### Issue: React version conflicts
**Solution**: The package.json has been updated to use compatible versions. If issues persist:
```bash
cd client
npm install --force
```

### Issue: CORS errors
**Solution**: Ensure both servers are running and .env files are properly configured.

### Issue: Module not found errors
**Solution**: Clean install:
```bash
# Remove all node_modules folders
rmdir /s /q node_modules
rmdir /s /q client\node_modules
rmdir /s /q server\node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## ð Development Workflow

### 1. Start Servers
Run `start-dev.bat` or start both servers manually

### 2. Development
- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000
- Hot reload enabled for both

### 3. Testing
- Open browser to http://localhost:3000
- Test all game features
- Check browser console for errors

### 4. API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test game session creation
curl -X POST http://localhost:5000/api/game/session \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser","gameMode":"Classic"}'
```

## ð Production Deployment with Vercel

### Deploy Frontend to Vercel

1. Push code to GitHub (already done at https://github.com/WayaSteurbautYT/wayaswheel-webapp.git)

2. Go to [Vercel](https://vercel.com) and sign in with GitHub

3. Click "Add New Project"

4. Import the `wayaswheel-webapp` repository

5. Configure build settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

6. Add environment variables in Vercel:
   - `REACT_APP_API_URL` = your backend API URL (e.g., https://your-server-domain.com)
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key

7. Click "Deploy"

### Deploy Backend (Optional)

For the Node.js backend, you can use:
- **Render** (free tier)
- **Railway** ($5/month)
- **Heroku** ($5/month)

Or deploy to Vercel as a serverless function (requires code restructuring).

### Add Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your domain (e.g., wayaswheelofffate.eu)
3. Vercel will show DNS records to add to your domain registrar
4. Add the records and wait for DNS propagation (5-30 minutes)
5. Enable HTTPS (automatic on Vercel)

### Environment Variables
Copy `.env.example` to `.env` and configure:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://wayaswheelofffate.eu
```

## ð File Structure After Setup
```
WayaWheelWebApp/
âââ client/                 # React frontend
â   âââ node_modules/       # Dependencies
â   âââ src/               # Source code
â   âââ public/            # Static files
â   âââ .env               # Environment variables
âââ server/                 # Node.js backend
â   âââ node_modules/       # Dependencies
â   âââ routes/            # API routes
â   âââ .env               # Environment variables
âââ shared/                 # Shared game data
âââ start-dev.bat          # Windows startup script
âââ package.json           # Root configuration
âââ README.md             # Documentation
âââ SETUP.md              # This guide
```

## ð Browser Compatibility

### Recommended Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 15+

## ð Performance Tips

### Development
- Use Chrome DevTools for debugging
- Monitor Network tab for API calls
- Check Console for JavaScript errors

### Production
- Enable Gzip compression
- Use CDN for static assets
- Implement proper caching headers

## ð Common Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev
# or
start-dev.bat

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## ð Getting Help

### Check Logs
- Frontend: Browser console (F12)
- Backend: Terminal window showing server logs

### Common Solutions
1. **Clear cache**: `npm cache clean --force`
2. **Reinstall**: Delete node_modules and reinstall
3. **Check ports**: Ensure 3000 and 5000 are free
4. **Update Node**: Ensure Node.js 16+ is installed

### Still Having Issues?
1. Check Node.js version: `node --version` (should be 16+)
2. Check npm version: `npm --version` (should be 8+)
3. Try different browser
4. Restart computer (clears port locks)

---

**Need more help?** Check the main README.md or open an issue in the repository.
