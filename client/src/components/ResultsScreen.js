import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import SoundManager from '../utils/SoundManager';
import { MEME_GIFS } from '../shared/gameData';
import { spinsToCSV, downloadCSV, spinsToJSON, downloadJSON } from '../utils/exportHelper';
import { shareToTwitter, shareToFacebook, shareToReddit, copyToClipboard, generateShareText, generateShareUrl } from '../utils/shareHelper';

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const ResultsCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.95), rgba(0, 0, 0, 0.95));
  border: 2px solid rgba(255, 0, 0, 0.5);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ScoreSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Stars = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const ScoreItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ScoreValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ff0000;
`;

const SpinsHistory = styled.div`
  margin-bottom: 30px;
`;

const HistoryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SpinItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SpinQuestion = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffffff;
`;

const SpinResult = styled.div`
  color: #ff0000;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SpinAnswer = styled.div`
  font-style: italic;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const SpinDoom = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MemeGif = styled(motion.img)`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 15px;
  margin: 20px auto;
  display: block;
  box-shadow: 0 8px 32px rgba(255, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ExportContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ExportButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ShareContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ShareButton = styled(motion.button)`
  padding: 12px 20px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid ${props => props.color || '#ff0000'};
  border-radius: 10px;
  color: ${props => props.color || '#ff0000'};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, ${props => props.color || '#ff0000'}, ${props => props.color || '#cc0000'});
    color: white;
    border-color: white;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ActionButton = styled(motion.button)`
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
    }
  }
  
  &.secondary {
    background: linear-gradient(45deg, #1a1a1f, #000000);
    border: 2px solid #ff0000;
    color: #ff0000;
    
    &:hover {
      background: linear-gradient(45deg, #ff0000, #cc0000);
      color: white;
      border-color: white;
    }
  }
`;

const ResultsScreen = () => {
  const { currentSession, resetGame, setScreen, username } = useGameState();

  React.useEffect(() => {
    // Play appropriate sound based on regret level
    if (currentSession.finalScore) {
      const { regretLevel } = currentSession.finalScore;
      if (regretLevel < 30) {
        SoundManager.play('win');
      } else if (regretLevel > 70) {
        SoundManager.play('doom');
      } else {
        SoundManager.play('stop');
      }
    }
  }, [currentSession.finalScore]);

  const handlePlayAgain = () => {
    SoundManager.play('click');
    resetGame();
    setScreen('mode-selection');
  };

  const handleBackToMenu = () => {
    SoundManager.play('click');
    resetGame();
    setScreen('menu');
  };

  const handleExportCSV = () => {
    const csvContent = spinsToCSV(currentSession.spins, username);
    downloadCSV(csvContent, `${username}-session-results.csv`);
  };

  const handleExportJSON = () => {
    const jsonData = spinsToJSON(currentSession.spins, username);
    downloadJSON(jsonData, `${username}-session-results.json`);
  };

  const handleShareTwitter = () => {
    const shareText = generateShareText(currentSession, username);
    const shareUrl = generateShareUrl();
    shareToTwitter(shareText, shareUrl);
  };

  const handleShareFacebook = () => {
    const shareUrl = generateShareUrl();
    shareToFacebook(shareUrl);
  };

  const handleShareReddit = () => {
    const shareText = generateShareText(currentSession, username);
    const shareUrl = generateShareUrl();
    shareToReddit(shareText, shareUrl);
  };

  const handleCopyLink = async () => {
    const shareText = generateShareText(currentSession, username);
    const success = await copyToClipboard(shareText);
    if (success) {
      alert('Copied to clipboard!');
    }
  };

  const getMemeGif = (regretLevel) => {
    if (regretLevel < 30) {
      return MEME_GIFS.lowDoom[Math.floor(Math.random() * MEME_GIFS.lowDoom.length)];
    } else if (regretLevel < 60) {
      return MEME_GIFS.mediumDoom[Math.floor(Math.random() * MEME_GIFS.mediumDoom.length)];
    } else {
      return MEME_GIFS.highDoom[Math.floor(Math.random() * MEME_GIFS.highDoom.length)];
    }
  };

  const getStars = (count) => {
    return 'â'.repeat(Math.max(0, Math.min(5, count))) + 'â'.repeat(Math.max(0, 5 - count));
  };

  const getRegretEmoji = (level) => {
    if (level < 30) return 'ð';
    if (level < 60) return 'ð';
    if (level < 80) return 'ð°';
    return 'ð';
  };

  if (!currentSession.finalScore) {
    return null;
  }

  const { stars, regretLevel, creativityPoints, stupidityPoints, totalPoints } = currentSession.finalScore;

  return (
    <ResultsContainer>
      <ResultsCard
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Your Fate is Sealed</Title>

        <ScoreSection>
          <Stars>{getStars(stars)}</Stars>
          <MemeGif
            src={getMemeGif(regretLevel)}
            alt="Meme"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <ScoreGrid>
            <ScoreItem>
              <ScoreLabel>Total Points</ScoreLabel>
              <ScoreValue>{totalPoints}</ScoreValue>
            </ScoreItem>
            <ScoreItem>
              <ScoreLabel>Regret Level</ScoreLabel>
              <ScoreValue>{regretLevel}% {getRegretEmoji(regretLevel)}</ScoreValue>
            </ScoreItem>
            <ScoreItem>
              <ScoreLabel>Creativity</ScoreLabel>
              <ScoreValue>{creativityPoints}</ScoreValue>
            </ScoreItem>
            <ScoreItem>
              <ScoreLabel>Stupidity</ScoreLabel>
              <ScoreValue>{stupidityPoints}</ScoreValue>
            </ScoreItem>
          </ScoreGrid>
        </ScoreSection>

        <SpinsHistory>
          <HistoryTitle>Your Journey</HistoryTitle>
          {currentSession.spins.map((spin, index) => (
            <SpinItem key={spin.id}>
              <SpinQuestion>Q{index + 1}: {spin.question}</SpinQuestion>
              <SpinResult>{spin.result}</SpinResult>
              <SpinAnswer>"{spin.answer}"</SpinAnswer>
              <SpinDoom>Doom: {spin.doom}%</SpinDoom>
            </SpinItem>
          ))}
        </SpinsHistory>

        <ButtonContainer>
          <ActionButton
            className="secondary"
            onClick={handleBackToMenu}
            onHoverStart={() => SoundManager.play('hover')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            â Back to Menu
          </ActionButton>
          <ActionButton
            className="primary"
            onClick={handlePlayAgain}
            onHoverStart={() => SoundManager.play('hover')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ð Play Again ð
          </ActionButton>
        </ButtonContainer>

        <ExportContainer>
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
        </ExportContainer>

        <ShareContainer>
          <ShareButton
            onClick={handleShareTwitter}
            color="#1DA1F2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🐦 Twitter
          </ShareButton>
          <ShareButton
            onClick={handleShareFacebook}
            color="#4267B2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📘 Facebook
          </ShareButton>
          <ShareButton
            onClick={handleShareReddit}
            color="#FF4500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🦊 Reddit
          </ShareButton>
          <ShareButton
            onClick={handleCopyLink}
            color="#00ff00"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📋 Copy
          </ShareButton>
        </ShareContainer>
      </ResultsCard>
    </ResultsContainer>
  );
};

export default ResultsScreen;
