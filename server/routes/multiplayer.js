const express = require('express');
const router = express.Router();
const SupabaseClient = require('../supabase/client');

const supabase = new SupabaseClient();

// POST /api/multiplayer/create-room - Create a new multiplayer room
router.post('/create-room', async (req, res) => {
  try {
    const { userId, roomName, gameMode, isPublic = false } = req.body;

    if (!userId || !roomName || !gameMode) {
      return res.status(400).json({
        error: 'userId, roomName, and gameMode are required'
      });
    }

    const result = await supabase.createRoom(userId, roomName, gameMode, isPublic);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Create room failed:', error);
    res.status(500).json({
      error: 'Failed to create room'
    });
  }
});

// GET /api/multiplayer/rooms/:roomId - Get room details
router.get('/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await supabase.getRoom(roomId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get room failed:', error);
    res.status(500).json({
      error: 'Failed to get room'
    });
  }
});

// GET /api/multiplayer/public-rooms - Get list of public rooms
router.get('/public-rooms', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const result = await supabase.getPublicRooms(parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Get public rooms failed:', error);
    res.status(500).json({
      error: 'Failed to get public rooms'
    });
  }
});

// POST /api/multiplayer/join-room - Join a room by ID
router.post('/join-room', async (req, res) => {
  try {
    const { roomId, userId, username } = req.body;

    if (!roomId || !userId || !username) {
      return res.status(400).json({
        error: 'roomId, userId, and username are required'
      });
    }

    const result = await supabase.joinRoom(roomId, userId, username);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Join room failed:', error);
    res.status(500).json({
      error: 'Failed to join room'
    });
  }
});

// POST /api/multiplayer/join-by-code - Join a room by code
router.post('/join-by-code', async (req, res) => {
  try {
    const { roomCode, userId, username } = req.body;

    if (!roomCode || !userId || !username) {
      return res.status(400).json({
        error: 'roomCode, userId, and username are required'
      });
    }

    const result = await supabase.joinRoomByCode(roomCode, userId, username);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Join by code failed:', error);
    res.status(500).json({
      error: 'Failed to join room by code'
    });
  }
});

// POST /api/multiplayer/leave-room - Leave a room
router.post('/leave-room', async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({
        error: 'roomId and userId are required'
      });
    }

    const result = await supabase.leaveRoom(roomId, userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Leave room failed:', error);
    res.status(500).json({
      error: 'Failed to leave room'
    });
  }
});

// POST /api/multiplayer/send-message - Send message to room
router.post('/send-message', async (req, res) => {
  try {
    const { roomId, userId, username, message } = req.body;

    if (!roomId || !userId || !username || !message) {
      return res.status(400).json({
        error: 'roomId, userId, username, and message are required'
      });
    }

    // Filter message for safety
    const { filterContent } = require('../ai/aiTools');
    const aiTools = new (require('../ai/aiTools'))(require('../ai/ollamaClient').ollama);
    const filterResult = await aiTools.filterContent(message);

    if (!filterResult.safe) {
      return res.status(400).json({
        error: 'Message violates content policy',
        reason: filterResult.reason
      });
    }

    const result = await supabase.sendRoomMessage(roomId, userId, username, message);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Send message failed:', error);
    res.status(500).json({
      error: 'Failed to send message'
    });
  }
});

// GET /api/multiplayer/rooms/:roomId/messages - Get room messages
router.get('/rooms/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;
    const result = await supabase.getRoomMessages(roomId, parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Get messages failed:', error);
    res.status(500).json({
      error: 'Failed to get messages'
    });
  }
});

// POST /api/multiplayer/start-game - Start game in room
router.post('/start-game', async (req, res) => {
  try {
    const { roomId, gameMode } = req.body;

    if (!roomId || !gameMode) {
      return res.status(400).json({
        error: 'roomId and gameMode are required'
      });
    }

    // Update room status to playing
    const { data, error } = await supabase.client
      .from('rooms')
      .update({ status: 'playing', started_at: new Date().toISOString() })
      .eq('id', roomId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Start game failed:', error);
    res.status(500).json({
      error: 'Failed to start game'
    });
  }
});

// POST /api/multiplayer/eliminate-player - AI eliminates a player
router.post('/eliminate-player', async (req, res) => {
  try {
    const { roomId, playerId, aiModel = 'qwen3.5:4b' } = req.body;

    if (!roomId || !playerId) {
      return res.status(400).json({
        error: 'roomId and playerId are required'
      });
    }

    // Get room details
    const { data: room, error: roomError } = await supabase.client
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    // Check if elimination mode is enabled
    if (room.game_mode !== 'elimination') {
      return res.status(400).json({
        error: 'Elimination mode not enabled for this room'
      });
    }

    // Get player to eliminate
    const { data: player, error: playerError } = await supabase.client
      .from('room_players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (playerError) throw playerError;

    // Generate AI elimination message
    const aiTools = require('../ai/aiTools');
    const eliminationMessage = await aiTools.generateText(
      `Generate a dramatic elimination message for player "${player.username}" in a wheel of regret game. Make it ominous but fair. Keep it under 100 words.`,
      'dramatic'
    );

    // Mark player as eliminated
    const { error: updateError } = await supabase.client
      .from('room_players')
      .update({ 
        is_eliminated: true,
        eliminated_at: new Date().toISOString(),
        elimination_reason: eliminationMessage
      })
      .eq('id', playerId);

    if (updateError) throw updateError;

    // Add elimination message to chat
    await supabase.client
      .from('room_messages')
      .insert({
        room_id: roomId,
        player_id: 'AI_ELIMINATOR',
        username: 'AI',
        message: `💀 ${player.username} has been eliminated! ${eliminationMessage}`,
        message_type: 'elimination'
      });

    // Update room player count
    await supabase.client
      .from('rooms')
      .update({ current_players: room.current_players - 1 })
      .eq('id', roomId);

    // Check if only one player remains
    const { data: remainingPlayers } = await supabase.client
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_eliminated', false);

    if (remainingPlayers && remainingPlayers.length === 1) {
      // Declare winner
      const winner = remainingPlayers[0];
      await supabase.client
        .from('room_messages')
        .insert({
          room_id: roomId,
          player_id: 'SYSTEM',
          username: 'System',
          message: `🏆 ${winner.username} wins the elimination match!`,
          message_type: 'system'
        });

      await supabase.client
        .from('rooms')
        .update({ status: 'completed' })
        .eq('id', roomId);
    }

    res.json({
      success: true,
      eliminated: player.username,
      message: eliminationMessage
    });
  } catch (error) {
    console.error('Eliminate player failed:', error);
    res.status(500).json({
      error: 'Failed to eliminate player'
    });
  }
});

// POST /api/multiplayer/submit-spin - Submit a spin result in multiplayer
router.post('/submit-spin', async (req, res) => {
  try {
    const { roomId, userId, spinData } = req.body;

    if (!roomId || !userId || !spinData) {
      return res.status(400).json({
        error: 'roomId, userId, and spinData are required'
      });
    }

    // Store spin in room-specific storage
    const { data, error } = await supabase.client
      .from('room_spins')
      .insert({
        room_id: roomId,
        user_id: userId,
        ...spinData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Submit spin failed:', error);
    res.status(500).json({
      error: 'Failed to submit spin'
    });
  }
});

// GET /api/multiplayer/rooms/:roomId/spins - Get all spins in room
router.get('/rooms/:roomId/spins', async (req, res) => {
  try {
    const { roomId } = req.params;

    const { data, error } = await supabase.client
      .from('room_spins')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get spins failed:', error);
    res.status(500).json({
      error: 'Failed to get spins'
    });
  }
});

// POST /api/multiplayer/chat-decides-fate - Let chat vote on wheel result
router.post('/chat-decides-fate', async (req, res) => {
  try {
    const { roomId, question, options = [] } = req.body;

    if (!roomId || !question) {
      return res.status(400).json({
        error: 'roomId and question are required'
      });
    }

    // Create a voting session
    const { data, error } = await supabase.client
      .from('chat_votes')
      .insert({
        room_id: roomId,
        question,
        options: options || ['YES', 'NO', 'CHAOS'],
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Chat decides fate failed:', error);
    res.status(500).json({
      error: 'Failed to create voting session'
    });
  }
});

// POST /api/multiplayer/vote - Vote in chat decides fate
router.post('/vote', async (req, res) => {
  try {
    const { voteId, userId, option } = req.body;

    if (!voteId || !userId || !option) {
      return res.status(400).json({
        error: 'voteId, userId, and option are required'
      });
    }

    const { data, error } = await supabase.client
      .from('vote_responses')
      .insert({
        vote_id: voteId,
        user_id: userId,
        option,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Vote failed:', error);
    res.status(500).json({
      error: 'Failed to submit vote'
    });
  }
});

// POST /api/multiplayer/publish - Publish results to community
router.post('/publish', async (req, res) => {
  try {
    const { username, spins, stats } = req.body;

    if (!username || !spins || !Array.isArray(spins)) {
      return res.status(400).json({
        error: 'username and spins array are required'
      });
    }

    // Save to community results in Supabase
    const avgDoom = spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length;
    
    const { data, error } = await supabase.client
      .from('community_results')
      .insert({
        username,
        spins_count: spins.length,
        avg_doom: avgDoom,
        total_doom: spins.reduce((sum, spin) => sum + spin.doom, 0),
        spins_data: spins,
        stats,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Publish to community failed:', error);
    res.status(500).json({
      error: 'Failed to publish to community'
    });
  }
});

// GET /api/multiplayer/community - Get community results
router.get('/community', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const { data, error } = await supabase.client
      .from('community_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get community results failed:', error);
    res.status(500).json({
      error: 'Failed to get community results'
    });
  }
});

// GET /api/multiplayer/votes/:voteId - Get vote results
router.get('/votes/:voteId', async (req, res) => {
  try {
    const { voteId } = req.params;

    // Get vote session
    const { data: vote, error: voteError } = await supabase.client
      .from('chat_votes')
      .select('*')
      .eq('id', voteId)
      .single();

    if (voteError) throw voteError;

    // Get all responses
    const { data: responses, error: responsesError } = await supabase.client
      .from('vote_responses')
      .select('*')
      .eq('vote_id', voteId);

    if (responsesError) throw responsesError;

    // Count votes
    const counts = {};
    responses.forEach(r => {
      counts[r.option] = (counts[r.option] || 0) + 1;
    });

    // Determine winner
    let winner = null;
    let maxVotes = 0;
    Object.entries(counts).forEach(([option, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winner = option;
      }
    });

    res.json({
      success: true,
      vote,
      responses,
      counts,
      winner
    });
  } catch (error) {
    console.error('Get vote results failed:', error);
    res.status(500).json({
      error: 'Failed to get vote results'
    });
  }
});

// POST /api/multiplayer/end-vote - End voting session
router.post('/end-vote', async (req, res) => {
  try {
    const { voteId } = req.body;

    if (!voteId) {
      return res.status(400).json({
        error: 'voteId is required'
      });
    }

    const { data, error } = await supabase.client
      .from('chat_votes')
      .update({ status: 'completed', ended_at: new Date().toISOString() })
      .eq('id', voteId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('End vote failed:', error);
    res.status(500).json({
      error: 'Failed to end vote'
    });
  }
});

module.exports = router;
