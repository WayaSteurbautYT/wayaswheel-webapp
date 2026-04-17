import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import LoadingSpinner from './LoadingSpinner';
import { API_ENDPOINTS } from '../config';
import { fetchJSONWithRetry } from '../utils/apiHelper';
import { spinsToCSV, downloadCSV, spinsToJSON, downloadJSON } from '../utils/exportHelper';

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
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 800px;
  width: 100%;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff0000;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RegretsList = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 30px;
`;

const RegretItem = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff0000;
    box-shadow: 0 5px 20px rgba(255, 0, 0, 0.2);
  }
`;

const RegretQuestion = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
`;

const RegretResult = styled.div`
  font-size: 1.1rem;
  color: #ff0000;
  margin-bottom: 10px;
`;

const RegretAnswer = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.5;
`;

const RegretMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 0, 0, 0.2);
`;

const DoomBadge = styled.div`
  background: ${props => props.doom > 70 ? 'rgba(255, 0, 0, 0.3)' : props.doom > 40 ? 'rgba(255, 170, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'};
  border: 1px solid ${props => props.doom > 70 ? '#ff0000' : props.doom > 40 ? '#ffaa00' : '#00ff00'};
  border-radius: 10px;
  padding: 5px 15px;
  font-weight: bold;
  color: ${props => props.doom > 70 ? '#ff0000' : props.doom > 40 ? '#ffaa00' : '#00ff00'};
`;

const DateBadge = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
`;

const BackButton = styled(motion.button)`
  padding: 10px 20px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 8px;
  color: #ff0000;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ExportButton = styled(motion.button)`
  padding: 10px 20px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
`;

const ViewRegretsScreen = () => {
  const { username, setScreen } = useGameState();
  const [regrets, setRegrets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegrets = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchJSONWithRetry(
        `${API_ENDPOINTS.GAME.REGRETS}?username=${encodeURIComponent(username)}`,
        {},
        3,
        1000
      );

      if (data.success) {
        setRegrets(data.regrets || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.log('Failed to fetch regrets:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchRegrets();
  }, [fetchRegrets]);

  const handleExportCSV = () => {
    const csvContent = spinsToCSV(regrets, username);
    downloadCSV(csvContent, `${username}-wheel-history.csv`);
  };

  const handleExportJSON = () => {
    const jsonData = spinsToJSON(regrets, username);
    downloadJSON(jsonData, `${username}-wheel-history.json`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {username}'s Regrets
      </Title>

      {loading && (
        <LoadingSpinner 
          size={60} 
          text="Loading your regrets..." 
          textSize={1.2}
        />
      )}
      {loading ? null : stats ? (
        <StatsContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StatCard>
            <StatValue>{stats.total_spins || 0}</StatValue>
            <StatLabel>Total Spins</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.total_doom || 0}</StatValue>
            <StatLabel>Total Doom</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.games_played || 0}</StatValue>
            <StatLabel>Games Played</StatLabel>
          </StatCard>
        </StatsContainer>
      ) : null}

      {loading ? null : regrets.length === 0 ? (
        <EmptyState>
          <h3>No regrets yet</h3>
          <p>Spin the wheel to create your first regret!</p>
        </EmptyState>
      ) : (
        <RegretsList
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {regrets.map((session) => (
            <AnimatePresence key={session.id}>
              {session.spins && session.spins.map((spin) => (
                <RegretItem
                  key={spin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegretQuestion>{spin.question}</RegretQuestion>
                  <RegretResult>The Wheel Said: {spin.result}</RegretResult>
                  {spin.answer && (
                    <RegretAnswer>"{spin.answer}"</RegretAnswer>
                  )}
                  <RegretMeta>
                    <DoomBadge doom={spin.doom}>DOOM: {spin.doom}%</DoomBadge>
                    <DateBadge>{formatDate(spin.created_at)}</DateBadge>
                  </RegretMeta>
                </RegretItem>
              ))}
            </AnimatePresence>
          ))}
        </RegretsList>
      )}

      <BackButton
        onClick={() => setScreen('main')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Menu
      </BackButton>
      
      {regrets && regrets.length > 0 && (
        <ExportButtons>
          <ExportButton
            onClick={handleExportCSV}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📄 Export CSV
          </ExportButton>
          <ExportButton
            onClick={handleExportJSON}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📋 Export JSON
          </ExportButton>
        </ExportButtons>
      )}
    </Container>
  );
};

export default ViewRegretsScreen;
