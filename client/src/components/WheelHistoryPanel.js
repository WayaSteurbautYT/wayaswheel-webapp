import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const PanelContainer = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: linear-gradient(180deg, rgba(26, 26, 31, 0.98), rgba(0, 0, 0, 0.98));
  border-left: 2px solid rgba(255, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 2px solid rgba(255, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h3`
  font-size: 1.5rem;
  color: #ff0000;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: #ff0000;
    transform: scale(1.1);
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 0, 0, 0.3);
    border-radius: 3px;
  }
`;

const Message = styled(motion.div)`
  padding: 15px;
  border-radius: 15px;
  max-width: 90%;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const UserMessage = styled(Message)`
  align-self: flex-end;
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.1));
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

const AIMessage = styled(Message)`
  align-self: flex-start;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SystemMessage = styled(Message)`
  align-self: center;
  background: rgba(255, 0, 0, 0.05);
  border: 1px dashed rgba(255, 0, 0, 0.3);
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const MessageContent = styled.div`
  color: #ffffff;
  line-height: 1.5;
`;

const MessageMeta = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DoomBadge = styled.span`
  background: ${props => props.doom > 70 ? '#ff0000' : props.doom < 30 ? '#4CAF50' : '#FF9800'};
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const CompileSection = styled.div`
  padding: 20px;
  border-top: 2px solid rgba(255, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.3);
`;

const CompileTitle = styled.h4`
  color: #ff0000;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CompiledChoices = styled.div`
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ChoiceItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ChoiceQuestion = styled.p`
  margin: 0 0 5px 0;
  font-weight: bold;
  color: #ffffff;
  font-size: 0.9rem;
`;

const ChoiceResult = styled.p`
  margin: 0;
  color: #ff0000;
  font-size: 0.85rem;
`;

const PublishButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff0000, #cc0000);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:disabled {
    background: rgba(100, 100, 100, 0.3);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }
`;

const StatsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

const StatBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff0000;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  text-transform: uppercase;
`;

const WheelHistoryPanel = ({ onClose }) => {
  const { spins, username, stats } = useGameState();
  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (spins.length === 0 || published) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch('http://localhost:5000/api/community/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          spins,
          stats
        })
      });

      if (response.ok) {
        setPublished(true);
      }
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const avgDoom = spins.length > 0 
    ? spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length 
    : 0;

  return (
    <PanelContainer
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <PanelHeader>
        <PanelTitle>🎰 Wheel History</PanelTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </PanelHeader>

      <ChatContainer>
        {spins.length === 0 ? (
          <SystemMessage>
            No spins yet. Start spinning the wheel to build your history!
          </SystemMessage>
        ) : (
          <>
            <SystemMessage>
              Session started with {spins.length} question{spins.length !== 1 ? 's' : ''}
            </SystemMessage>

            {spins.map((spin, index) => (
              <React.Fragment key={index}>
                <UserMessage
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MessageContent>
                    <strong>You:</strong> {spin.question}
                  </MessageContent>
                  <MessageMeta>
                    <span>#{index + 1}</span>
                  </MessageMeta>
                </UserMessage>

                <AIMessage
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                >
                  <MessageContent>
                    <strong>🎡 The Wheel:</strong> {spin.result}
                    <br />
                    <em>"{spin.answer}"</em>
                  </MessageContent>
                  <MessageMeta>
                    <DoomBadge doom={spin.doom}>{spin.doom}% DOOM</DoomBadge>
                  </MessageMeta>
                </AIMessage>
              </React.Fragment>
            ))}

            <SystemMessage>
              Session complete! Average doom: {avgDoom.toFixed(1)}%
            </SystemMessage>
          </>
        )}
      </ChatContainer>

      {spins.length > 0 && (
        <CompileSection>
          <CompileTitle>📊 Compiled Choices</CompileTitle>
          
          <StatsSummary>
            <StatBox>
              <StatValue>{spins.length}</StatValue>
              <StatLabel>Spins</StatLabel>
            </StatBox>
            <StatBox>
              <StatValue>{avgDoom.toFixed(0)}%</StatValue>
              <StatLabel>Avg Doom</StatLabel>
            </StatBox>
          </StatsSummary>

          <CompiledChoices>
            {spins.map((spin, index) => (
              <ChoiceItem key={index}>
                <ChoiceQuestion>{index + 1}. {spin.question}</ChoiceQuestion>
                <ChoiceResult>→ {spin.result} ({spin.doom}% doom)</ChoiceResult>
              </ChoiceItem>
            ))}
          </CompiledChoices>

          <PublishButton
            onClick={handlePublish}
            disabled={published || isPublishing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPublishing ? 'Publishing...' : published ? '✓ Published!' : '🌐 Publish to Community'}
          </PublishButton>
        </CompileSection>
      )}
    </PanelContainer>
  );
};

export default WheelHistoryPanel;
