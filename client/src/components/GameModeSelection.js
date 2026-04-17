import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_MODES, GAME_MODE_DATA } from '../shared/gameData';
import SoundManager from '../utils/SoundManager';

const ModeSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const Title = styled(motion.h2)`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 40px;
  opacity: 0.8;
  max-width: 600px;
`;

const UsernameInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.7);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const IdentityLabel = styled(motion.p)`
  font-size: 1.2rem;
  color: #ff0000;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ModesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 30px;
`;

const ModeCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #ff0000;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
  }
  
  ${props => props.selected && `
    border-color: #ff0000;
    background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 0, 0, 0.9));
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  `}
`;

const ModeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const ModeName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ModeDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 15px;
  opacity: 0.8;
`;

const ModeDetails = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const StartButton = styled(motion.button)`
  padding: 20px 40px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:disabled {
    background: linear-gradient(45deg, #666, #444);
    cursor: not-allowed;
    transform: none;
  }
  
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
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
  }
`;

const BackButton = styled(motion.button)`
  padding: 15px 30px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  font-size: 1.1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: 15px;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const GameModeSelection = () => {
  const { username, setUsername, setScreen, setGameMode, startSession, isAuthenticated, user } = useGameState();
  const [selectedMode, setSelectedMode] = useState(GAME_MODES.CLASSIC);

  // Set username from user metadata if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    }
  }, [isAuthenticated, user, setUsername]);

  const handleModeSelect = (mode) => {
    SoundManager.play('click');
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (!username.trim()) return;

    SoundManager.play('transition');
    setGameMode(selectedMode);
    setUsername(username.trim());
    startSession(username.trim(), selectedMode);
    setScreen('wheel');
  };

  const handleBack = () => {
    SoundManager.play('click');
    setScreen('menu');
  };

  const getModeIcon = (mode) => {
    const icons = {
      [GAME_MODES.CLASSIC]: 'ð',
      [GAME_MODES.CHAOS]: 'ð',
      [GAME_MODES.FATE]: 'ð',
      [GAME_MODES.RAPID]: 'â¡'
    };
    return icons[mode] || 'ð';
  };

  return (
    <ModeSelectionContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Choose Your Destiny
      </Title>

      <Subtitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {isAuthenticated ? `Welcome back, ${username}!` : 'Select your game mode and choose your identity'}
      </Subtitle>

      {!isAuthenticated && (
        <>
          <IdentityLabel
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Choose Your Identity
          </IdentityLabel>

          <UsernameInput
            type="text"
            placeholder="e.g., Markiplier, RickSanchez, YourName..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </>
      )}

      <ModesGrid
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {Object.values(GAME_MODES).map((mode) => {
          const modeData = GAME_MODE_DATA[mode];
          return (
            <ModeCard
              key={mode}
              selected={selectedMode === mode}
              onClick={() => handleModeSelect(mode)}
              onHoverStart={() => SoundManager.play('hover')}
              whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(255, 0, 0, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <ModeIcon>{getModeIcon(mode)}</ModeIcon>
              <ModeName>{modeData.name}</ModeName>
              <ModeDescription>{modeData.description}</ModeDescription>
              <ModeDetails>Max Spins: {modeData.maxSpins}</ModeDetails>
            </ModeCard>
          );
        })}
      </ModesGrid>

      <ButtonContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <BackButton
          onClick={handleBack}
          onHoverStart={() => SoundManager.play('hover')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          â Back
        </BackButton>
        
        <StartButton
          onClick={handleStartGame}
          disabled={!username.trim()}
          onHoverStart={() => SoundManager.play('hover')}
          whileHover={{ scale: !username.trim() ? 1 : 1.02 }}
          whileTap={{ scale: !username.trim() ? 1 : 0.98 }}
        >
          {username.trim() ? `ð Start ${GAME_MODE_DATA[selectedMode].name} ð` : 'Enter Name First'}
        </StartButton>
      </ButtonContainer>
    </ModeSelectionContainer>
  );
};

export default GameModeSelection;
