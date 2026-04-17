-- Waya's Wheel of Regret - Supabase Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_spins INTEGER DEFAULT 0,
  total_doom INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  avatar_url TEXT,
  bio TEXT,
  verification_code TEXT,
  code_expires_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT false
);

-- Logged in sessions table for session persistence
CREATE TABLE IF NOT EXISTS logged_in (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_guest BOOLEAN DEFAULT false
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  game_mode TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, abandoned
  final_score JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Spins table
CREATE TABLE IF NOT EXISTS spins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  result TEXT NOT NULL,
  doom INTEGER NOT NULL,
  answer TEXT,
  spin_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multiplayer rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  room_code TEXT UNIQUE NOT NULL, -- 6-character code for joining
  name TEXT NOT NULL,
  game_mode TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'waiting', -- waiting, playing, completed
  max_players INTEGER DEFAULT 10,
  current_players INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Room players table
CREATE TABLE IF NOT EXISTS room_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  is_host BOOLEAN DEFAULT false,
  is_eliminated BOOLEAN DEFAULT false,
  eliminated_at TIMESTAMP WITH TIME ZONE,
  elimination_reason TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Room messages table (for chat)
CREATE TABLE IF NOT EXISTS room_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat votes table (for "chat decides fate" feature)
CREATE TABLE IF NOT EXISTS chat_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Vote responses table
CREATE TABLE IF NOT EXISTS vote_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vote_id UUID REFERENCES chat_votes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vote_id, user_id)
);

-- Room spins table (for multiplayer game sessions)
CREATE TABLE IF NOT EXISTS room_spins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  question TEXT NOT NULL,
  result TEXT NOT NULL,
  doom INTEGER NOT NULL,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content table (AI-generated content storage)
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- ending, game_mode, visual, text, code
  content JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_spins_session_id ON spins(session_id);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_is_public ON rooms(is_public);
CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user_id ON room_players(user_id);
CREATE INDEX IF NOT EXISTS idx_room_messages_room_id ON room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_room_messages_created_at ON room_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_votes_room_id ON chat_votes(room_id);
CREATE INDEX IF NOT EXISTS idx_vote_responses_vote_id ON vote_responses(vote_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_type ON generated_content(content_type);

-- Row Level Security (RLS) policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles are publicly viewable" ON profiles
  FOR SELECT USING (true);

-- Game sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Spins
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own spins" ON spins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = spins.session_id 
      AND game_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create spins in own sessions" ON spins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = spins.session_id 
      AND game_sessions.user_id = auth.uid()
    )
  );

-- Rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rooms" ON rooms
  FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Users can create rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update own rooms" ON rooms
  FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Public rooms are viewable" ON rooms
  FOR SELECT USING (is_public = true);

-- Room players
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view room players" ON room_players
  FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON room_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave rooms" ON room_players
  FOR DELETE USING (auth.uid() = user_id);

-- Room messages
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view room messages" ON room_messages
  FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON room_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat votes
ALTER TABLE chat_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view chat votes" ON chat_votes
  FOR SELECT USING (true);
CREATE POLICY "Room hosts can create votes" ON chat_votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = chat_votes.room_id 
      AND rooms.host_id = auth.uid()
    )
  );

-- Vote responses
ALTER TABLE vote_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view vote responses" ON vote_responses
  FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON vote_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Room spins
ALTER TABLE room_spins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view room spins" ON room_spins
  FOR SELECT USING (true);
CREATE POLICY "Users can submit spins" ON room_spins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Generated content
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own generated content" ON generated_content
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create generated content" ON generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for statistics updates

CREATE OR REPLACE FUNCTION increment_user_stats(user_id UUID, spins_count INTEGER, doom_sum INTEGER, games_count INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    total_spins = total_spins + spins_count,
    total_doom = total_doom + doom_sum,
    games_played = games_played + games_count,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_room_players(room_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE rooms
  SET current_players = current_players + 1
  WHERE id = room_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_room_players(room_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE rooms
  SET current_players = GREATEST(current_players - 1, 0)
  WHERE id = room_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Realtime subscriptions setup
-- Enable realtime for these tables in Supabase dashboard:
-- - room_messages
-- - room_players
-- - rooms
-- - chat_votes
-- - vote_responses

-- Sample data for testing (optional)

-- INSERT INTO profiles (id, username, total_spins, total_doom, games_played)
-- VALUES 
--   (uuid_generate_v4(), 'TestUser1', 50, 2500, 10),
--   (uuid_generate_v4(), 'TestUser2', 30, 1800, 5);

-- Comments for setup:
-- 1. Create a Supabase project at https://supabase.com
-- 2. Run this SQL in the SQL Editor
-- 3. Enable Row Level Security (RLS) is already configured
-- 4. Enable Realtime for multiplayer tables in the dashboard
-- 5. Add your Supabase URL and keys to .env file:
--    SUPABASE_URL=your-project-url
--    SUPABASE_ANON_KEY=your-anon-key
--    SUPABASE_SERVICE_KEY=your-service-role-key
