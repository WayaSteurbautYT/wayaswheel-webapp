import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
`;

const LeaderboardCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(255, 0, 0, 0.2);
`;

const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 0, 0, 0.2);
  
  &:nth-child(1) {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
    border-color: #ffd700;
  }
  
  &:nth-child(2) {
    background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.1));
    border-color: #c0c0c0;
  }
  
  &:nth-child(3) {
    background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 134, 11, 0.1));
    border-color: #cd7f32;
  }
`;

const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.rank <= 3 ? '#ffd700' : 'rgba(255, 255, 255, 0.7)'};
  width: 40px;
`;

const PlayerInfo = styled.div`
  flex: 1;
  margin-left: 15px;
`;

const PlayerName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
`;

const PlayerStats = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const DoomLevel = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.doom < 30 ? '#00ff00' : props.doom < 60 ? '#ffaa00' : '#ff0000'};
`;

const BackButton = styled(motion.button)`
  margin-top: 30px;
  padding: 15px 40px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
`;

const Leaderboard = ({ onClose, username }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock leaderboard data - in production, this would come from the server
    const mockData = [
      { rank: 1, username: 'DoomMaster', totalSpins: 150, avgDoom: 85 },
      { rank: 2, username: 'LuckyDuck', totalSpins: 200, avgDoom: 15 },
      { rank: 3, username: 'FateSpinner', totalSpins: 100, avgDoom: 50 },
      { rank: 4, username: 'WheelWarrior', totalSpins: 75, avgDoom: 45 },
      { rank: 5, username: 'RegretKing', totalSpins: 120, avgDoom: 72 },
      { rank: 6, username: 'SpinDoctor', totalSpins: 90, avgDoom: 38 },
      { rank: 7, username: 'FortuneTeller', totalSpins: 60, avgDoom: 55 },
      { rank: 8, username: 'ChaosAgent', totalSpins: 110, avgDoom: 65 },
      { rank: 9, username: 'DoomSeeker', totalSpins: 85, avgDoom: 78 },
      { rank: 10, username: 'LuckyStrike', totalSpins: 95, avgDoom: 22 },
    ];
    
    // Add current user if not in top 10
    if (username && !mockData.find(p => p.username === username)) {
      mockData.push({
        rank: 11,
        username: username,
        totalSpins: 10,
        avgDoom: 50
      });
    }
    
    setLeaderboard(mockData);
    setLoading(false);
  }, [username]);

  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🏆 Global Leaderboard
      </Title>

      <LeaderboardCard
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {loading ? (
          <EmptyState>Loading leaderboard...</EmptyState>
        ) : leaderboard.length === 0 ? (
          <EmptyState>No players yet. Be the first to spin!</EmptyState>
        ) : (
          leaderboard.map((player, index) => (
            <LeaderboardItem
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Rank rank={player.rank}>#{player.rank}</Rank>
              <PlayerInfo>
                <PlayerName>{player.username}</PlayerName>
                <PlayerStats>{player.totalSpins} spins</PlayerStats>
              </PlayerInfo>
              <DoomLevel doom={player.avgDoom}>{player.avgDoom}% avg doom</DoomLevel>
            </LeaderboardItem>
          ))
        )}
      </LeaderboardCard>

      <BackButton
        onClick={onClose}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Menu
      </BackButton>
    </Container>
  );
};

export default Leaderboard;
