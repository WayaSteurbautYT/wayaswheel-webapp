# Deployment Checklist - Waya's Wheel of Regret

This checklist covers all steps needed to deploy the application to production.

## Prerequisites

- ✅ GitHub repository created and pushed
- ✅ Domain purchased: wayaswheelofffate.eu
- ✅ DNS records configured
- ✅ Resend domain verified
- ✅ Email sender updated to noreply@wayaswheelofffate.eu

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
- [ ] Go to [Vercel](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Click "Add New Project"
- [ ] Import `wayaswheel-webapp` repository
- [ ] Configure build settings:
  - Framework Preset: Create React App
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `build`
- [ ] Click "Deploy"

### Step 2: Add Environment Variables
- [ ] Go to project settings → Environment Variables
- [ ] Add these variables:
  - `REACT_APP_API_URL` = [Backend API URL after deployment]
  - `SUPABASE_URL` = your Supabase URL
  - `SUPABASE_ANON_KEY` = your Supabase anon key

### Step 3: Add Custom Domain
- [ ] Go to project settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter: `wayaswheelofffate.eu`
- [ ] Add DNS records to your domain registrar:
  - A Record: `@` → `76.76.21.21`
  - CNAME Record: `www` → `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify HTTPS is enabled (automatic)

## Backend Deployment

### Option A: Render (Free Tier Available)
- [ ] Go to [Render](https://render.com)
- [ ] Sign in with GitHub
- [ ] Click "New" → "Web Service"
- [ ] Connect to GitHub
- [ ] Select `wayaswheel-webapp` repository
- [ ] Configure:
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `node index.js`
- [ ] Add environment variables:
  - `PORT` = 5000
  - `NODE_ENV` = production
  - `CLIENT_URL` = https://wayaswheelofffate.eu
  - `SUPABASE_URL` = your Supabase URL
  - `SUPABASE_ANON_KEY` = your Supabase anon key
  - `SUPABASE_SERVICE_KEY` = your Supabase service key
  - `RESEND_API_KEY` = your Resend API key
- [ ] Click "Deploy Web Service"
- [ ] Copy the deployed URL (e.g., https://your-app.onrender.com)

### Option B: Railway ($5/month)
- [ ] Go to [Railway](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select `wayaswheel-webapp` repository
- [ ] Configure:
  - Root Directory: `server`
  - Start Command: `node index.js`
- [ ] Add environment variables (same as Render)
- [ ] Click "Deploy"
- [ ] Copy the deployed URL

### Option C: Heroku ($5/month)
- [ ] Go to [Heroku](https://heroku.com)
- [ ] Sign in with GitHub
- [ ] Click "Create new app"
- [ ] Connect to GitHub
- [ ] Select `wayaswheel-webapp` repository
- [ ] Configure:
  - Buildpacks: Node.js
  - Root Directory: `server`
- [ ] Add environment variables (same as Render)
- [ ] Click "Deploy"
- [ ] Copy the deployed URL

## Post-Deployment Configuration

### Update Client Config
- [ ] Open `client/src/config.js`
- [ ] Update API_BASE_URL to your deployed backend URL
- [ ] Commit and push changes to GitHub
- [ ] Vercel will automatically redeploy

### Test Email Sending
- [ ] Sign up with a test email
- [ ] Check if verification email arrives
- [ ] Verify the code works
- [ ] Check server logs for any errors

## Testing Checklist

### Authentication Flow
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Enter verification code
- [ ] Successfully verify account
- [ ] Log in with verified credentials
- [ ] Attempt login with unverified account (should fail)
- [ ] Test forgot password flow (if implemented)

### Game Functionality
- [ ] Start a new game
- [ ] Spin the wheel
- [ ] View results
- [ ] Save regrets
- [ ] View regrets list
- [ ] Test all game modes
- [ ] Test multiplayer (if implemented)

### Email Verification
- [ ] Test with wayaswheelofffate.eu domain
- [ ] Verify sender is noreply@wayaswheelofffate.eu
- [ ] Check email template displays correctly
- [ ] Verify code is 6 digits
- [ ] Test code expiration (15 minutes)

### Performance
- [ ] Test page load speed
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Check console for errors
- [ ] Test with slow internet connection

### Security
- [ ] Test SQL injection protection
- [ ] Test XSS protection
- [ ] Test CSRF protection
- [ ] Verify HTTPS is enforced
- [ ] Check security headers

## Optional Enhancements (Medium Priority)

### Error Tracking
- [ ] Sign up for [Sentry](https://sentry.io)
- [ ] Install Sentry SDK in frontend
- [ ] Install Sentry SDK in backend
- [ ] Configure error reporting
- [ ] Test error tracking

### Analytics
- [ ] Set up Google Analytics
- [ ] Add tracking code to frontend
- [ ] Configure event tracking
- [ ] Test analytics data collection

### Performance Monitoring
- [ ] Set up Lighthouse CI
- [ ] Configure performance budgets
- [ ] Monitor Core Web Vitals
- [ ] Optimize images and assets

### Rate Limiting
- [ ] Install express-rate-limit
- [ ] Configure rate limits for API
- [ ] Add rate limit headers
- [ ] Test rate limiting

### Security Headers
- [ ] Install helmet
- [ ] Configure security headers
- [ ] Add CSP headers
- [ ] Test security configuration

## Maintenance

### Regular Tasks
- [ ] Monitor server logs
- [ ] Check error tracking dashboard
- [ ] Review analytics data
- [ ] Update dependencies
- [ ] Backup database (when users exist)
- [ ] Review security advisories
- [ ] Test critical user flows

### Scaling
- [ ] Monitor server resources
- [ ] Add caching if needed
- [ ] Optimize database queries
- [ ] Consider CDN for static assets
- [ ] Scale horizontally if needed

## Troubleshooting

### Common Issues

**Build fails on Vercel:**
- Check build logs for errors
- Verify environment variables are set
- Check for missing dependencies
- Verify build command is correct

**Email not sending:**
- Check Resend API key
- Verify domain is verified in Resend
- Check server logs for errors
- Verify email address is correct

**Authentication failing:**
- Check backend is running
- Verify API URL is correct
- Check CORS configuration
- Verify Supabase credentials

**Database connection issues:**
- Check Supabase URL and keys
- Verify Supabase project is active
- Check network connectivity
- Review Supabase logs

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [GitHub Repository](https://github.com/WayaSteurbautYT/wayaswheel-webapp)

## Contact

For issues or questions:
- GitHub Issues: https://github.com/WayaSteurbautYT/wayaswheel-webapp/issues
- Email: support@wayaswheelofffate.eu (once configured)
