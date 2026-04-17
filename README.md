# Waya's Wheel of Regret - Full Web Application

A complete web implementation of Waya's Wheel of Regret Unity game, built with React, Node.js, and modern web technologies.

## ð Features

### Core Game Mechanics
- **12-Segment Wheel**: Red and black segments with varying doom percentages
- **4 Game Modes**: Classic, Chaos Chain, Wheel of Fate, Rapid Fire
- **AI Response System**: Dynamic responses based on doom levels and game mode
- **Realistic Spinning**: Smooth animations with easing and physics
- **Sound Effects**: Synthetic audio using Web Audio API

### User Interface
- **Dark Theme**: Authentic red/black styling matching the Unity game
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Animations**: Framer Motion for smooth transitions
- **Glassmorphism Effects**: Modern UI with backdrop filters

### Backend Features
- **Session Management**: Track game sessions and results
- **Statistics**: Global stats, leaderboards, and personal history
- **API Endpoints**: RESTful API for game data
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Secure cross-origin requests

## ð Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WayaWheelWebApp
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
npm run dev
```

This will start:
- React frontend on http://localhost:3000
- Node.js backend on http://localhost:5000

## ð Architecture

### Frontend (React)
```
client/
âââ src/
â   âââ components/          # React components
â   âââ context/            # Game state management
â   âââ utils/              # Utility functions
â   âââ hooks/              # Custom React hooks
â   âââ App.js              # Main application
â   âââ index.js            # Entry point
âââ public/                 # Static assets
```

### Backend (Node.js)
```
server/
âââ routes/                # API routes
â   âââ game.js             # Game session endpoints
â   âââ stats.js            # Statistics endpoints
âââ index.js                # Main server file
âââ .env.example            # Environment template
```

### Shared
```
shared/
âââ gameData.js             # Game constants and logic
```

## ð API Documentation

### Game Sessions

#### Create Session
```http
POST /api/game/session
Content-Type: application/json

{
  "username": "PlayerName",
  "gameMode": "Classic"
}
```

#### Get Session
```http
GET /api/game/session/:sessionId
```

#### Add Spin
```http
POST /api/game/session/:sessionId/spin
Content-Type: application/json

{
  "question": "Should I quit my job?",
  "result": "DO IT",
  "doom": 85,
  "answer": "The void laughs at your question. NO."
}
```

#### Get Results
```http
GET /api/game/session/:sessionId/result
```

### Statistics

#### Global Stats
```http
GET /api/stats/global
```

#### Leaderboard
```http
GET /api/stats/leaderboard?limit=10&mode=Classic
```

#### Mode Statistics
```http
GET /api/stats/modes
```

## ð Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

## ð Game Modes

### Classic
- **Max Spins**: 1
- **Description**: One question, one fate

### Chaos Chain
- **Max Spins**: 6
- **Description**: 6 spins of escalating doom
- **Multiplier**: 2x points

### Wheel of Fate
- **Max Spins**: 6
- **Description**: The wheel knows who you are
- **Multiplier**: 1.5x points

### Rapid Fire
- **Max Spins**: 6
- **Description**: Auto-spin madness
- **Multiplier**: 1.2x points

## ð Scoring System

### Points Calculation
- **Creativity**: Based on question length
- **Regret Level**: Average doom percentage
- **Stars**: 0-5 based on performance
- **Total Points**: Weighted sum with mode multiplier

### Doom Levels
- **0-30%**: ð Low regret (positive responses)
- **30-60%**: Ð Medium regret (mixed responses)
- **60-80%**: ð° High regret (negative responses)
- **80-100%**: ð Maximum regret (chaotic responses)

## ð Technologies

### Frontend
- **React 18**: UI framework
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Animations
- **Canvas API**: Wheel rendering
- **Web Audio API**: Sound effects

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Helmet**: Security headers
- **CORS**: Cross-origin requests
- **Rate Limiting**: API protection

### Development
- **Concurrently**: Run multiple scripts
- **Nodemon**: Auto-restart server
- **React Scripts**: Build tools

## ð Customization

### Adding New Wheel Segments
Edit `shared/gameData.js`:
```javascript
{ text: "NEW SEGMENT", color: "#HEX", isRed: true/false, doom: 0-100 }
```

### Custom AI Responses
Edit `shared/gameData.js`:
```javascript
positive: ["Custom response 1", "Custom response 2"],
negative: ["Custom negative response"],
chaotic: ["Custom chaotic response"],
cryptic: ["Custom cryptic response"]
```

### Styling
- Edit `client/src/components/` for component styles
- Modify theme in `client/src/App.js`
- Update colors in styled components

## ð Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## ð Performance

### Optimizations
- **Code Splitting**: Lazy loading components
- **Image Optimization**: Compressed assets
- **Caching**: Browser and server caching
- **Compression**: Gzip compression
- **Minification**: Production builds

### Monitoring
- **Health Check**: `/api/health`
- **Error Handling**: Comprehensive error logging
- **Rate Limiting**: API protection
- **Security Headers**: Helmet middleware

## ð Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## ð License

MIT License - feel free to use for personal and commercial projects

## ð Support

- **Issues**: Report bugs via GitHub Issues
- **Features**: Request features via GitHub Discussions
- **Questions**: Contact via project documentation

---

**Created by Waya** | **Version 1.0.0** | **Full Web Implementation**

*Ask your question and let fate decide...* ð
