import React, { createContext, useContext, useState, useEffect } from 'react';
import { SOUND_PACKS } from '../shared/soundPacks';
import { ANIMATION_STYLES } from '../shared/animationStyles';

const ThemeContext = createContext();

// Available wheel themes
export const WHEEL_THEMES = {
  DEFAULT: {
    name: 'Default Red',
    colors: ['#ff0000', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa', '#ffcccc', '#ffdddd', '#ffeeee'],
    background: 'radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%)',
    glow: 'rgba(255, 0, 0, 0.5)',
    pointer: '#ff0000'
  },
  NEON: {
    name: 'Neon Blue',
    colors: ['#00ffff', '#00ccff', '#0099ff', '#0066ff', '#0033ff', '#0000ff', '#3333ff', '#6666ff'],
    background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
    glow: 'rgba(0, 255, 255, 0.5)',
    pointer: '#00ffff'
  },
  FOREST: {
    name: 'Forest Green',
    colors: ['#00ff00', '#33cc33', '#66aa66', '#998899', '#aa66aa', '#cc44cc', '#dd33dd', '#ee22ee'],
    background: 'radial-gradient(ellipse at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%)',
    glow: 'rgba(0, 255, 0, 0.5)',
    pointer: '#00ff00'
  },
  PURPLE: {
    name: 'Mystic Purple',
    colors: ['#ff00ff', '#cc00ff', '#9900ff', '#6600ff', '#3300ff', '#0033ff', '#0066ff', '#0099ff'],
    background: 'radial-gradient(ellipse at center, rgba(255, 0, 255, 0.1) 0%, transparent 70%)',
    glow: 'rgba(255, 0, 255, 0.5)',
    pointer: '#ff00ff'
  },
  GOLD: {
    name: 'Golden Fortune',
    colors: ['#ffd700', '#ffcc00', '#ffaa00', '#ff8800', '#ff6600', '#ff4400', '#ff2200', '#ff0000'],
    background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    glow: 'rgba(255, 215, 0, 0.5)',
    pointer: '#ffd700'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('DEFAULT');
  const [darkMode, setDarkMode] = useState(true);
  const [soundPack, setSoundPack] = useState('DEFAULT');
  const [animationStyle, setAnimationStyle] = useState('DEFAULT');

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('wheelTheme');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSoundPack = localStorage.getItem('soundPack');
    const savedAnimationStyle = localStorage.getItem('animationStyle');
    
    if (savedTheme && WHEEL_THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
    
    if (savedSoundPack && SOUND_PACKS[savedSoundPack]) {
      setSoundPack(savedSoundPack);
    }
    
    if (savedAnimationStyle && ANIMATION_STYLES[savedAnimationStyle]) {
      setAnimationStyle(savedAnimationStyle);
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('wheelTheme', theme);
  }, [theme]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Save sound pack preference to localStorage
  useEffect(() => {
    localStorage.setItem('soundPack', soundPack);
  }, [soundPack]);

  // Save animation style preference to localStorage
  useEffect(() => {
    localStorage.setItem('animationStyle', animationStyle);
  }, [animationStyle]);

  const currentTheme = WHEEL_THEMES[theme];
  const currentSoundPack = SOUND_PACKS[soundPack];
  const currentAnimationStyle = ANIMATION_STYLES[animationStyle];

  const value = {
    theme,
    setTheme,
    darkMode,
    setDarkMode,
    soundPack,
    setSoundPack,
    animationStyle,
    setAnimationStyle,
    currentTheme,
    currentSoundPack,
    currentAnimationStyle,
    themes: WHEEL_THEMES,
    soundPacks: SOUND_PACKS,
    animationStyles: ANIMATION_STYLES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
