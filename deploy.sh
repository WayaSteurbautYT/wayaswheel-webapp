#!/bin/bash

# Waya's Wheel of Regret - Deployment Script
# This script handles deployment to various platforms

echo "ð Waya's Wheel of Regret - Deployment Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "â Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "â Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "ð Installing dependencies..."
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Build the application
echo "ð Building application..."
npm run build

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "â Build failed. client/build directory not found."
    exit 1
fi

echo "â Build completed successfully!"

# Deployment options
echo ""
echo "Choose deployment option:"
echo "1) Local development server"
echo "2) Production server (local)"
echo "3) Docker deployment"
echo "4) Netlify deployment"
echo "5) Vercel deployment"
echo "6) GitHub Pages deployment"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "ð Starting local development servers..."
        npm run dev
        ;;
    2)
        echo "ð Starting production server..."
        export NODE_ENV=production
        npm start
        ;;
    3)
        echo "ð Preparing Docker deployment..."
        
        # Create Dockerfile if it doesn't exist
        if [ ! -f "Dockerfile" ]; then
            cat > Dockerfile << EOF
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production
WORKDIR /app/client
RUN npm ci --only=production
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
EOF
        fi
        
        echo "â Dockerfile created. Run 'docker build -t waya-wheel .' to build the image."
        echo "â Then run 'docker run -p 5000:5000 waya-wheel' to start the container."
        ;;
    4)
        echo "ð Preparing for Netlify deployment..."
        
        # Create netlify.toml if it doesn't exist
        if [ ! -f "netlify.toml" ]; then
            cat > netlify.toml << EOF
[build]
  publish = "client/build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/api/*"
  to = "https://your-server-url.com/api/:splat"
  status = 200

[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"
EOF
        fi
        
        echo "â netlify.toml created. Deploy with Netlify CLI or drag-and-drop the client/build folder."
        ;;
    5)
        echo "ð Preparing for Vercel deployment..."
        
        # Create vercel.json if it doesn't exist
        if [ ! -f "vercel.json" ]; then
            cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/build/$1"
    }
  ]
}
EOF
        fi
        
        echo "â vercel.json created. Deploy with 'vercel' command."
        ;;
    6)
        echo "â GitHub Pages deployment not recommended for this full-stack application."
        echo "â Consider using Netlify or Vercel instead for better Node.js support."
        ;;
    *)
        echo "â Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "â Deployment preparation complete!"
echo "ð Check the deployment documentation for more details."
