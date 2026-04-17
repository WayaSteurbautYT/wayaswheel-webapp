const { OllamaClient } = require('./ollamaClient');
const axios = require('axios');

class AITools {
  constructor(ollamaClient) {
    this.ollama = ollamaClient;
  }

  // Vision tool - analyze images/screenshots
  async analyzeImage(imageBase64, context = '') {
    const prompt = `Analyze this image in the context of "${context}". Describe what you see and suggest how it could be used in a game. Focus on visual elements, mood, and potential game mechanics.`;
    
    try {
      const result = await this.ollama.chat('llava:latest', [
        { role: 'user', content: prompt, images: [imageBase64] }
      ]);
      return result.message.content;
    } catch (error) {
      // Fallback to text-only if vision model unavailable
      return await this.generateText(`Image analysis requested for: ${context}. (Vision model unavailable, using text mode)`);
    }
  }

  // Web search tool
  async webSearch(query, maxResults = 5) {
    try {
      // Using DuckDuckGo instant answer API (free, no key required)
      const response = await axios.get('https://api.duckduckgo.com/', {
        params: { q: query, format: 'json', no_html: 1 }
      });
      
      const results = [];
      if (response.data.RelatedTopics) {
        response.data.RelatedTopics.slice(0, maxResults).forEach(topic => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text,
              url: topic.FirstURL,
              snippet: topic.Text
            });
          }
        });
      }

      return results;
    } catch (error) {
      console.error('Web search failed:', error.message);
      return [];
    }
  }

  // Text generation tool
  async generateText(prompt, style = 'creative', model = 'gemini', apiKey = null) {
    const stylePrompts = {
      creative: `Generate creative, engaging content for: ${prompt}. Make it unique and memorable.`,
      formal: `Write a formal, professional description for: ${prompt}.`,
      casual: `Write in a casual, conversational tone about: ${prompt}.`,
      dramatic: `Write with dramatic flair and intensity about: ${prompt}.`,
      cryptic: `Write mysteriously and cryptically about: ${prompt}. Leave some things unsaid.`
    };

    const enhancedPrompt = stylePrompts[style] || stylePrompts.creative;

    // Use Gemini by default (Google AI Studio - Free)
    if (model === 'gemini' && apiKey) {
      return await this.generateWithGemini(enhancedPrompt, apiKey);
    }

    // Use Grok if key is provided and model is 'grok'
    if (model === 'grok' && apiKey) {
      return await this.generateWithGrok(enhancedPrompt, apiKey);
    }

    // Use Groq if key is provided and model is 'groq'
    if (model === 'groq' && apiKey) {
      return await this.generateWithGroq(enhancedPrompt, apiKey);
    }

    // Use OpenRouter if key is provided and model is 'openrouter'
    if (model === 'openrouter' && apiKey) {
      return await this.generateWithOpenRouter(enhancedPrompt, apiKey);
    }

    // Fallback to Ollama if available
    try {
      const result = await this.ollama.generate(model, enhancedPrompt);
      return result.response;
    } catch (error) {
      throw new Error(`Text generation failed: ${error.message}`);
    }
  }

  // OpenRouter API integration
  async generateWithOpenRouter(prompt, apiKey) {
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API failed:', error);
      throw new Error(`OpenRouter generation failed: ${error.message}`);
    }
  }

  // Grok API integration (xAI)
  async generateWithGrok(prompt, apiKey) {
    try {
      const response = await axios.post('https://api.x.ai/v1/chat/completions', {
        model: 'grok-2',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Grok API failed:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new Error('Grok API endpoint not found. Please check your API key and model name.');
      }
      throw new Error(`Grok generation failed: ${error.message}`);
    }
  }

  // Gemini API integration (Google AI Studio - Free)
  async generateWithGemini(prompt, apiKey) {
    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API failed:', error.response?.data || error.message);
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }

  // Groq API integration (fast, free Llama models)
  async generateWithGroq(prompt, apiKey) {
    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API failed:', error);
      throw new Error(`Groq generation failed: ${error.message}`);
    }
  }

  // Code generation tool
  async generateCode(requirements, language = 'javascript') {
    const prompt = `Write clean, well-commented ${language} code for: ${requirements}. 
    Include:
    - Clear function names
    - Error handling
    - Comments explaining logic
    - Modern best practices
    Return only the code, no explanations.`;

    try {
      const result = await this.ollama.generate('codellama:latest', prompt);
      return result.response;
    } catch (error) {
      // Fallback to general model if code model unavailable
      const fallbackResult = await this.ollama.generate('llama3.2:latest', prompt);
      return fallbackResult.response;
    }
  }

  // Generate new wheel ending
  async generateEnding(doomLevel, gameMode, previousEndings = [], theme = null) {
    const context = previousEndings.length > 0 
      ? `Previous endings used: ${previousEndings.join(', ')}. Avoid these.`
      : '';

    const themes = {
      danganronpa: {
        name: 'Danganronpa',
        style: 'anime death game, execution-style, dramatic',
        examples: ['EXECUTION TIME', 'MONOKUMA SMILES', 'DESPAIR AWAITS', 'PUNISHMENT TIME']
      },
      scp: {
        name: 'SCP Foundation',
        style: 'cosmic horror, containment breach, eldritch',
        examples: ['CONTAINMENT BREACH', 'SCP-682 ESCAPED', 'COGNITOHAZARD', 'REALITY BREAK']
      },
      fnaf: {
        name: 'Five Nights at Freddy\'s',
        style: 'animatronic horror, jump scare, night shift',
        examples: ['6 AM SURVIVED', 'FREDDY WATCHES', 'BITE OF 87', 'POWER OUT']
      },
      default: {
        name: 'Classic',
        style: 'mysterious fate, wheel of fortune',
        examples: ['DO IT', 'REGRET IT', 'CHAOS', 'VIBES ONLY']
      }
    };

    const selectedTheme = theme ? (themes[theme.toLowerCase()] || themes.default) : themes.default;
    
    const prompt = `Generate a unique wheel of fate ending with doom level ${doomLevel}% for game mode "${gameMode}".
    Theme: ${selectedTheme.name} (${selectedTheme.style})
    ${context}
    The ending should be:
    - 2-6 words maximum
    - Memorable and impactful
    - Fit the doom level (${doomLevel}% doom = ${doomLevel < 30 ? 'positive' : doomLevel > 70 ? 'negative' : 'mixed'})
    - Match the ${selectedTheme.name} theme (${selectedTheme.style})
    - Not a duplicate of common endings
    - ALL CAPS
    Return ONLY the ending text, nothing else.`;

    try {
      const result = await this.ollama.generate('llama3.2:latest', prompt);
      return result.response.trim().replace(/["']/g, '').toUpperCase();
    } catch (error) {
      // Fallback to pre-defined endings if AI fails
      return this.getFallbackEnding(doomLevel);
    }
  }

  // Generate themed ending with animation code
  async generateThemedEnding(doomLevel, gameMode, theme) {
    const themeConfig = {
      danganronpa: {
        colors: ['#ff0000', '#000000', '#ff69b4'],
        effects: ['blood splatter', 'anime speed lines', 'glitch'],
        animation: 'execution',
        icon: '🔨'
      },
      scp: {
        colors: ['#8b0000', '#000000', '#ff8c00'],
        effects: ['containment breach', 'eldritch particles', 'screen distortion'],
        animation: 'reality_break',
        icon: '☢️'
      },
      fnaf: {
        colors: ['#4a0e0e', '#000000', '#ff0000'],
        effects: ['flicker', 'jump scare', 'camera static'],
        animation: 'nightmare',
        icon: '🐻'
      }
    };

    const config = themeConfig[theme.toLowerCase()] || themeConfig.default;

    const prompt = `Generate a dramatic themed ending for doom level ${doomLevel}% in ${theme} style.
    Return JSON with:
    {
      "title": "dramatic ending title (2-4 words, ALL CAPS)",
      "description": "dramatic description (2-3 sentences)",
      "animationCode": "CSS animation code for the ending effect",
      "visualEffects": ["array of visual effects"],
      "themeColor": "hex color"
    }
    Return ONLY valid JSON.`;

    try {
      const result = await this.ollama.generate('llama3.2:latest', prompt);
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const ending = JSON.parse(jsonMatch[0]);
        return {
          ...ending,
          icon: config.icon,
          defaultEffects: config.effects,
          defaultColors: config.colors
        };
      }
    } catch (error) {
      console.error('Themed ending generation failed:', error);
    }

    // Fallback
    return {
      title: this.getFallbackEnding(doomLevel),
      description: `A ${theme} themed fate awaits you with ${doomLevel}% doom.`,
      animationCode: `
        @keyframes ${theme}_ending {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2); }
        }
      `,
      visualEffects: config.effects,
      themeColor: config.colors[0],
      icon: config.icon
    };
  }

  // Generate new game mode
  async generateGameMode(concept) {
    const prompt = `Design a new game mode for a wheel of regret game based on this concept: "${concept}".
    Return a JSON object with:
    {
      "name": "Mode name",
      "description": "Brief description",
      "maxSpins": number (1-10),
      "multiplier": number (1-3),
      "specialRules": "array of special mechanics",
      "icon": "emoji or icon suggestion"
    }
    Return ONLY valid JSON, no other text.`;

    try {
      const result = await this.ollama.generate('llama3.2:latest', prompt);
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON in response');
    } catch (error) {
      // Return default mode if AI fails
      return {
        name: concept,
        description: `Custom mode based on ${concept}`,
        maxSpins: 3,
        multiplier: 1.5,
        specialRules: ['Custom rules'],
        icon: '🎲'
      };
    }
  }

  // Generate AI response for wheel result
  async generateAIResponse(question, result, doomLevel, personality = 'default', model = 'grok', apiKey = null) {
    const personalities = {
      default: 'Respond mysteriously and dramatically',
      pewdiepie: 'Respond with Swedish chaos energy and humor',
      mrbeast: 'Respond with philanthropic enthusiasm',
      dramatic: 'Respond with maximum drama and intensity',
      cryptic: 'Respond mysteriously with riddles',
      wholesome: 'Respond in a supportive and positive way'
    };

    const style = personalities[personality] || personalities.default;

    const prompt = `The wheel has spoken. Question: "${question}". Result: "${result}" with ${doomLevel}% doom.
    ${style}
    Respond in 1-2 sentences. Be memorable and fit the doom level.`;

    // Use Grok by default (xAI)
    if (model === 'grok' && apiKey) {
      try {
        return await this.generateWithGrok(prompt, apiKey);
      } catch (error) {
        console.error('Grok failed, using fallback');
        return this.getFallbackResponse(doomLevel);
      }
    }

    // Use Groq if key is provided and model is 'groq'
    if (model === 'groq' && apiKey) {
      try {
        return await this.generateWithGroq(prompt, apiKey);
      } catch (error) {
        console.error('Groq failed, using fallback');
        return this.getFallbackResponse(doomLevel);
      }
    }

    // Use OpenRouter if key is provided and model is 'openrouter'
    if (model === 'openrouter' && apiKey) {
      try {
        return await this.generateWithOpenRouter(prompt, apiKey);
      } catch (error) {
        console.error('OpenRouter failed, using fallback');
        return this.getFallbackResponse(doomLevel);
      }
    }

    // Fallback to Ollama
    try {
      const result = await this.ollama.generate(model, prompt);
      return result.response.trim();
    } catch (error) {
      return this.getFallbackResponse(doomLevel);
    }
  }

  // Generate visual/animation suggestion
  async generateVisualSuggestion(context, mood) {
    const prompt = `Suggest visual effects and animations for: "${context}" with mood "${mood}".
    Return JSON with:
    {
      "colors": ["hex colors"],
      "effects": ["particle, glow, shake, etc"],
      "animationType": "spin, fade, pulse, etc",
      "intensity": "low, medium, high"
    }
    Return ONLY valid JSON.`;

    try {
      const result = await this.ollama.generate('llama3.2:latest', prompt);
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getDefaultVisuals(mood);
    } catch (error) {
      return this.getDefaultVisuals(mood);
    }
  }

  // Safe chat filter
  async filterContent(text) {
    const prompt = `Analyze this text for inappropriate content: "${text}".
    Return JSON: {"safe": boolean, "reason": "explanation if not safe"}
    Return ONLY valid JSON.`;

    try {
      const result = await this.ollama.generate('llama3.2:latest', prompt);
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { safe: true, reason: 'Filter unavailable' };
    } catch (error) {
      // Default to safe if filter fails
      return { safe: true, reason: 'Filter unavailable' };
    }
  }

  // Fallback functions
  getFallbackEnding(doomLevel) {
    const endings = {
      low: ['VIBES ONLY', 'COSMIC YES', 'ABSOLUTELY', 'EMBRACE IT'],
      medium: ['MAYBE...', 'ASK AGAIN', 'THINK TWICE'],
      high: ['REGRET IT', 'NEVER EVER', 'RUN AWAY', 'DOOM AWAITS']
    };
    
    if (doomLevel < 30) return endings.low[Math.floor(Math.random() * endings.low.length)];
    if (doomLevel > 70) return endings.high[Math.floor(Math.random() * endings.high.length)];
    return endings.medium[Math.floor(Math.random() * endings.medium.length)];
  }

  getFallbackResponse(doomLevel) {
    const responses = {
      low: ['The cosmic forces align in your favor...', 'The wheel smiles upon you.'],
      medium: ['The wheel is uncertain...', 'Fate hangs in the balance...'],
      high: ['The void laughs at your question. NO.', 'Your fate is sealed with rejection.']
    };
    
    if (doomLevel < 30) return responses.low[Math.floor(Math.random() * responses.low.length)];
    if (doomLevel > 70) return responses.high[Math.floor(Math.random() * responses.high.length)];
    return responses.medium[Math.floor(Math.random() * responses.medium.length)];
  }

  getDefaultVisuals(mood) {
    const moods = {
      positive: { colors: ['#00ff00', '#00ffff'], effects: ['glow', 'particles'], animationType: 'spin', intensity: 'medium' },
      negative: { colors: ['#ff0000', '#ff00ff'], effects: ['shake', 'glitch'], animationType: 'shake', intensity: 'high' },
      neutral: { colors: ['#ffffff', '#888888'], effects: ['fade'], animationType: 'fade', intensity: 'low' }
    };
    return moods[mood] || moods.neutral;
  }
}

module.exports = AITools;
