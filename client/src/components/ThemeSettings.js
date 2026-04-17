import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SettingsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.98), rgba(0, 0, 0, 0.98));
  border-left: 2px solid rgba(255, 0, 0, 0.3);
  padding: 30px;
  z-index: 1000;
  overflow-y: auto;
`;

const SettingsTitle = styled.h2`
  font-size: 2rem;
  color: #ff0000;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const ThemeCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid ${props => props.selected ? '#ff0000' : 'rgba(255, 0, 0, 0.3)'};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff0000;
    transform: translateY(-2px);
  }
`;

const ThemePreview = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const ColorSwatch = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const ThemeName = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
`;

const ThemeSettings = ({ onClose }) => {
  const { theme, setTheme, darkMode, setDarkMode, soundPack, setSoundPack, animationStyle, setAnimationStyle, themes, soundPacks, animationStyles } = useTheme();

  return (
    <SettingsContainer
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
    >
      <SettingsTitle>⚙️ Settings</SettingsTitle>

      <SectionTitle>Wheel Theme</SectionTitle>
      <ThemeGrid>
        {Object.entries(themes).map(([key, themeData]) => (
          <ThemeCard
            key={key}
            selected={theme === key}
            onClick={() => setTheme(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThemePreview>
              {themeData.colors.slice(0, 4).map((color, index) => (
                <ColorSwatch key={index} color={color} />
              ))}
            </ThemePreview>
            <ThemeName>{themeData.name}</ThemeName>
          </ThemeCard>
        ))}
      </ThemeGrid>

      <SectionTitle>Display Mode</SectionTitle>
      <ThemeCard
        selected={darkMode}
        onClick={() => setDarkMode(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ marginBottom: '10px' }}
      >
        <ThemeName>🌙 Dark Mode</ThemeName>
      </ThemeCard>

      <ThemeCard
        selected={!darkMode}
        onClick={() => setDarkMode(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ThemeName>☀️ Light Mode</ThemeName>
      </ThemeCard>

      <SectionTitle>Sound Pack</SectionTitle>
      <ThemeGrid>
        {Object.entries(soundPacks).map(([key, packData]) => (
          <ThemeCard
            key={key}
            selected={soundPack === key}
            onClick={() => setSoundPack(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThemeName>{packData.icon || '🔊'} {packData.name}</ThemeName>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
              {packData.description}
            </div>
          </ThemeCard>
        ))}
      </ThemeGrid>

      <SectionTitle>Spin Animation</SectionTitle>
      <ThemeGrid>
        {Object.entries(animationStyles).map(([key, styleData]) => (
          <ThemeCard
            key={key}
            selected={animationStyle === key}
            onClick={() => setAnimationStyle(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThemeName>{styleData.name}</ThemeName>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
              {styleData.description}
            </div>
          </ThemeCard>
        ))}
      </ThemeGrid>

      <ThemeCard
        onClick={onClose}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ marginTop: '30px', borderColor: '#ff0000' }}
      >
        <ThemeName>✖ Close Settings</ThemeName>
      </ThemeCard>
    </SettingsContainer>
  );
};

export default ThemeSettings;
