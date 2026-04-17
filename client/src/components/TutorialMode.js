import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const TutorialCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.98), rgba(0, 0, 0, 0.98));
  border: 2px solid #ff0000;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff0000;
    transform: rotate(90deg);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ff0000;
  text-align: center;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Step = styled(motion.div)`
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  border-left: 4px solid #ff0000;
`;

const StepNumber = styled.div`
  font-size: 1.5rem;
  color: #ff0000;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 10px;
`;

const StepDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NavButton = styled(motion.button)`
  padding: 12px 30px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Dot = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? '#ff0000' : 'rgba(255, 255, 255, 0.3)'};
`;

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Waya's Wheel of Regret!",
    description: "This is an AI-powered fortune wheel that helps you make decisions and predict the regret level of your choices. Let's learn how to use it!"
  },
  {
    title: "Choose a Game Mode",
    description: "Select from Classic (5 spins), Chaos (10 wild spins), Fate (3 deep spins), or Rapid (15 quick spins). Each mode offers a different experience."
  },
  {
    title: "Ask Your Question",
    description: "Type any question that troubles your soul. The AI will generate custom wheel options based on your question."
  },
  {
    title: "Generate AI Options",
    description: "Click 'Generate AI Options' to let the AI create 8 unique wheel segments tailored to your question."
  },
  {
    title: "Spin the Wheel",
    description: "Click 'Spin the Wheel' and watch it rotate. The wheel will land on one of the AI-generated options with a doom level percentage."
  },
  {
    title: "View Your Result",
    description: "See the wheel's answer, doom level, and AI analysis. High doom means more regret, low doom means good fortune!"
  },
  {
    title: "Complete the Session",
    description: "After completing all spins in your chosen mode, you'll see your final regret score and a meme GIF based on your fate."
  },
  {
    title: "Customize Your Experience",
    description: "Access Settings to change wheel themes, sound packs, spin animations, and toggle dark/light mode."
  },
  {
    title: "Track Your Progress",
    description: "View your spin history, export results, unlock achievements, and check the global leaderboard."
  },
  {
    title: "Share Your Fate",
    description: "Share your results to Twitter, Facebook, or Reddit with meme GIFs. Let others know what the wheel has in store for you!"
  }
];

const TutorialMode = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Check if user has seen tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenTutorial', 'true');
      setShowTutorial(false);
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
    if (onClose) onClose();
  };

  if (!showTutorial) return null;

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <TutorialCard
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <CloseButton onClick={handleSkip}>×</CloseButton>
        
        <Title>🎰 Tutorial</Title>

        <AnimatePresence mode="wait">
          <Step
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StepNumber>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</StepNumber>
            <StepTitle>{TUTORIAL_STEPS[currentStep].title}</StepTitle>
            <StepDescription>{TUTORIAL_STEPS[currentStep].description}</StepDescription>
          </Step>
        </AnimatePresence>

        <ProgressDots>
          {TUTORIAL_STEPS.map((_, index) => (
            <Dot key={index} active={index === currentStep} />
          ))}
        </ProgressDots>

        <NavigationButtons>
          <NavButton
            onClick={handlePrevious}
            disabled={currentStep === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Previous
          </NavButton>
          <NavButton
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Start Playing →' : 'Next →'}
          </NavButton>
        </NavigationButtons>
      </TutorialCard>
    </Overlay>
  );
};

export default TutorialMode;
