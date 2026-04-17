# How I Built My First AI "Vibe Coded" App - Full Tutorial

## 🎬 Video Title: "How I Built an AI-Powered Fortune Wheel in 24 Hours (Vibe Coding Tutorial)"

---

## 📺 Introduction (0:00 - 2:00)

**[Visual: Screen recording of the spinning wheel with dramatic music]**

**Speaker:** "What if you could ask any question, spin a wheel, and get an AI-generated answer with a 'doom level' that predicts how regretful your choice will be? Today, I'm going to show you how I built this AI-powered fortune wheel using 'vibe coding'—coding based on intuition and flow rather than strict planning. This is Waya's Wheel of Regret, and I built it in 24 hours. Let me show you how you can do it too."

---

## 🎯 What is Vibe Coding? (2:00 - 4:00)

**[Visual: Text overlay: "Vibe Coding = Coding by Intuition"]**

**Speaker:** "So what is vibe coding? Traditional coding involves strict planning, diagrams, and step-by-step implementation. Vibe coding is different—you start with an idea, follow your intuition, build what feels right, and iterate as you go. It's like jazz improvisation but with code."

**[Visual: Split screen showing traditional coding flowchart vs vibe coding freeform]**

**Speaker:** "For this project, I didn't start with a 50-page spec document. I started with a simple idea: 'What if Magic 8-Ball met AI?' Then I just started building. I added features as I thought of them, changed things that didn't feel right, and let the project evolve naturally. The result? A fully functional AI app that's actually fun to use."

---

## 🛠️ Tech Stack Explained Simply (4:00 - 7:00)

**[Visual: Animated diagram showing the tech stack layers]**

**Speaker:** "Before we dive in, let me explain the tech stack in plain English. Don't worry if you're not a coder—I'll break it down."

### Frontend (What You See)
**[Visual: React logo, then styled components, then framer motion animations]**

**Speaker:** "The frontend is built with React—it's like building with LEGO blocks. Each component is a block, and you snap them together. Styled Components handles the look and feel, and Framer Motion adds those smooth animations you see when the wheel spins."

### Backend (The Hidden Engine)
**[Visual: Node.js logo, Express, Supabase]**

**Speaker:** "The backend runs on Node.js with Express—it's like the kitchen in a restaurant. It takes orders from the frontend, processes them, talks to the AI, and sends responses back. Supabase handles the database and authentication—it remembers who's playing and their history."

### AI APIs (The Brain)
**[Visual: Grok, Gemini, Ollama logos]**

**Speaker:** "The AI is where the magic happens. I integrated multiple AI models—Grok, Gemini, and Ollama. Each has its own personality. Grok is witty, Gemini is balanced, and Ollama runs locally on your computer. The AI generates custom wheel options based on your questions."

---

## 🚀 Step 1: Project Setup (7:00 - 10:00)

**[Visual: Terminal showing commands being typed]**

**Speaker:** "First, I set up the project structure. I created three main folders: client, server, and shared. The client holds the React app, the server holds the backend, and shared holds code both use."

**[Visual: Folder structure diagram]**

**Speaker:** "I initialized the client with Create React App, set up the server with Express, and installed dependencies. For the vibe coding approach, I didn't plan everything upfront—I just set up the basic structure and started building."

**Commands shown:**
```bash
npx create-react-app client
cd server
npm init -y
npm install express cors supabase
```

---

## 🎨 Step 2: Building the Frontend (10:00 - 15:00)

**[Visual: Screen recording of building the wheel component]**

**Speaker:** "I started with the wheel component. I used the HTML5 Canvas API to draw the wheel—each segment is a slice of the pie. The spinning animation uses requestAnimationFrame for smooth performance."

**[Visual: Code snippet showing the drawWheel function]**

**Speaker:** "Here's the key insight: the wheel isn't just a static image. It's drawn dynamically based on the segments. When AI generates new options, the wheel redraws automatically. This makes it infinitely flexible."

**[Visual: Wheel spinning with different segment counts]**

**Speaker:** "I added styled components for the UI—dark theme with red accents for that mystical vibe. Framer Motion handles all the animations—the fade-ins, the hover effects, the dramatic result reveal."

---

## 🤖 Step 3: Integrating AI (15:00 - 20:00)

**[Visual: Diagram showing API request flow]**

**Speaker:** "This is where it gets interesting. The AI integration. When you type a question, the app sends it to the backend, which forwards it to the AI API. The AI generates wheel options based on your question."

**[Visual: Code showing the AI endpoint]**

**Speaker:** "I built a flexible AI handler that supports multiple models. You can switch between Grok, Gemini, or Ollama just by changing a dropdown. The prompt engineering is key here—I ask the AI to generate 8 options with doom levels."

**[Visual: Example prompt and AI response]**

**Speaker:** "The prompt is: 'Generate 8 wheel options for this question, with doom levels from 0-100.' The AI returns JSON with the options, and I map them to wheel segments with colors."

---

## 🔐 Step 4: Authentication & Database (20:00 - 23:00)

**[Visual: Supabase dashboard and authentication flow]**

**Speaker:** "For authentication, I used Supabase. It's like Firebase but with more control. Users can sign up, login, or play as a guest. Guest mode is great for trying the app without commitment."

**[Visual: Database schema diagram]**

**Speaker:** "The database stores user sessions and spin history. This lets users view their past regrets and see their average doom level. Supabase handles all the security—I don't have to worry about password hashing or SQL injection."

---

## 🎵 Step 5: Adding Sound & Visual Effects (23:00 - 26:00)

**[Visual: Sound wave visualization and meme GIFs]**

**Speaker:** "Sound effects make or break the experience. I used the Web Audio API to generate sounds—clicks, spins, doom sounds. I also integrated external audio files from Mixkit for higher quality."

**[Visual: SoundManager code]**

**Speaker:** "The SoundManager class handles everything—volume controls, play/pause, fallback to generated sounds if external files fail. I added a music toggle button so users can control the background music."

**[Visual: Meme GIFs on results screen]**

**Speaker:** "For the results screen, I added meme GIFs from Giphy. Based on your doom level, the app shows a relevant meme—celebration for low doom, panic for high doom. It adds humor and shareability."

---

## 🐛 Step 6: Debugging & Improvements (26:00 - 30:00)

**[Visual: Bug fixes and optimizations]**

**Speaker:** "Of course, it wasn't all smooth sailing. I had memory leaks from intervals not being cleaned up. I fixed that by adding proper cleanup in useEffect hooks."

**[Visual: Before/after of memory usage]**

**Speaker:** "I also centralized all API URLs into a config file. This makes deployment easier—just change one URL instead of hunting through every file. I added error handling for localStorage operations so the app doesn't crash if storage is full."

**[Visual: Config file and error handling code]**

**Speaker:** "Responsive design was crucial. I tested on mobile and adjusted the wheel size and layout. The app now works on phones, tablets, and desktops."

---

## 🎮 Step 7: Game Modes & Features (30:00 - 34:00)

**[Visual: Game mode selection screen]**

**Speaker:** "I added four game modes for variety. Classic is 5 spins, Chaos is 10 wild spins, Fate is 3 deep spins, and Rapid is 15 quick spins. Each mode has a different personality."

**[Visual: Comparison of game modes]**

**Speaker:** "I also added a results screen that shows your journey—every question, every answer, every doom level. It calculates a final regret score and shows relevant memes. Users can play again or return to the menu."

---

## 🚀 Deployment (34:00 - 37:00)

**[Visual: Deployment process diagram]**

**Speaker:** "For deployment, the frontend goes to a hosting service like Netlify or Vercel. The backend goes to a server like Heroku, Railway, or a VPS. Supabase is already hosted, so no setup needed there."

**[Visual: CI/CD pipeline]**

**Speaker:** "I set up environment variables for API keys and database URLs. Never commit these to Git! Use .env files and add them to .gitignore. The config file I created makes this easy."

---

## 💡 Key Lessons Learned (37:00 - 40:00)

**[Visual: Bullet points with icons]**

**Speaker:** "Here are my key lessons from this vibe coding experience:"

1. **Start with the core feature** - Build the wheel first, add everything else later
2. **Use existing libraries** - Don't reinvent the wheel (pun intended). Use React, Framer Motion, Supabase
3. **Make it fun first** - If it's not enjoyable, no one will use it
4. **Add polish later** - Animations, sounds, and effects come after the core works
5. **Embrace imperfection** - Vibe coding means accepting that you'll refactor as you go

---

## 🎯 How You Can Do It Too (40:00 - 44:00)

**[Visual: Step-by-step checklist]**

**Speaker:** "Want to build your own AI app? Here's your roadmap:"

**Step 1: Choose a simple idea** - Don't overcomplicate it. A chatbot, a game, a tool
**Step 2: Pick your tech stack** - React + Express + Supabase is a great starting point
**Step 3: Build the frontend first** - Get the UI working before adding AI
**Step 4: Integrate one AI model** - Start with one, add more later
**Step 5: Add authentication** - Use Supabase or Firebase
**Step 6: Polish and deploy** - Add sounds, animations, then ship it

**[Visual: Resources section with links]**

**Speaker:** "Check the description for links to all the resources I mentioned—React docs, Supabase tutorials, AI API documentation. Everything you need is freely available."

---

## 🎬 Conclusion (44:00 - 47:00)

**[Visual: Montage of the app in action]**

**Speaker:** "Waya's Wheel of Regret started as a simple idea and became a fully functional AI app in 24 hours through vibe coding. It's not perfect, but it works, it's fun, and I learned a ton building it."

**[Visual: Final screen with call to action]**

**Speaker:** "The best way to learn is by doing. Don't wait for the perfect plan—start building, follow your intuition, and let your project evolve naturally. You might surprise yourself with what you can create."

**[Visual: Subscribe button and social links]**

**Speaker:** "If you found this helpful, smash that like button and subscribe for more coding tutorials. Drop a comment with what AI app you want to build. Thanks for watching, and happy vibe coding!"

---

## 📚 Additional Resources

### Links to Include in Video Description:
- React Documentation: https://react.dev
- Supabase: https://supabase.com
- Framer Motion: https://www.framer.com/motion
- Grok API: https://x.ai
- Google Gemini: https://ai.google.dev
- Ollama: https://ollama.com
- Mixkit Sounds: https://mixkit.co
- Giphy API: https://developers.giphy.com

### Project Repository:
- GitHub: [Link to your repo]

### Social:
- Twitter/X: [Your handle]
- Discord: [Your server]

---

## 🎥 Production Tips

### For Recording:
- Use OBS Studio or similar screen recorder
- Record at 1080p or 4K
- Use a good microphone
- Add background music (royalty-free)
- Include code snippets as overlays
- Use zoom and pan for focus

### For Editing:
- Cut dead air and mistakes
- Add visual transitions
- Include progress indicators
- Add closed captions
- Keep under 10 minutes per section
- Use engaging thumbnails

### For Engagement:
- Ask questions throughout
- Include timestamps in description
- Add chapter markers
- Respond to comments
- Create a community around your content

---

## 🌟 Final Thoughts

This tutorial script is designed to be engaging, educational, and inspiring. It breaks down complex concepts into digestible pieces while maintaining the "vibe coding" philosophy. Feel free to adapt it to your style and add your personal touches!

Good luck with your video! 🎬
