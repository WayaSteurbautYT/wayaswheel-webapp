import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
`;

const SettingsContainer = styled(motion.div)`
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

const SettingsHeader = styled.div`
  padding: 20px;
  border-bottom: 2px solid rgba(255, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsTitle = styled.h3`
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

const SettingsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

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

const SettingSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h4`
  color: #ff0000;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 0, 0, 0.2);
  padding-bottom: 10px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SettingLabel = styled.span`
  color: #ffffff;
  font-size: 1rem;
`;

const SettingDescription = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 5px 0 0 0;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: #ff0000;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  transition: 0.4s;
  border-radius: 26px;

  &:before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const SelectInput = styled.select`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 150px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff0000;
  }

  option {
    background: #1a1a1f;
    color: #ffffff;
  }
`;

const TextInput = styled.input`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 200px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff0000;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 150px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff0000;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff0000;
    cursor: pointer;
    border: none;
  }
`;

const SaveButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }
`;

const ResetButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ff0000;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const SettingsPage = ({ onClose }) => {
  const { soundEnabled, toggleSound, stats } = useGameState();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: false,
    musicVolume: 50,
    sfxVolume: 75,
    autoSave: true,
    showHistory: true,
    darkMode: true,
    notifications: true,
    aiModel: 'qwen3.5:4b',
    apiKey: '',
    language: 'en',
    theme: 'default'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSliderChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('wheelSettings', JSON.stringify(settings));
    // Save API key and model for AI
    if (settings.apiKey) {
      localStorage.setItem('grokApiKey', settings.apiKey);
    }
    if (settings.aiModel) {
      localStorage.setItem('selectedAIModel', settings.aiModel);
    }
    // Apply settings
    if (settings.soundEnabled !== soundEnabled) {
      toggleSound();
    }
    onClose?.();
  };

  const handleReset = () => {
    setSettings({
      soundEnabled: true,
      musicEnabled: false,
      musicVolume: 50,
      sfxVolume: 75,
      autoSave: true,
      showHistory: true,
      darkMode: true,
      notifications: true,
      aiModel: 'grok',
      apiKey: '',
      language: 'en',
      theme: 'default'
    });
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('wheelSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    // Load API key and model from localStorage if not in settings
    const apiKey = localStorage.getItem('grokApiKey');
    const selectedModel = localStorage.getItem('selectedAIModel');
    if (apiKey) {
      setSettings(prev => ({ ...prev, apiKey }));
    }
    if (selectedModel) {
      setSettings(prev => ({ ...prev, aiModel: selectedModel }));
    }
  }, []);

  return (
    <SettingsContainer
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <SettingsHeader>
        <SettingsTitle>⚙️ Settings</SettingsTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </SettingsHeader>

      <SettingsContent>
        <SettingSection>
          <SectionTitle>🔊 Audio</SectionTitle>
          
          <SettingItem>
            <div>
              <SettingLabel>Sound Effects</SettingLabel>
              <SettingDescription>Enable wheel spin and interaction sounds</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.soundEnabled}
                onChange={() => handleToggle('soundEnabled')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Background Music</SettingLabel>
              <SettingDescription>Play ambient music during gameplay</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.musicEnabled}
                onChange={() => handleToggle('musicEnabled')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Music Volume</SettingLabel>
              <SettingDescription>{settings.musicVolume}%</SettingDescription>
            </div>
            <SliderInput
              type="range"
              min="0"
              max="100"
              value={settings.musicVolume}
              onChange={(e) => handleSliderChange('musicVolume', e.target.value)}
            />
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>SFX Volume</SettingLabel>
              <SettingDescription>{settings.sfxVolume}%</SettingDescription>
            </div>
            <SliderInput
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume}
              onChange={(e) => handleSliderChange('sfxVolume', e.target.value)}
            />
          </SettingItem>
        </SettingSection>

        <SettingSection>
          <SectionTitle>🤖 AI Settings</SectionTitle>

          <SettingItem>
            <div>
              <SettingLabel>AI Model</SettingLabel>
              <SettingDescription>Select your preferred AI model</SettingDescription>
            </div>
            <SelectInput
              value={settings.aiModel}
              onChange={(e) => handleSelectChange('aiModel', e.target.value)}
            >
              <option value="grok">Grok (xAI)</option>
              <option value="gemini">Gemini (Google)</option>
              <option value="openai">OpenAI GPT</option>
              <option value="groq">Groq</option>
            </SelectInput>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>API Key</SettingLabel>
              <SettingDescription>Enter your API key for the selected AI model</SettingDescription>
            </div>
            <TextInput
              type="password"
              placeholder="Enter API key..."
              value={settings.apiKey}
              onChange={(e) => handleSelectChange('apiKey', e.target.value)}
            />
          </SettingItem>
        </SettingSection>

        <SettingSection>
          <SectionTitle>🎮 Gameplay</SectionTitle>
          
          <SettingItem>
            <div>
              <SettingLabel>Auto-Save Progress</SettingLabel>
              <SettingDescription>Automatically save game sessions</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Show History Panel</SettingLabel>
              <SettingDescription>Display spin history during gameplay</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.showHistory}
                onChange={() => handleToggle('showHistory')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Notifications</SettingLabel>
              <SettingDescription>Enable desktop notifications</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>
        </SettingSection>

        <SettingSection>
          <SectionTitle>🎨 Appearance</SectionTitle>
          
          <SettingItem>
            <div>
              <SettingLabel>Dark Mode</SettingLabel>
              <SettingDescription>Use dark theme throughout the app</SettingDescription>
            </div>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Theme</SettingLabel>
              <SettingDescription>Choose color theme</SettingDescription>
            </div>
            <SelectInput
              value={settings.theme}
              onChange={(e) => handleSelectChange('theme', e.target.value)}
            >
              <option value="default">Default (Red)</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
            </SelectInput>
          </SettingItem>
        </SettingSection>

        <SettingSection>
          <SectionTitle>🌐 Language</SectionTitle>
          
          <SettingItem>
            <div>
              <SettingLabel>Language</SettingLabel>
              <SettingDescription>Select app language</SettingDescription>
            </div>
            <SelectInput
              value={settings.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </SelectInput>
          </SettingItem>
        </SettingSection>

        <SettingSection>
          <SectionTitle>📊 Statistics</SectionTitle>
          
          <SettingItem>
            <div>
              <SettingLabel>Total Spins</SettingLabel>
              <SettingDescription>{stats.totalSpins || 0}</SettingDescription>
            </div>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Total Score</SettingLabel>
              <SettingDescription>{stats.totalScore || 0}</SettingDescription>
            </div>
          </SettingItem>

          <SettingItem>
            <div>
              <SettingLabel>Games Played</SettingLabel>
              <SettingDescription>{stats.gamesPlayed || 0}</SettingDescription>
            </div>
          </SettingItem>
        </SettingSection>

        <SaveButton
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Settings
        </SaveButton>

        <ResetButton
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset to Default
        </ResetButton>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default SettingsPage;
