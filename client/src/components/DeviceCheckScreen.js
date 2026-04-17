import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
  max-width: 700px;
  width: 100%;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff0000;
  text-align: center;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  text-align: center;
  opacity: 0.7;
  margin-bottom: 30px;
`;

const StatusSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatusLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const StatusValue = styled.span`
  color: #ff0000;
  font-weight: bold;
`;

const RecommendationSection = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
`;

const RecommendationTitle = styled.h3`
  color: #ff0000;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RecommendationText = styled.p`
  margin-bottom: 15px;
  line-height: 1.6;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff0000;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled(motion.button)`
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff0000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DeviceCheckScreen = () => {
  const { setScreen } = useGameState();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [checking, setChecking] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deviceChecked, setDeviceChecked] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [grokApiKey, setGrokApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    checkDeviceSpecs();
  }, []);

  const checkDeviceSpecs = async () => {
    setChecking(true);
    setError(null);
    setLoading(false);

    // Check for saved Grok API key
    const savedKey = localStorage.getItem('grokApiKey');
    if (savedKey) {
      setDeviceChecked(true);
      setChecking(false);
      setApiKeySaved(true);
      return;
    }

    setChecking(false);
  };

  const handleContinue = () => {
    if (grokApiKey) {
      localStorage.setItem('grokApiKey', grokApiKey);
      localStorage.setItem('selectedAIModel', 'grok');
      localStorage.setItem('deviceChecked', 'true');
      setScreen('main');
    }
  };

  if (loading) {
    return (
      <Container>
        <Card>
          <Title>Setting Up AI</Title>
          <LoadingSpinner />
          <Subtitle>Initializing...</Subtitle>
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
        <Title>AI Setup</Title>
        <Subtitle>Enter your Grok API key for fast, free AI</Subtitle>

        {apiKeySaved ? (
          <>
            <StatusSection>
              <StatusItem>
                <StatusLabel>API Key Status</StatusLabel>
                <StatusValue>✓ Saved</StatusValue>
              </StatusItem>
            </StatusSection>

            <RecommendationSection>
              <RecommendationTitle>API Key Already Saved</RecommendationTitle>
              <RecommendationText>
                Your Grok API key is already configured. You can update it or continue.
              </RecommendationText>
            </RecommendationSection>

            <Input
              type="password"
              placeholder="Enter new Grok API key"
              value={grokApiKey}
              onChange={(e) => setGrokApiKey(e.target.value)}
            />
          </>
        ) : (
          <>
            <RecommendationSection>
              <RecommendationTitle>Grok API Key Required</RecommendationTitle>
              <RecommendationText>
                Get your free API key from <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff0000' }}>console.x.ai/</a>
                <br />
                Grok provides fast, powerful AI responses. No credit card required.
              </RecommendationText>
            </RecommendationSection>

            <Input
              type="password"
              placeholder="Enter your Grok API key"
              value={grokApiKey}
              onChange={(e) => setGrokApiKey(e.target.value)}
            />
          </>
        )}

        <ButtonContainer>
          <Button
            className="primary"
            onClick={handleContinue}
            disabled={!grokApiKey}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </Button>
        </ButtonContainer>
      </Card>
    </Container>
  );
};

export default DeviceCheckScreen;
