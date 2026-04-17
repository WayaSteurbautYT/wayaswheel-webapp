const express = require('express');
const router = express.Router();

// In-memory storage for global stats (in production, use a database)
let globalStats = {
  totalSessions: 0,
  totalSpins: 0,
  totalDoom: 0,
  averageDoom: 0,
  mostPopularMode: 'Classic',
  sessionsByMode: {
    'Classic': 0,
    'Chaos Chain': 0,
    'Wheel of Fate': 0,
    'Rapid Fire': 0
  },
  recentSessions: [],
  createdAt: new Date().toISOString()
};

// GET /api/stats/global - Get global statistics
router.get('/global', (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        ...globalStats,
        averageDoom: globalStats.totalSpins > 0 ? Math.round(globalStats.totalDoom / globalStats.totalSpins) : 0,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting global stats:', error);
    res.status(500).json({
      error: 'Failed to get global statistics'
    });
  }
});

// POST /api/stats/update - Update global statistics (called when sessions complete)
router.post('/update', (req, res) => {
  try {
    const { sessionData } = req.body;
    
    if (!sessionData) {
      return res.status(400).json({
        error: 'Session data is required'
      });
    }

    // Update global stats
    globalStats.totalSessions += 1;
    globalStats.totalSpins += sessionData.spins.length;
    globalStats.totalDoom += sessionData.spins.reduce((sum, spin) => sum + spin.doom, 0);
    
    // Update mode statistics
    if (globalStats.sessionsByMode[sessionData.gameMode] !== undefined) {
      globalStats.sessionsByMode[sessionData.gameMode] += 1;
    }

    // Update most popular mode
    const maxSessions = Math.max(...Object.values(globalStats.sessionsByMode));
    globalStats.mostPopularMode = Object.keys(globalStats.sessionsByMode).find(
      mode => globalStats.sessionsByMode[mode] === maxSessions
    );

    // Add to recent sessions (keep last 10)
    globalStats.recentSessions.unshift({
      id: sessionData.id,
      username: sessionData.username,
      gameMode: sessionData.gameMode,
      spins: sessionData.spins.length,
      averageDoom: Math.round(sessionData.spins.reduce((sum, spin) => sum + spin.doom, 0) / sessionData.spins.length),
      finalScore: sessionData.finalScore,
      completedAt: new Date().toISOString()
    });

    globalStats.recentSessions = globalStats.recentSessions.slice(0, 10);

    res.json({
      success: true,
      message: 'Global statistics updated successfully'
    });
  } catch (error) {
    console.error('Error updating global stats:', error);
    res.status(500).json({
      error: 'Failed to update global statistics'
    });
  }
});

// GET /api/stats/leaderboard - Get leaderboard data
router.get('/leaderboard', (req, res) => {
  try {
    const { limit = 10, mode = 'all' } = req.query;
    
    // In a real implementation, this would query a database
    // For now, we'll return mock leaderboard data
    const mockLeaderboard = [
      {
        username: 'Waya',
        gameMode: 'Chaos Chain',
        totalPoints: 1250,
        averageDoom: 75,
        sessions: 3,
        createdAt: new Date().toISOString()
      },
      {
        username: 'TestUser',
        gameMode: 'Classic',
        totalPoints: 980,
        averageDoom: 45,
        sessions: 5,
        createdAt: new Date().toISOString()
      },
      {
        username: 'ChaosPlayer',
        gameMode: 'Rapid Fire',
        totalPoints: 890,
        averageDoom: 82,
        sessions: 2,
        createdAt: new Date().toISOString()
      }
    ];

    let filteredLeaderboard = mockLeaderboard;
    if (mode !== 'all') {
      filteredLeaderboard = mockLeaderboard.filter(entry => entry.gameMode === mode);
    }

    res.json({
      success: true,
      leaderboard: filteredLeaderboard.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard'
    });
  }
});

// GET /api/stats/modes - Get statistics by game mode
router.get('/modes', (req, res) => {
  try {
    const modeStats = Object.keys(globalStats.sessionsByMode).map(mode => ({
      mode,
      sessions: globalStats.sessionsByMode[mode],
      percentage: globalStats.totalSessions > 0 
        ? Math.round((globalStats.sessionsByMode[mode] / globalStats.totalSessions) * 100)
        : 0
    }));

    res.json({
      success: true,
      modeStats
    });
  } catch (error) {
    console.error('Error getting mode stats:', error);
    res.status(500).json({
      error: 'Failed to get mode statistics'
    });
  }
});

// GET /api/stats/recent - Get recent activity
router.get('/recent', (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    res.json({
      success: true,
      recentActivity: globalStats.recentSessions.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error getting recent activity:', error);
    res.status(500).json({
      error: 'Failed to get recent activity'
    });
  }
});

module.exports = router;
