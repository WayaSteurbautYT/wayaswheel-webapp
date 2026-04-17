import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const scrollUp = keyframes`
  from { transform: translateY(100vh); }
  to { transform: translateY(-100%); }
`;

const CreditsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #000000 0%, #1a1a1f 50%, #000000 100%);
  overflow: hidden;
  z-index: 1000;
`;

const CreditsContent = styled(motion.div)`
  position: absolute;
  width: 100%;
  padding: 50px 20px;
  animation: ${scrollUp} 60s linear forwards;
`;

const CreditsSection = styled.div`
  margin-bottom: 60px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: #ff0000;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 6px;
  text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
`;

const PlayerInfo = styled.div`
  margin-bottom: 40px;
`;

const PlayerName = styled.p`
  font-size: 2rem;
  color: #ff0000;
  margin-bottom: 10px;
`;

const GameMode = styled.p`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto 40px;
`;

const StatCard = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

const StatValue = styled.p`
  font-size: 3rem;
  font-weight: bold;
  color: #ff0000;
  margin-bottom: 5px;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  opacity: 0.7;
  text-transform: uppercase;
`;

const SpinList = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SpinItem = styled(motion.div)`
  background: rgba(26, 26, 31, 0.8);
  border-left: 4px solid ${props => props.doom > 70 ? '#ff0000' : props.doom < 30 ? '#00ff00' : '#ffff00'};
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  text-align: left;
`;

const SpinQuestion = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SpinResult = styled.p`
  font-size: 1.5rem;
  color: #ff0000;
  margin-bottom: 5px;
`;

const SpinDoom = styled.p`
  font-size: 1rem;
  opacity: 0.7;
`;

const SpinAnswer = styled.p`
  font-size: 1rem;
  font-style: italic;
  opacity: 0.8;
  margin-top: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
`;

const AIReview = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: rgba(255, 0, 0, 0.05);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
`;

const ReviewTitle = styled.h3`
  font-size: 2rem;
  color: #ff0000;
  margin-bottom: 20px;
  text-align: center;
`;

const ReviewText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 20px;
  text-align: center;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Star = styled.span`
  font-size: 2rem;
  color: ${props => props.filled ? '#ff0000' : 'rgba(255, 255, 255, 0.3)'};
`;

const ThemedEnding = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: rgba(26, 26, 31, 0.9);
  border: 3px solid ${props => props.themeColor || '#ff0000'};
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.themeColor ? `radial-gradient(circle at center, ${props.themeColor}33 0%, transparent 70%)` : 'none'};
    pointer-events: none;
  }
`;

const EndingTitle = styled.h3`
  font-size: 2.5rem;
  color: ${props => props.themeColor || '#ff0000'};
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  z-index: 1;
`;

const EndingDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.8;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const EndingIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const CreditsFooter = styled.div`
  margin-top: 60px;
  text-align: center;
  opacity: 0.6;
`;

const CreditsText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const CloseButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid rgba(255, 0, 0, 0.5);
  color: #ffffff;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 0, 0, 0.4);
    transform: scale(1.05);
  }
`;

const EndCredits = ({ onClose, gameData, aiReview, themedEnding }) => {
  const { finalScore, spins, username, gameMode } = useGameState();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<Star key={i} filled={i < rating}>★</Star>);
    }
    return stars;
  };

  const getThemedEnding = () => {
    if (themedEnding) return themedEnding;
    
    // Default themed ending based on final doom
    const avgDoom = spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length;
    
    if (avgDoom >= 80) {
      return {
        title: 'DOOM MASTER',
        description: 'The wheel has judged you worthy of eternal regret. Your choices have led you down a path of chaos and destruction. The void welcomes its new champion.',
        icon: '💀',
        themeColor: '#ff0000'
      };
    } else if (avgDoom >= 60) {
      return {
        title: 'REGRET COLLECTOR',
        description: 'You have accumulated significant regret through your journey. The wheel remembers every choice, every question, every moment of hesitation.',
        icon: '😈',
        themeColor: '#ff6600'
      };
    } else if (avgDoom >= 40) {
      return {
        title: 'BALANCED FATE',
        description: 'The wheel finds you neither blessed nor cursed. You walk the line between light and darkness, making choices that shape your destiny.',
        icon: '⚖️',
        themeColor: '#ffff00'
      };
    } else {
      return {
        title: 'COSMIC FAVOR',
        description: 'The stars align in your favor. Your journey has been guided by fortune, and the wheel smiles upon your choices.',
        icon: '✨',
        themeColor: '#00ff00'
      };
    }
  };

  const ending = getThemedEnding();

  return (
    <CreditsContainer>
      <CloseButton
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ✕ Close
      </CloseButton>

      <CreditsContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <CreditsSection>
          <GameTitle>Waya's Wheel of Regret</GameTitle>
          <PlayerInfo>
            <PlayerName>{username || 'Anonymous'}</PlayerName>
            <GameMode>{gameMode} Mode</GameMode>
          </PlayerInfo>

          {finalScore && (
            <StatsGrid>
              <StatCard>
                <StatValue>{finalScore.stars || 0}</StatValue>
                <StatLabel>Stars</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{finalScore.regretLevel || 0}%</StatValue>
                <StatLabel>Regret</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{finalScore.creativityPoints || 0}</StatValue>
                <StatLabel>Creativity</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{finalScore.totalPoints || 0}</StatValue>
                <StatLabel>Total Points</StatLabel>
              </StatCard>
            </StatsGrid>
          )}
        </CreditsSection>

        {spins && spins.length > 0 && (
          <CreditsSection>
            <SectionTitle>Your Journey</SectionTitle>
            <SpinList>
              {spins.map((spin, index) => (
                <SpinItem
                  key={index}
                  doom={spin.doom}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <SpinQuestion>#{index + 1}: {spin.question}</SpinQuestion>
                  <SpinResult>{spin.result}</SpinResult>
                  <SpinDoom>Doom: {spin.doom}%</SpinDoom>
                  {spin.answer && <SpinAnswer>"{spin.answer}"</SpinAnswer>}
                </SpinItem>
              ))}
            </SpinList>
          </CreditsSection>
        )}

        {aiReview && (
          <CreditsSection>
            <SectionTitle>AI Review</SectionTitle>
            <AIReview>
              <ReviewTitle>The Wheel's Verdict</ReviewTitle>
              <StarRating>
                {renderStars(aiReview.rating || Math.floor(Math.random() * 5) + 1)}
              </StarRating>
              <ReviewText>{aiReview.text || "Your journey through the wheel has been... interesting. The cosmos has taken note of your choices."}</ReviewText>
            </AIReview>
          </CreditsSection>
        )}

        <CreditsSection>
          <SectionTitle>Your Fate</SectionTitle>
          <ThemedEnding themeColor={ending.themeColor}>
            <EndingIcon>{ending.icon}</EndingIcon>
            <EndingTitle>{ending.title}</EndingTitle>
            <EndingDescription>{ending.description}</EndingDescription>
          </ThemedEnding>
        </CreditsSection>

        <CreditsFooter>
          <CreditsText>Created by Waya</CreditsText>
          <CreditsText>Version 2.0 - AI-Powered Multiplayer Edition</CreditsText>
          <CreditsText>Ask your question and let fate decide...</CreditsText>
        </CreditsFooter>
      </CreditsContent>
    </CreditsContainer>
  );
};

export default EndCredits;
