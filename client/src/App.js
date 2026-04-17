import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom';
import WheelComponent from './components/WheelComponent';
import MainMenu from './components/MainMenu';
import GameModeSelection from './components/GameModeSelection';
import ResultsScreen from './components/ResultsScreen';
import CreditsScreen from './components/CreditsScreen';
import LoadingScreen from './components/LoadingScreen';
import AuthScreen from './components/AuthScreen';
import ModelSelection from './components/ModelSelection';
import DeviceCheckScreen from './components/DeviceCheckScreen';
import ViewRegretsScreen from './components/ViewRegretsScreen';
import ErrorBoundary from './components/ErrorBoundary';
import SoundManager from './utils/SoundManager';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { ThemeProvider } from './context/ThemeContext';
import { AchievementProvider } from './context/AchievementContext';
import { API_ENDPOINTS } from './config';
import { fetchJSONWithRetry } from './utils/apiHelper';

// Global styles for the dark theme
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: radial-gradient(circle at center, #1a1a1f 0%, #000000 100%);
    color: #ffffff;
    overflow-x: hidden;
    min-height: 100vh;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1a1a1f;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #ff0000;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #cc0000;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1f 50%, #000000 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 20%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(255, 0, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const theme = {
  colors: {
    primary: '#ff0000',
    secondary: '#1a1a1f',
    background: '#000000',
    text: '#ffffff',
    accent: '#cc0000',
    glow: 'rgba(255, 0, 0, 0.5)'
  },
  fonts: {
    main: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    heading: "'Arial Black', sans-serif"
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// Main app content component
const AppContent = () => {
  const { currentScreen, isAuthenticated, setScreen, setAuth, setUser, setUsername } = useGameState();
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showDeviceCheck, setShowDeviceCheck] = useState(false);

  useEffect(() => {
    // Initialize sound manager
    SoundManager.init();
    SoundManager.setEnabled(true);

    // Check for existing session on load
    const checkExistingSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await fetchJSONWithRetry(
            API_ENDPOINTS.AUTH.CHECK_SESSION,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            },
            3,
            1000
          );

          if (data.success && data.user) {
            // Restore session
            setAuth(true);
            setUser(data.user);
            setUsername(data.user.user_metadata?.username || '');
            setScreen('main');
          } else {
            // Invalid session, clear token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuth(false);
          }
        } catch (error) {
          console.error('Failed to check session:', error);
        }
      }
    };

    checkExistingSession();
  }, [setAuth, setScreen, setUser, setUsername]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Check if device has been checked before
    const deviceChecked = localStorage.getItem('deviceChecked');
    if (!deviceChecked) {
      setShowDeviceCheck(true);
    } else {
      // Device check done, check if user is authenticated
      if (isAuthenticated) {
        setScreen('main');
      } else {
        setScreen('auth');
      }
    }
  };

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {showLoading ? (
          <LoadingScreen
            key="loading"
            onComplete={handleLoadingComplete}
          />
        ) : showDeviceCheck ? (
          <DeviceCheckScreen key="device-check" />
        ) : showModelSelection ? (
          <ModelSelection
            key="model-selection"
          onModelSelect={() => setShowModelSelection(false)}
          isDesktop={window.electronAPI !== undefined}
        />
      ) : !isAuthenticated ? (
        <AuthScreen key="auth" />
      ) : currentScreen === 'main' ? (
        <MainMenu key="main" onOpenSettings={() => setShowModelSelection(true)} />
      ) : currentScreen === 'view-regrets' ? (
        <ViewRegretsScreen key="view-regrets" />
      ) : currentScreen === 'mode-selection' ? (
        <GameModeSelection key="mode-selection" />
      ) : currentScreen === 'wheel' ? (
        <WheelComponent key="wheel" />
      ) : currentScreen === 'results' ? (
        <ResultsScreen key="results" />
      ) : currentScreen === 'credits' ? (
        <CreditsScreen key="credits" />
      ) : (
        <MainMenu key="main" onOpenSettings={() => setShowModelSelection(true)} />
      )}
      </AnimatePresence>
    </AppContainer>
  );
};

const App = () => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <ErrorBoundary>
          <ThemeProvider>
            <AchievementProvider>
              <GameStateProvider>
                <AppContent />
              </GameStateProvider>
            </AchievementProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </Router>
    </StyledThemeProvider>
  );
};

export default App;
