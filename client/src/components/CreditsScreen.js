import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const CreditsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const CreditsCard = styled(motion.div)`
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

const CreditsSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CreditsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CreditItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 0, 0, 0.2);
`;

const Role = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const Name = styled.span`
  color: #ffffff;
  font-weight: bold;
`;

const SpecialThanks = styled.div`
  text-align: center;
  margin-bottom: 30px;
  font-style: italic;
  opacity: 0.8;
`;

const BackButton = styled(motion.button)`
  padding: 15px 30px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 30px;
  opacity: 0.6;
  font-size: 0.9rem;
`;

const CreditsScreen = () => {
  const { setScreen } = useGameState();

  const handleBack = () => {
    setScreen('menu');
  };

  return (
    <CreditsContainer>
      <CreditsCard
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Credits</Title>

        <CreditsSection>
          <SectionTitle>Created By</SectionTitle>
          <CreditsList>
            <CreditItem>
              <Role>Developer</Role>
              <Name>Waya</Name>
            </CreditItem>
            <CreditItem>
              <Role>Vibe Coding Master</Role>
              <Name>WayaCreate</Name>
            </CreditItem>
          </CreditsList>
        </CreditsSection>

        <CreditsSection>
          <SectionTitle>Inspiration</SectionTitle>
          <CreditsList>
            <CreditItem>
              <Role>Chaos Energy</Role>
              <Name>PewDiePie</Name>
            </CreditItem>
            <CreditItem>
              <Role>Philanthropic Madness</Role>
              <Name>MrBeast</Name>
            </CreditItem>
            <CreditItem>
              <Role>Dramatic Screaming</Role>
              <Name>Markiplier</Name>
            </CreditItem>
            <CreditItem>
              <Role>Irish Luck</Role>
              <Name>Jacksepticeye</Name>
            </CreditItem>
            <CreditItem>
              <Role>Speedrun Destiny</Role>
              <Name>Dream</Name>
            </CreditItem>
            <CreditItem>
              <Role>Chaotic Child Energy</Role>
              <Name>TommyInnit</Name>
            </CreditItem>
            <CreditItem>
              <Role>Never Dies...</Role>
              <Name>Technoblade</Name>
            </CreditItem>
            <CreditItem>
              <Role>Gamer Rage Mode</Role>
              <Name>Ninja</Name>
            </CreditItem>
            <CreditItem>
              <Role>Chat Decides Fate</Role>
              <Name>Pokimane</Name>
            </CreditItem>
            <CreditItem>
              <Role>Incomprehensible Speed</Role>
              <Name>xQc</Name>
            </CreditItem>
            <CreditItem>
              <Role>Subathon Suffering</Role>
              <Name>Ludwig</Name>
            </CreditItem>
            <CreditItem>
              <Role>Among Us Paranoia</Role>
              <Name>Valkyrae</Name>
            </CreditItem>
            <CreditItem>
              <Role>Deep Voice Doom</Role>
              <Name>Corpse Husband</Name>
            </CreditItem>
            <CreditItem>
              <Role>Suspiciously Wholesome</Role>
              <Name>Sykkuno</Name>
            </CreditItem>
          </CreditsList>
        </CreditsSection>

        <SpecialThanks>
          Special thanks to everyone who dared to spin the wheel and face their regrets.
          May your future be filled with chaos, wisdom, and questionable decisions.
        </SpecialThanks>

        <CreditsSection>
          <SectionTitle>Technologies</SectionTitle>
          <CreditsList>
            <CreditItem>
              <Role>Frontend</Role>
              <Name>React, Styled Components, Framer Motion</Name>
            </CreditItem>
            <CreditItem>
              <Role>Backend</Role>
              <Name>Node.js, Express</Name>
            </CreditItem>
            <CreditItem>
              <Role>Original Game</Role>
              <Name>Unity Engine</Name>
            </CreditItem>
          </CreditsList>
        </CreditsSection>

        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          â Back to Menu
        </BackButton>

        <Footer>
          <p>Version 1.0.0 | Web Implementation</p>
          <p>Made with â¤ï¸ and questionable life choices</p>
        </Footer>
      </CreditsCard>
    </CreditsContainer>
  );
};

export default CreditsScreen;
