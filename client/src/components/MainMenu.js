import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import ThemeSettings from './ThemeSettings';
import SoundManager from '../utils/SoundManager';
import { getDailyChallenge } from '../shared/dailyChallenges';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 50px;
  opacity: 0.8;
  font-style: italic;
  max-width: 600px;
`;

const MenuCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const MenuButton = styled(motion.button)`
  width: 100%;
  padding: 20px;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SecondaryButton = styled(MenuButton)`
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  color: #ff0000;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const StatsSection = styled(motion.div)`
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(255, 0, 0, 0.2);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const StatValue = styled.span`
  color: #ff0000;
  font-weight: bold;
`;

const SoundToggle = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid rgba(255, 0, 0, 0.3);
  color: #ff0000;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff0000;
    transform: scale(1.1);
  }
`;

const MusicToggle = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 80px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid rgba(255, 0, 0, 0.3);
  color: #ff0000;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff0000;
    transform: scale(1.1);
  }
`;

const SettingsButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid rgba(255, 0, 0, 0.3);
  color: #ff0000;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff0000;
    transform: scale(1.1);
  }
`;

const DailyChallengeCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
  border: 2px solid rgba(255, 0, 0, 0.5);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: 500px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const ChallengeTitle = styled(motion.h3)`
  color: #ff0000;
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ChallengeQuestion = styled(motion.p)`
  color: white;
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  font-style: italic;
`;

const ChallengeMeta = styled(motion.p)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
`;

const MainMenu = ({ onOpenSettings }) => {
  const { setScreen, stats, soundEnabled, toggleSound } = useGameState();
  const [musicPlaying, setMusicPlaying] = React.useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => {
    setDailyChallenge(getDailyChallenge());
  }, []);

  const handleStartGame = () => {
    SoundManager.play('click');
    setScreen('mode-selection');
  };

  const handleViewRegrets = () => {
    SoundManager.play('click');
    setScreen('view-regrets');
  };

  const handleDailyChallenge = () => {
    SoundManager.play('click');
    if (dailyChallenge) {
      setScreen('wheel');
      // Pass the challenge question to the wheel component
      setTimeout(() => {
        // The wheel component will need to receive this
        // For now, just navigate to wheel
      }, 100);
    }
  };

  const handleCredits = () => {
    SoundManager.play('click');
    setScreen('credits');
  };

  const handleSettings = () => {
    SoundManager.play('click');
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  const handleSoundToggle = () => {
    SoundManager.play('click');
    toggleSound();
  };

  const handleMusicToggle = () => {
    SoundManager.play('click');
    const isPlaying = SoundManager.toggleMusic();
    setMusicPlaying(isPlaying);
  };

  return (
    <MenuContainer>
      <AnimatePresence>
        {showThemeSettings && (
          <ThemeSettings onClose={() => setShowThemeSettings(false)} />
        )}
      </AnimatePresence>

      {dailyChallenge && (
        <DailyChallengeCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ChallengeTitle>🌟 Daily Challenge</ChallengeTitle>
          <ChallengeQuestion>{dailyChallenge.question}</ChallengeQuestion>
          <ChallengeMeta>
            Category: {dailyChallenge.category} • Difficulty: {dailyChallenge.difficulty}
          </ChallengeMeta>
          <MenuButton
            onClick={handleDailyChallenge}
            onHoverStart={() => SoundManager.play('hover')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ padding: '10px 30px', fontSize: '0.9rem' }}
          >
            🎰 Spin This Question
          </MenuButton>
        </DailyChallengeCard>
      )}

      <MusicToggle
        onClick={handleMusicToggle}
        onHoverStart={() => SoundManager.play('hover')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {musicPlaying ? '🎵' : '🔇'}
      </MusicToggle>

      <SoundToggle
        onClick={handleSoundToggle}
        onHoverStart={() => SoundManager.play('hover')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </SoundToggle>

      <SettingsButton
        onClick={handleSettings}
        onHoverStart={() => SoundManager.play('hover')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ⚙️
      </SettingsButton>

      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌪️ Waya's Wheel of Regret 🌪️
      </Title>

      <Subtitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Ask your question and let fate decide your destiny...
      </Subtitle>

      <MenuCard
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <MenuButton
          onClick={handleStartGame}
          onHoverStart={() => SoundManager.play('hover')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎮 Start Your Journey 🎮
        </MenuButton>

        <SecondaryButton
          onClick={handleViewRegrets}
          onHoverStart={() => SoundManager.play('hover')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ð View Your Regrets ð
        </SecondaryButton>

        <SecondaryButton
          onClick={handleCredits}
          onHoverStart={() => SoundManager.play('hover')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ð Credits ð
        </SecondaryButton>

        <StatsSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <StatRow>
            <StatLabel>Total Spins:</StatLabel>
            <StatValue>{stats.totalSpins}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Average Doom:</StatLabel>
            <StatValue>{stats.totalSpins > 0 ? Math.round(stats.totalDoom / stats.totalSpins) : 0}%</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Regret Level:</StatLabel>
            <StatValue>
              {stats.totalSpins > 0 
                ? Math.round(stats.totalDoom / stats.totalSpins) < 30 
                  ? 'ð' 
                  : Math.round(stats.totalDoom / stats.totalSpins) < 60 
                    ? 'ð' 
                    : Math.round(stats.totalDoom / stats.totalSpins) < 80 
                      ? 'ð°' 
                      : 'ð'
                : 'ð'
              }
            </StatValue>
          </StatRow>
        </StatsSection>
      </MenuCard>
    </MenuContainer>
  );
};

export default MainMenu;
