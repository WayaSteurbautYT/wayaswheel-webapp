const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for sessions (in production, use a database)
const sessions = new Map();

// POST /api/game/session - Create a new game session
router.post('/session', (req, res) => {
  try {
    const { username, gameMode } = req.body;
    
    if (!username || !gameMode) {
      return res.status(400).json({
        error: 'Username and gameMode are required'
      });
    }

    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      username: username.trim(),
      gameMode,
      spins: [],
      createdAt: new Date().toISOString(),
      isComplete: false
    };

    sessions.set(sessionId, session);

    res.json({
      success: true,
      session: {
        id: session.id,
        username: session.username,
        gameMode: session.gameMode,
        spins: session.spins,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Failed to create session'
    });
  }
});

// GET /api/game/session/:id - Get session details
router.get('/session/:id', (req, res) => {
  try {
    const { id } = req.params;
    const session = sessions.get(id);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({
      error: 'Failed to get session'
    });
  }
});

// POST /api/game/session/:id/spin - Add a spin to a session
router.post('/session/:id/spin', (req, res) => {
  try {
    const { id } = req.params;
    const { question, result, doom, answer } = req.body;

    if (!question || !result || doom === undefined || !answer) {
      return res.status(400).json({
        error: 'Question, result, doom, and answer are required'
      });
    }

    const session = sessions.get(id);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    const spin = {
      id: uuidv4(),
      question: question.trim(),
      result,
      doom: parseInt(doom),
      answer,
      timestamp: new Date().toISOString(),
      spinIndex: session.spins.length
    };

    session.spins.push(spin);

    // Check if session is complete based on game mode
    const maxSpins = getMaxSpinsForMode(session.gameMode);
    if (session.spins.length >= maxSpins) {
      session.isComplete = true;
      session.completedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      spin,
      sessionComplete: session.isComplete,
      totalSpins: session.spins.length
    });
  } catch (error) {
    console.error('Error adding spin:', error);
    res.status(500).json({
      error: 'Failed to add spin'
    });
  }
});

// GET /api/game/session/:id/result - Get final results for a session
router.get('/session/:id/result', (req, res) => {
  try {
    const { id } = req.params;
    const session = sessions.get(id);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (!session.isComplete) {
      return res.status(400).json({
        error: 'Session is not complete yet'
      });
    }

    const finalScore = calculateFinalScore(session.spins, session.gameMode);

    res.json({
      success: true,
      session: {
        id: session.id,
        username: session.username,
        gameMode: session.gameMode,
        spins: session.spins,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
        finalScore
      }
    });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({
      error: 'Failed to get results'
    });
  }
});

// DELETE /api/game/session/:id - Delete a session
router.delete('/session/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = sessions.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Failed to delete session'
    });
  }
});

// Helper functions
function getMaxSpinsForMode(mode) {
  const modeConfig = {
    'Classic': 1,
    'Chaos Chain': 6,
    'Wheel of Fate': 6,
    'Rapid Fire': 6
  };
  return modeConfig[mode] || 1;
}

function calculateFinalScore(spins, gameMode) {
  if (!spins || spins.length === 0) {
    return { stars: 0, regretLevel: 0, creativityPoints: 0, stupidityPoints: 0, totalPoints: 0 };
  }

  const avgDoom = spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length;
  const questionLength = spins.reduce((sum, spin) => sum + (spin.question?.length || 0), 0);
  const stars = Math.max(0, Math.min(5, Math.round((100 - avgDoom) / 20)));
  const regretLevel = Math.round(avgDoom);
  const creativity = Math.min(100, Math.round(questionLength / spins.length * 2));
  const stupidity = Math.round(avgDoom * 0.8 + Math.random() * 20);
  
  const multiplier = {
    'Classic': 1,
    'Chaos Chain': 2,
    'Wheel of Fate': 1.5,
    'Rapid Fire': 1.2
  }[gameMode] || 1;
  
  const total = Math.round((creativity + (100 - regretLevel) + stars * 20) * multiplier);
  
  return { stars, regretLevel, creativityPoints: creativity, stupidityPoints: stupidity, totalPoints: total };
}

module.exports = router;
