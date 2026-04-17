import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.95), rgba(0, 0, 0, 0.95));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Input = styled.input`
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.2rem;
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

const Button = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  
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
  
  &:disabled {
    background: linear-gradient(45deg, #666, #444);
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 0, 0, 0.3);
  border-top: 4px solid #ff0000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 30px auto;
`;

const PersonalityTraits = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

const PersonalityTrait = styled.div`
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PersonalitySetupScreen = () => {
  const { setScreen, setUsername } = useGameState();
  const [username, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [personalityGenerated, setPersonalityGenerated] = useState(false);
  const [personalityTraits, setPersonalityTraits] = useState([]);

  const handleContinue = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setUsername(username);
    localStorage.setItem('username', username);

    // Simulate AI personality generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate personality traits based on username
    const traits = [
      `Analyzing "${username}" personality...`,
      `Generating AI persona for "${username}"...`,
      `Calibrating wheel responses to match "${username}" style...`,
      `Setting up personality-driven AI responses...`,
      `✓ Personality ready for "${username}"`
    ];

    for (let i = 0; i < traits.length; i++) {
      setPersonalityTraits(traits.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setPersonalityGenerated(true);
    setLoading(false);
  };

  const handleStartGame = () => {
    setScreen('mode-selection');
  };

  if (loading) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Setting Up AI</Title>
          <LoadingSpinner />
          <Subtitle>Configuring wheel AI and AI personality loading...</Subtitle>
          <PersonalityTraits>
            {personalityTraits.map((trait, index) => (
              <PersonalityTrait key={index}>{trait}</PersonalityTrait>
            ))}
          </PersonalityTraits>
        </Card>
      </Container>
    );
  }

  if (personalityGenerated) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Title>AI Ready</Title>
          <Subtitle>
            Personality configured for "{username}"
            <br />
            Your wheel responses will now match your style!
          </Subtitle>
          <Button
            onClick={handleStartGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎮 Start Your Journey 🎮
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Identity Setup</Title>
        <Subtitle>
          Enter your username to personalize the AI wheel responses.
          The AI will adapt its personality to match your style!
        </Subtitle>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter your username (e.g., Markiplier, RickSanchez)"
          maxLength={30}
        />
        <Button
          onClick={handleContinue}
          disabled={!username.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ⚡ Generate AI Personality ⚡
        </Button>
      </Card>
    </Container>
  );
};

export default PersonalitySetupScreen;
