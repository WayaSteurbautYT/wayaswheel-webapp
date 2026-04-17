# Waya's Wheel of Regret - AI-Powered Multiplayer Edition

A complete AI-powered multiplayer web application with local LLM support, desktop builds, and Steam integration.

## 🚀 New Features

### AI Integration
- **Local LLM Support**: Run Ollama locally for privacy and offline play
- **Device Detection**: Automatically detects hardware capabilities to recommend local vs cloud models
- **AI Tools**: Vision analysis, web search, text generation, code generation
- **Dynamic Content**: AI-generated endings, game modes, visuals, and animations
- **Safe Chat**: Content filtering for multiplayer chat

### Multiplayer
- **Public Rooms**: Join public multiplayer rooms
- **Chat Decides Fate**: Community voting on wheel outcomes
- **Real-time Communication**: Supabase Realtime for instant updates
- **Room System**: Create, join, and manage game rooms

### Desktop Application
- **Electron Wrapper**: Native Windows/Mac desktop application
- **Local AI Integration**: Built-in Ollama server management
- **Offline Mode**: Play without internet connection
- **Auto-updates**: Built-in update system

### Distribution
- **Web Version**: Browser-based instant play
- **Desktop Downloads**: Windows and Mac installers
- **Steam Integration**: Steam Workshop, achievements, cloud saves
- **Download Website**: Styled landing page for all versions

## 📋 Prerequisites

### For Development
- Node.js 16+
- npm or yarn
- Git

### For Local AI (Optional)
- [Ollama](https://ollama.ai) installed
- 8GB RAM minimum (16GB recommended)
- GPU with 4GB VRAM (optional but recommended)

### For Production
- Supabase account (free tier available)
- Domain name (for web deployment)
- Steam Developer account (for Steam release)

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd WayaWheelWebApp
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema in the SQL Editor:
   ```bash
   # Copy contents of server/supabase/schema.sql
   # Paste in Supabase SQL Editor and run
   ```
3. Enable Realtime for these tables in Supabase dashboard:
   - room_messages
   - room_players
   - rooms
   - chat_votes
   - vote_responses
4. Add environment variables to `server/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

### 4. Set Up Ollama (Optional)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model:
   ```bash
   ollama pull llama3.2
   ollama pull llava  # for vision
   ollama pull codellama  # for code generation
   ```
3. Start Ollama server:
   ```bash
   ollama serve
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
This starts:
- React frontend on http://localhost:3000
- Node.js backend on http://localhost:5000

### Desktop Application
```bash
cd desktop
npm install
npm start
```

### Build for Production
```bash
# Web version
npm run build
npm start

# Desktop Windows
cd desktop
npm run build-win

# Desktop Portable
cd desktop
npm run build-portable

# Steam Build
cd desktop
npm run build-steam
```

## 📁 Project Structure

```
WayaWheelWebApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Game state management
│   │   ├── shared/        # Shared game data (moved from root)
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
├── server/                # Node.js backend
│   ├── ai/                # AI integration
│   │   ├── ollamaClient.js    # Ollama client + device detection
│   │   └── aiTools.js         # AI tools (vision, web search, etc.)
│   ├── supabase/          # Supabase integration
│   │   ├── client.js          # Supabase client
│   │   └── schema.sql         # Database schema
│   ├── routes/            # API routes
│   │   ├── game.js            # Game session endpoints
│   │   ├── stats.js           # Statistics endpoints
│   │   ├── ai.js              # AI endpoints
│   │   └── multiplayer.js     # Multiplayer endpoints
│   └── index.js           # Main server file
├── desktop/               # Electron desktop app
│   ├── main.js            # Electron main process
│   ├── preload.js         # Preload script
│   └── package.json       # Electron dependencies
├── download-site/         # Download website
│   └── index.html         # Landing page
├── shared/                # Original shared directory (deprecated)
└── README.md             # This file
```

## 🔌 API Endpoints

### AI Endpoints
- `GET /api/ai/health` - Check AI system health
- `GET /api/ai/device-capabilities` - Get device capabilities
- `POST /api/ai/generate-ending` - Generate new wheel ending
- `POST /api/ai/generate-game-mode` - Generate new game mode
- `POST /api/ai/generate-response` - Generate AI response
- `POST /api/ai/generate-visuals` - Generate visual suggestions
- `POST /api/ai/analyze-image` - Analyze image with vision
- `POST /api/ai/web-search` - Perform web search
- `POST /api/ai/generate-text` - Generate text
- `POST /api/ai/generate-code` - Generate code
- `POST /api/ai/filter-content` - Filter content for safety
- `POST /api/ai/pull-model` - Pull new Ollama model
- `GET /api/ai/models` - Get available models

### Multiplayer Endpoints
- `POST /api/multiplayer/create-room` - Create new room
- `GET /api/multiplayer/rooms/:roomId` - Get room details
- `GET /api/multiplayer/public-rooms` - Get public rooms
- `POST /api/multiplayer/join-room` - Join a room
- `POST /api/multiplayer/leave-room` - Leave a room
- `POST /api/multiplayer/send-message` - Send message to room
- `GET /api/multiplayer/rooms/:roomId/messages` - Get room messages
- `POST /api/multiplayer/start-game` - Start game in room
- `POST /api/multiplayer/submit-spin` - Submit spin result
- `GET /api/multiplayer/rooms/:roomId/spins` - Get room spins
- `POST /api/multiplayer/chat-decides-fate` - Create voting session
- `POST /api/multiplayer/vote` - Submit vote
- `GET /api/multiplayer/votes/:voteId` - Get vote results
- `POST /api/multiplayer/end-vote` - End voting session

### Game Endpoints
- `POST /api/game/session` - Create game session
- `GET /api/game/session/:id` - Get session details
- `POST /api/game/session/:id/spin` - Add spin to session
- `GET /api/game/session/:id/result` - Get final results
- `DELETE /api/game/session/:id` - Delete session

### Stats Endpoints
- `GET /api/stats/global` - Get global statistics
- `POST /api/stats/update` - Update global statistics
- `GET /api/stats/leaderboard` - Get leaderboard
- `GET /api/stats/modes` - Get mode statistics
- `GET /api/stats/recent` - Get recent activity

## 🎮 Game Modes

### Classic
- **Max Spins**: 1
- **Description**: One question, one fate
- **Multiplier**: 1x

### Chaos Chain
- **Max Spins**: 6
- **Description**: 6 spins of escalating doom
- **Multiplier**: 2x

### Wheel of Fate
- **Max Spins**: 6
- **Description**: The wheel knows who you are
- **Multiplier**: 1.5x

### Rapid Fire
- **Max Spins**: 6
- **Description**: Auto-spin madness
- **Multiplier**: 1.2x

### AI-Generated (Custom)
- **Max Spins**: Variable
- **Description**: AI-generated custom modes
- **Multiplier**: Variable

## 🔒 Security

- **Row Level Security**: Supabase RLS policies for data protection
- **Content Filtering**: AI-based safe chat filtering
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers for Express
- **CORS**: Configured cross-origin requests
- **Environment Variables**: Sensitive data in .env files

## 🚀 Deployment

### Web Deployment
```bash
# Build React app
cd client
npm run build

# Deploy to hosting service (Vercel, Netlify, etc.)
# Or serve with Node.js
cd ..
npm start
```

### Desktop Deployment
```bash
cd desktop
npm run build-win  # Windows installer
npm run build-portable  # Portable executable
```

### Steam Deployment
1. Set up Steam App ID in `desktop/package.json`
2. Configure Steam SDK integration
3. Build with Steam configuration:
   ```bash
   npm run build-steam
   ```
4. Upload to Steamworks

## 📊 Database Schema

See `server/supabase/schema.sql` for complete database schema including:
- Profiles
- Game Sessions
- Spins
- Multiplayer Rooms
- Room Players
- Room Messages
- Chat Votes
- Vote Responses
- Generated Content

## 🤖 AI Models

### Recommended Models
- **llama3.2**: General purpose text generation
- **llava**: Vision/image analysis
- **codellama**: Code generation
- **phi3**: Lightweight model for lower-end devices

### Model Selection
The app automatically selects the best model based on:
- Available RAM
- GPU presence
- User device capabilities

## 🎨 Customization

### Adding New AI Tools
Edit `server/ai/aiTools.js`:
```javascript
async yourNewTool(input) {
  const prompt = `Your prompt here: ${input}`;
  const result = await this.ollama.generate('model-name', prompt);
  return result.response;
}
```

### Adding New Multiplayer Features
Edit `server/routes/multiplayer.js` to add new endpoints.

### Customizing Wheel Segments
Edit `client/src/shared/gameData.js`:
```javascript
{ text: "NEW SEGMENT", color: "#HEX", isRed: true/false, doom: 0-100 }
```

## 🐛 Troubleshooting

### Ollama Not Working
- Ensure Ollama is installed and running: `ollama serve`
- Check if model is pulled: `ollama list`
- Verify Ollama is accessible at http://localhost:11434

### Supabase Connection Issues
- Verify environment variables are set
- Check Supabase project is active
- Ensure RLS policies are correct
- Enable Realtime for multiplayer tables

### Desktop Build Issues
- Ensure Electron dependencies are installed
- Check Node.js version (16+)
- Verify build tools are installed for your platform

## 📝 License

MIT License - feel free to use for personal and commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Features**: Request features via GitHub Discussions
- **Questions**: Contact via project documentation

---

**Created by Waya** | **Version 2.0.0** | **AI-Powered Multiplayer Edition**

*Ask your question and let fate decide... with AI! 🤖🎮*
