const express = require('express');
const router = express.Router();
const { OllamaClient, DeviceCapabilities } = require('../ai/ollamaClient');
const AITools = require('../ai/aiTools');
const SupabaseClient = require('../supabase/client');

const ollama = new OllamaClient();
const aiTools = new AITools(ollama);
const supabase = new SupabaseClient();

// GET /api/ai/health - Check AI system health
router.get('/health', async (req, res) => {
  try {
    const customHost = req.query.host;
    const ollamaClient = customHost ? new OllamaClient(customHost) : ollama;
    const ollamaHealth = await ollamaClient.checkHealth();
    console.log('Ollama health check result:', ollamaHealth);
    
    const deviceCaps = DeviceCapabilities.detect();
    const recommendation = DeviceCapabilities.getRecommendedModel(deviceCaps);

    res.json({
      success: true,
      ollama: {
        available: ollamaHealth.available || false,
        models: ollamaHealth.models || [],
        error: ollamaHealth.error || null,
        host: ollamaHealth.host || null
      },
      device: deviceCaps,
      recommendation
    });
  } catch (error) {
    console.error('AI health check failed:', error);
    res.json({
      success: true,
      ollama: {
        available: false,
        models: [],
        error: error.message,
        host: null
      },
      device: DeviceCapabilities.detect(),
      recommendation: null
    });
  }
});

// GET /api/ai/device-capabilities - Get device capabilities
router.get('/device-capabilities', (req, res) => {
  try {
    const capabilities = DeviceCapabilities.detect();
    const recommendation = DeviceCapabilities.getRecommendedModel(capabilities);

    res.json({
      success: true,
      capabilities,
      recommendation
    });
  } catch (error) {
    console.error('Device capability detection failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/ai/generate-ending - Generate new wheel ending
router.post('/generate-ending', async (req, res) => {
  try {
    const { doomLevel, gameMode, previousEndings = [], userId, theme } = req.body;

    if (!doomLevel || !gameMode) {
      return res.status(400).json({
        error: 'doomLevel and gameMode are required'
      });
    }

    const ending = await aiTools.generateEnding(doomLevel, gameMode, previousEndings, theme);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'ending', ending, {
        doomLevel,
        gameMode,
        theme,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      ending
    });
  } catch (error) {
    console.error('Generate ending failed:', error);
    res.status(500).json({
      error: 'Failed to generate ending'
    });
  }
});

// POST /api/ai/generate-themed-ending - Generate themed ending with animations
router.post('/generate-themed-ending', async (req, res) => {
  try {
    const { doomLevel, gameMode, theme, userId } = req.body;

    if (!doomLevel || !gameMode || !theme) {
      return res.status(400).json({
        error: 'doomLevel, gameMode, and theme are required'
      });
    }

    const themedEnding = await aiTools.generateThemedEnding(doomLevel, gameMode, theme);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'themed_ending', themedEnding, {
        doomLevel,
        gameMode,
        theme,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      themedEnding
    });
  } catch (error) {
    console.error('Generate themed ending failed:', error);
    res.status(500).json({
      error: 'Failed to generate themed ending'
    });
  }
});

// POST /api/ai/generate-game-mode - Generate new game mode
router.post('/generate-game-mode', async (req, res) => {
  try {
    const { concept, userId } = req.body;

    if (!concept) {
      return res.status(400).json({
        error: 'concept is required'
      });
    }

    const gameMode = await aiTools.generateGameMode(concept);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'game_mode', gameMode, {
        concept,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      gameMode
    });
  } catch (error) {
    console.error('Generate game mode failed:', error);
    res.status(500).json({
      error: 'Failed to generate game mode'
    });
  }
});

// POST /api/ai/generate-response - Generate AI response for wheel result
router.post('/generate-response', async (req, res) => {
  try {
    const { question, result, doomLevel, gameMode, personality, model = 'gemini', apiKey, username } = req.body;

    if (!question || !result) {
      return res.status(400).json({
        error: 'question and result are required'
      });
    }

    // Build prompt with personality context
    let prompt = `You are a mystical wheel of fortune AI with deep cultural knowledge. A user asked: "${question}". The wheel chose: "${result}" with a doom level of ${doomLevel}%.`;
    
    if (username) {
      prompt += `\n\nThe user's identity is "${username}". 

CRITICAL: Analyze this identity deeply:
- If it's a famous persona (e.g., Markiplier, RickSanchez, PewDiePie), understand their cultural context, interests, and associated fandoms
- If "Markiplier" is the identity, they are a famous gaming YouTuber known for FNAF (Five Nights at Freddy's) content, horror games, and deep lore knowledge
- If the result or question relates to something the identity is known for, reference that specific context in your response
- Example: If username is "Markiplier" and result is FNAF-related, reference FNAF lore that a FNAF YouTuber would understand
- Use the identity to provide a deeply personalized response that resonates with this persona`;
    }

    prompt += `\n\nGame mode: ${gameMode}`;

    prompt += `\n\nProvide a response that:
- Explains what the wheel thinks of this question
- Provides the doom/regret rating and why
- Is deeply personalized to the user's identity
- Uses cultural references if the identity suggests a specific persona
- Is witty, insightful, and slightly dramatic
- References the user's identity in a meaningful way
- If the identity has known interests, weave those into the response

Keep it under 150 words.`;

    console.log('Generating AI response with personality:', username);
    const response = await aiTools.generateText(prompt, 'dramatic', model, apiKey);
    console.log('AI response:', response);

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Generate response failed:', error);
    res.status(500).json({
      error: 'Failed to generate response'
    });
  }
});

// POST /api/ai/pull-model - Pull/download an AI model
router.post('/pull-model', async (req, res) => {
  try {
    const { model } = req.body;

    if (!model) {
      return res.status(400).json({
        error: 'model is required'
      });
    }

    // Use Ollama client to pull the model
    const ollama = new (require('../ai/ollamaClient')).OllamaClient();
    
    try {
      await ollama.pullModel(model);
      res.json({
        success: true,
        message: `Model ${model} pulled successfully`
      });
    } catch (error) {
      // If pull fails, it might be because Ollama isn't installed or configured
      // Return success anyway for web app (will use cloud or fallback)
      res.json({
        success: true,
        message: `Model ${model} selected (cloud/fallback mode)`,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Pull model failed:', error);
    res.status(500).json({
      error: 'Failed to pull model'
    });
  }
});

// POST /api/ai/generate-spin-choices - Generate AI choices to show during wheel spin
router.post('/generate-spin-choices', async (req, res) => {
  try {
    const { question, gameMode, model = 'gemini', apiKey, username } = req.body;

    if (!question) {
      return res.status(400).json({
        error: 'question is required'
      });
    }

    // Build prompt with personality context
    let prompt = `You are a mystical wheel of fortune AI with deep cultural knowledge. Generate 8 possible wheel segment choices for a question: "${question}"`;
    
    if (username) {
      prompt += `\n\nThe user's identity is "${username}". 
      
CRITICAL: Analyze this identity deeply:
- If it's a famous persona (e.g., Markiplier, RickSanchez, PewDiePie), understand their cultural context, interests, and associated fandoms
- If "Markiplier" is the identity, they are a famous gaming YouTuber known for FNAF (Five Nights at Freddy's) content, horror games, and deep lore knowledge
- If the question relates to something the identity is known for, generate choices that reference that specific context
- Example: If username is "Markiplier" and question is "is purple guy a bad person", generate FNAF-related choices like "It was Michael Afton", "It wasn't him", "He's possessed", "William Afton did it", etc.
- Use the identity to provide context-aware, culturally relevant choices that resonate with this persona`;
    }

    prompt += `\n\nGame mode: ${gameMode}`;

    prompt += `\n\nGenerate exactly 8 choices as a JSON array with this structure:
[
  {"text": "choice text", "doom": number between 0-100},
  {"text": "choice text", "doom": number between 0-100},
  ...
]

The doom level should reflect how regrettable or dangerous the choice is. Mix of low, medium, and high doom levels.
The choices should be:
- Creative and unexpected
- Relevant to the question
- Varied in tone (some serious, some playful)
- Culturally or contextually aware based on the user's identity
- NEVER use generic options like "chaos", "regret", "fate" - they must be specific to the question
- If the username suggests a specific persona, generate choices that deeply reference that context
- Use lore, references, and context that the identity would understand

Return ONLY the JSON array, no other text.`;

    console.log('Generating spin choices with personality:', username);
    const response = await aiTools.generateText(prompt, 'creative', model, apiKey);
    console.log('AI response for spin choices:', response);

    let choices;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        choices = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (error) {
      console.log('Failed to parse AI choices');
      return res.status(500).json({
        success: false,
        error: 'Failed to generate AI choices. Please check your API key and try again.'
      });
    }

    if (!Array.isArray(choices) || choices.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate AI choices. Please check your API key and try again.'
      });
    }

    res.json({
      success: true,
      choices: choices.slice(0, 8) // Limit to 8 choices
    });
  } catch (error) {
    console.error('Generate spin choices failed:', error);
    res.status(500).json({
      error: 'Failed to generate spin choices'
    });
  }
});

// POST /api/game/save-result - Save game result to Supabase
router.post('/save-result', async (req, res) => {
  try {
    const { username, question, result, doom, answer, gameMode } = req.body;

    if (!username || !question || !result) {
      return res.status(400).json({
        success: false,
        error: 'username, question, and result are required'
      });
    }

    const supabase = require('../supabase/client');

    // First, get or create profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: require('uuid').v4(),
          username: username
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create profile'
        });
      }
      profile = newProfile;
    }

    // Create game session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: profile.id,
        username: username,
        game_mode: gameMode || 'classic',
        status: 'completed',
        final_score: { doom }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create game session'
      });
    }

    // Save spin
    const { data: spin, error: spinError } = await supabase
      .from('spins')
      .insert({
        session_id: session.id,
        question: question,
        result: result,
        doom: doom,
        answer: answer,
        spin_index: 0
      })
      .select()
      .single();

    if (spinError) {
      console.error('Error saving spin:', spinError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save spin'
      });
    }

    // Update user stats
    await supabase.rpc('increment_user_stats', {
      user_id: profile.id,
      spins_count: 1,
      doom_sum: doom,
      games_count: 1
    });

    res.json({
      success: true,
      data: { session, spin }
    });
  } catch (error) {
    console.error('Save result failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save game result'
    });
  }
});

// GET /api/game/regrets - Fetch user's regrets from Supabase
router.get('/regrets', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'username is required'
      });
    }

    const supabase = require('../supabase/client');

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      return res.json({
        success: true,
        regrets: [],
        stats: null
      });
    }

    // Get user's game sessions with spins
    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select(`
        id,
        game_mode,
        created_at,
        final_score,
        spins (
          id,
          question,
          result,
          doom,
          answer,
          created_at
        )
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch regrets'
      });
    }

    // Get user stats
    const { data: statsData, error: statsError } = await supabase
      .from('profiles')
      .select('total_spins, total_doom, games_played')
      .eq('id', profile.id)
      .single();

    res.json({
      success: true,
      regrets: sessions || [],
      stats: statsData || null
    });
  } catch (error) {
    console.error('Fetch regrets failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch regrets'
    });
  }
});

// POST /api/ai/generate-text - Generate text with AI
router.post('/generate-text', async (req, res) => {
  try {
    const { prompt, model = 'grok', apiKey, style = 'creative' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'prompt is required'
      });
    }

    const result = await aiTools.generateText(prompt, style, model, apiKey);

    res.json({
      success: true,
      response: result
    });
  } catch (error) {
    console.error('Generate text failed:', error);
    res.status(500).json({
      error: 'Failed to generate text'
    });
  }
});

// POST /api/ai/generate-review - Generate AI review from user choices
router.post('/generate-review', async (req, res) => {
  try {
    const { spins, gameMode, username, userId } = req.body;

    if (!spins || !Array.isArray(spins) || spins.length === 0) {
      return res.status(400).json({
        error: 'spins array is required'
      });
    }

    const spinsSummary = spins.map((spin, index) => 
      `Spin ${index + 1}: "${spin.question}" → "${spin.result}" (${spin.doom}% doom)`
    ).join('\n');

    const avgDoom = spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length;
    const totalDoom = spins.reduce((sum, spin) => sum + spin.doom, 0);

    const prompt = `Generate a creative and dramatic AI review for a player's journey through "Waya's Wheel of Regret". 

Player: ${username || 'Anonymous'}
Game Mode: ${gameMode}
Total Spins: ${spins.length}
Average Doom: ${avgDoom.toFixed(1)}%
Total Doom: ${totalDoom}%

Spins:
${spinsSummary}

Return a JSON object with:
{
  "text": "Creative review text (2-3 sentences, dramatic and engaging)",
  "rating": number (1-5 stars based on performance),
  "highlights": ["array of 3-5 memorable moments from the spins"],
  "verdict": "one word verdict (e.g., LEGENDARY, DOOMED, CHAOTIC, BALANCED)"
}

Return ONLY valid JSON, no other text.`;

    const result = await aiTools.generateText(prompt, 'dramatic');
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const review = JSON.parse(jsonMatch[0]);
      
      // Save to Supabase if user is authenticated
      if (userId) {
        await supabase.saveGeneratedContent(userId, 'review', review, {
          gameMode,
          spinsCount: spins.length,
          avgDoom,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        review
      });
    } else {
      // Fallback if JSON parsing fails
      const fallbackReview = {
        text: `A journey of ${spins.length} spins with ${avgDoom.toFixed(1)}% average doom. ${avgDoom > 60 ? 'The wheel has judged you harshly.' : 'The wheel smiles upon your choices.'}`,
        rating: Math.max(1, Math.min(5, Math.round((100 - avgDoom) / 20))),
        highlights: spins.slice(0, 3).map(s => s.result),
        verdict: avgDoom > 70 ? 'DOOMED' : avgDoom < 30 ? 'BLESSED' : 'BALANCED'
      };

      res.json({
        success: true,
        review: fallbackReview
      });
    }
  } catch (error) {
    console.error('Generate review failed:', error);
    res.status(500).json({
      error: 'Failed to generate review'
    });
  }
});

// POST /api/ai/generate-visuals - Generate visual/animation suggestions
router.post('/generate-visuals', async (req, res) => {
  try {
    const { context, mood, userId } = req.body;

    if (!context || !mood) {
      return res.status(400).json({
        error: 'context and mood are required'
      });
    }

    const visuals = await aiTools.generateVisualSuggestion(context, mood);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'visual', visuals, {
        context,
        mood,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      visuals
    });
  } catch (error) {
    console.error('Generate visuals failed:', error);
    res.status(500).json({
      error: 'Failed to generate visuals'
    });
  }
});

// POST /api/ai/analyze-image - Analyze image with vision
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageBase64, context, userId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'imageBase64 is required'
      });
    }

    const analysis = await aiTools.analyzeImage(imageBase64, context || '');

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Image analysis failed:', error);
    res.status(500).json({
      error: 'Failed to analyze image'
    });
  }
});

// POST /api/ai/web-search - Perform web search
router.post('/web-search', async (req, res) => {
  try {
    const { query, maxResults = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'query is required'
      });
    }

    const results = await aiTools.webSearch(query, maxResults);

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Web search failed:', error);
    res.status(500).json({
      error: 'Failed to perform web search'
    });
  }
});

// POST /api/ai/generate-text - Generate text
router.post('/generate-text', async (req, res) => {
  try {
    const { prompt, style = 'creative', userId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'prompt is required'
      });
    }

    const text = await aiTools.generateText(prompt, style);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'text', text, {
        prompt,
        style,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      text
    });
  } catch (error) {
    console.error('Text generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate text'
    });
  }
});

// POST /api/ai/generate-code - Generate code
router.post('/generate-code', async (req, res) => {
  try {
    const { requirements, language = 'javascript', userId } = req.body;

    if (!requirements) {
      return res.status(400).json({
        error: 'requirements is required'
      });
    }

    const code = await aiTools.generateCode(requirements, language);

    // Save to Supabase if user is authenticated
    if (userId) {
      await supabase.saveGeneratedContent(userId, 'code', code, {
        requirements,
        language,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      code
    });
  } catch (error) {
    console.error('Code generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate code'
    });
  }
});

// POST /api/ai/filter-content - Filter content for safety
router.post('/filter-content', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'text is required'
      });
    }

    const result = await aiTools.filterContent(text);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Content filtering failed:', error);
    res.status(500).json({
      error: 'Failed to filter content'
    });
  }
});

// POST /api/ai/pull-model - Pull a new Ollama model
router.post('/pull-model', async (req, res) => {
  try {
    const { modelName } = req.body;

    if (!modelName) {
      return res.status(400).json({
        error: 'modelName is required'
      });
    }

    // Start pulling model (this is async)
    ollama.pullModel(modelName)
      .then(result => {
        console.log(`Model ${modelName} pulled successfully`);
      })
      .catch(error => {
        console.error(`Failed to pull model ${modelName}:`, error);
      });

    res.json({
      success: true,
      message: `Started pulling model ${modelName}. This may take several minutes.`
    });
  } catch (error) {
    console.error('Pull model failed:', error);
    res.status(500).json({
      error: 'Failed to pull model'
    });
  }
});

// GET /api/ai/models - Get available models
router.get('/models', async (req, res) => {
  try {
    const models = await ollama.getAvailableModels();

    res.json({
      success: true,
      models
    });
  } catch (error) {
    console.error('Get models failed:', error);
    res.status(500).json({
      error: 'Failed to get models'
    });
  }
});

module.exports = router;
