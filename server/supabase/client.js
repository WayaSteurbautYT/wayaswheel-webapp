const { createClient } = require('@supabase/supabase-js');
const { sendVerificationCode } = require('../utils/email');

class SupabaseClient {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    // Use anon key for client auth operations
    this.client = createClient(supabaseUrl, supabaseAnonKey);
    
    // Use service key for admin operations (bypasses email verification)
    this.adminClient = supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey)
      : this.client;
  }

  // Authentication
  async signUp(email, password, username) {
    try {
      // Generate verification code (6 digits)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Use admin client to create user without sending any email
      const { data, error } = await this.adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Bypass email confirmation
        user_metadata: { username }
      });

      if (error) throw error;
      
      // Create user profile with verification code
      if (data.user) {
        await this.createProfile(data.user.id, username, verificationCode, codeExpiresAt);
        
        // Send verification code via email (use lowercase email for Resend)
        await sendVerificationCode(email.toLowerCase(), username, verificationCode);
      }

      return { 
        success: true, 
        data,
        message: 'Verification code sent to your email'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.client.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // User Profiles
  async createProfile(userId, username, verificationCode = null, codeExpiresAt = null) {
    try {
      const { data, error } = await this.adminClient
        .from('profiles')
        .insert({
          id: userId,
          username,
          created_at: new Date().toISOString(),
          total_spins: 0,
          total_doom: 0,
          games_played: 0,
          verification_code: verificationCode,
          code_expires_at: codeExpiresAt ? codeExpiresAt.toISOString() : null,
          is_verified: false
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async verifyCode(email, code) {
    try {
      // Find user by email in auth (case-insensitive)
      const { data: { users }, error: usersError } = await this.adminClient.auth.admin.listUsers();
      if (usersError) throw usersError;

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Get profile by user ID
      const { data: profile, error: profileError } = await this.adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Profile not found' };
      }

      // Check if already verified
      if (profile.is_verified) {
        return { success: true, message: 'Already verified', email: user.email };
      }

      // Check code expiration
      if (new Date() > new Date(profile.code_expires_at)) {
        return { success: false, error: 'Verification code expired' };
      }

      // Check code
      if (profile.verification_code !== code) {
        return { success: false, error: 'Invalid verification code' };
      }

      // Mark as verified
      const { error: updateError } = await this.adminClient
        .from('profiles')
        .update({ is_verified: true, verification_code: null, code_expires_at: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return { success: true, message: 'Email verified successfully', email: user.email };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Game Sessions
  async createGameSession(userId, gameMode, username) {
    try {
      const { data, error } = await this.client
        .from('game_sessions')
        .insert({
          user_id: userId,
          username,
          game_mode: gameMode,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGameSession(sessionId) {
    try {
      const { data, error } = await this.client
        .from('game_sessions')
        .select('*, spins(*)')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addSpin(sessionId, spinData) {
    try {
      const { data, error } = await this.client
        .from('spins')
        .insert({
          session_id: sessionId,
          ...spinData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async completeGameSession(sessionId, finalScore) {
    try {
      const { data, error } = await this.client
        .from('game_sessions')
        .update({
          status: 'completed',
          final_score: finalScore,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      // Update user stats
      const session = await this.getGameSession(sessionId);
      if (session.success && session.data.user_id) {
        await this.updateUserStats(session.data.user_id, session.data.spins);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUserStats(userId, spins) {
    try {
      const totalDoom = spins.reduce((sum, spin) => sum + spin.doom, 0);
      
      const { error } = await this.client.rpc('increment_user_stats', {
        user_id: userId,
        spins_count: spins.length,
        doom_sum: totalDoom,
        games_count: 1
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Multiplayer Rooms
  async createRoom(hostId, roomName, gameMode, isPublic = false) {
    try {
      // Generate 6-character room code
      const roomCode = this.generateRoomCode();
      
      const { data, error } = await this.client
        .from('rooms')
        .insert({
          host_id: hostId,
          room_code: roomCode,
          name: roomName,
          game_mode: gameMode,
          is_public: isPublic,
          status: 'waiting',
          max_players: 10,
          current_players: 1,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add host as first player
      await this.joinRoom(data.id, hostId);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async joinRoomByCode(roomCode, userId, username) {
    try {
      // Find room by code
      const { data: room, error: roomError } = await this.client
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .eq('status', 'waiting')
        .single();

      if (roomError) throw roomError;

      // Check if room is full
      if (room.current_players >= room.max_players) {
        throw new Error('Room is full');
      }

      // Join the room
      return await this.joinRoom(room.id, userId, username);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getRoom(roomId) {
    try {
      const { data, error } = await this.client
        .from('rooms')
        .select('*, room_players(*), room_messages(*)')
        .eq('id', roomId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPublicRooms(limit = 20) {
    try {
      const { data, error } = await this.client
        .from('rooms')
        .select('*, host:profiles(username), room_players(username)')
        .eq('is_public', true)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async joinRoom(roomId, userId, username) {
    try {
      const { data, error } = await this.client
        .from('room_players')
        .insert({
          room_id: roomId,
          user_id: userId,
          username,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update room player count
      await this.client.rpc('increment_room_players', { room_id: roomId });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async leaveRoom(roomId, userId) {
    try {
      const { error } = await this.client
        .from('room_players')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update room player count
      await this.client.rpc('decrement_room_players', { room_id: roomId });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Room Messages (for chat decides fate)
  async sendRoomMessage(roomId, userId, username, message) {
    try {
      const { data, error } = await this.client
        .from('room_messages')
        .insert({
          room_id: roomId,
          user_id: userId,
          username,
          message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getRoomMessages(roomId, limit = 50) {
    try {
      const { data, error } = await this.client
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Realtime subscriptions
  subscribeToRoom(roomId, callback) {
    return this.client
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_players',
        filter: `room_id=eq.${roomId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, callback)
      .subscribe();
  }

  unsubscribe(channel) {
    this.client.removeChannel(channel);
  }

  // Leaderboard
  async getLeaderboard(limit = 10, gameMode = 'all') {
    try {
      let query = this.client
        .from('profiles')
        .select('username, total_spins, total_doom, games_played')
        .order('total_spins', { ascending: false })
        .limit(limit);

      if (gameMode !== 'all') {
        query = this.client
          .from('game_sessions')
          .select('username, final_score, game_mode')
          .eq('game_mode', gameMode)
          .order('final_score', { ascending: false })
          .limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // AI Generated Content Storage
  async saveGeneratedContent(userId, contentType, content, metadata = {}) {
    try {
      const { data, error } = await this.client
        .from('generated_content')
        .insert({
          user_id: userId,
          content_type: contentType,
          content,
          metadata,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGeneratedContent(userId, contentType = null, limit = 20) {
    try {
      let query = this.client
        .from('generated_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SupabaseClient;
