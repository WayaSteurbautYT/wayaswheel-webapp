# Domain Setup Guide for Waya's Wheel

This guide explains how to set up a custom domain for email sending (Supabase + Resend) and website deployment (Netlify).

## Overview

To send emails to all users (not just your own email), you need to:
1. Purchase a custom domain
2. Configure DNS records for email (MX, SPF, DKIM)
3. Add the domain to Supabase
4. Verify the domain in Resend
5. Deploy your app to Netlify with the domain

## Step 1: Purchase a Domain

Recommended domain registrars:
- Namecheap (cheap, easy to use)
- GoDaddy
- Cloudflare Registrar
- Google Domains

Choose a domain name like: `wayaswheel.com` or `wayaswheel.net`

## Step 2: Configure DNS Records

After purchasing, go to your domain registrar's DNS settings and add these records:

### For Email (Resend)
```
TXT Record:
Name: @
Value: v=spf1 include:resend.com -all

TXT Record (DKIM):
Name: resend._domainkey
Value: (Get this from Resend dashboard after adding domain)

MX Records:
Name: @
Priority: 10
Value: smtp.resend.com
```

### For Website (Netlify)
```
A Record:
Name: @
Value: 75.2.70.75 (Netlify's IP)

CNAME Record:
Name: www
Value: your-site-name.netlify.app
```

## Step 3: Configure Supabase Domain

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → Authentication → Site URL
4. Add your domain: `https://wayaswheel.com` (or your chosen domain)
5. Add redirect URLs for development:
   - `http://localhost:3000`
   - `https://wayaswheel.com`

## Step 4: Configure Resend Domain

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain: `wayaswheel.com`
4. Resend will show you DNS records to add (TXT, MX, CNAME)
5. Add these records to your domain registrar
6. Wait for DNS to propagate (usually 5-30 minutes)
7. Click "Verify" in Resend dashboard
8. Once verified, you can send emails from any address @yourdomain.com

## Step 5: Update Email Sender

After verifying your domain in Resend, update the email sender:

### File: `server/utils/email.js`

Change this line:
```javascript
from: 'onboarding@resend.dev',
```

To:
```javascript
from: 'noreply@wayaswheel.com', // Your custom domain
```

## Step 6: Deploy to Netlify

### Option A: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Build the client:
```bash
cd client
npm run build
cd ..
```

4. Deploy:
```bash
netlify deploy --prod
```

### Option B: Deploy via Netlify Dashboard

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`
6. Click "Deploy site"

### Add Custom Domain to Netlify

1. Go to Site Settings → Domain management
2. Click "Add custom domain"
3. Enter your domain: `wayaswheel.com`
4. Netlify will show you DNS records to add
5. Add the records to your domain registrar
6. Wait for DNS to propagate
7. Enable HTTPS (Netlify will provision SSL certificate automatically)

## Step 7: Update Environment Variables

In Netlify dashboard, add these environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
RESEND_API_KEY=your_resend_api_key
```

## Step 8: Update Client Configuration

### File: `client/src/config.js`

Update the API endpoint to use your production domain:
```javascript
const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: 'https://your-server-domain.com/api/auth/signup',
    LOGIN: 'https://your-server-domain.com/api/auth/login',
    VERIFY: 'https://your-server-domain.com/api/auth/verify',
    GUEST: 'https://your-server-domain.com/api/auth/guest',
  },
  // ... other endpoints
};
```

## Current Status

For now, while you don't have a custom domain:
- Email sending will only work to `steurbautwaya703@gmail.com` (Resend testing mode)
- The verification code is logged to the server console for testing
- You can manually use the code from the console to verify accounts

## Quick Testing (Without Domain)

To test the current setup:
1. Sign up with `steurbautwaya703@gmail.com` (lowercase)
2. Check the server console for the verification code
3. Use that code to verify the account
4. The flow works, just without email delivery

## Next Steps

1. Purchase a domain
2. Configure DNS records
3. Verify domain in Resend
4. Update email sender to use custom domain
5. Deploy to Netlify
6. Test the complete flow with real email delivery
