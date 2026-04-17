import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const IntroContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 1000;
`;

const IntroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: bold;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 20px;
`;

const YouTubeLogo = styled(motion.img)`
  width: 120px;
  height: auto;
`;

const WheelLoader = styled.div`
  width: 120px;
  height: 120px;
  border: 8px solid rgba(255, 0, 0, 0.2);
  border-top: 8px solid #ff0000;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
  margin-bottom: 30px;
  position: relative;
  
  & img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 8px;
  }
`;

const LoadingText = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  opacity: 0.7;
  text-align: center;
  max-width: 300px;
  margin-bottom: 30px;
`;

const ProgressBarContainer = styled.div`
  width: 300px;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ff4444);
  border-radius: 4px;
`;

const ProgressText = styled(motion.p)`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
`;

const BrandingContainer = styled(motion.div)`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const BrandingText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
`;

const BrandingLogos = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BrandingLogo = styled.img`
  height: 40px;
  width: auto;
`;

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [showIntro, setShowIntro] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Show intro first
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setShowLoading(true);
    }, 5000);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (!showLoading) return;

    const loadingSteps = [
      { progress: 10, text: 'Initializing cosmic forces...' },
      { progress: 25, text: 'Calibrating wheel segments...' },
      { progress: 40, text: 'Loading AI models...' },
      { progress: 55, text: 'Preparing regret algorithms...' },
      { progress: 70, text: 'Summoning the wheel...' },
      { progress: 85, text: 'Finalizing your destiny...' },
      { progress: 95, text: 'Almost ready...' },
      { progress: 100, text: 'Complete!' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [showLoading, onComplete]);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroContainer
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IntroTitle
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              WayaCreate
            </IntroTitle>
            <YouTubeLogo
              src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
              alt="YouTube"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </IntroContainer>
        )}
      </AnimatePresence>
      
      {showLoading && (
        <LoadingContainer>
          <WheelLoader>
            <img src="/logo192.png" alt="App Icon" />
          </WheelLoader>
          <LoadingText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Waya's Wheel of Regret
          </LoadingText>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loadingText}
          </Subtitle>
          <ProgressBarContainer>
            <ProgressBar
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </ProgressBarContainer>
          <ProgressText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {progress}%
          </ProgressText>
          <BrandingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <BrandingText>Made by</BrandingText>
            <BrandingLogos>
              <BrandingText>WayaCreate</BrandingText>
              <BrandingText>&</BrandingText>
              <BrandingLogo src="/tcof-logo.jpg" alt="TCOF Studios" />
            </BrandingLogos>
          </BrandingContainer>
        </LoadingContainer>
      )}
    </>
  );
};

export default LoadingScreen;
