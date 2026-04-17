import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  GAME_MODES, 
  generateId, 
  getAIAnswer, 
  calculateFinalScore 
} from '../shared/gameData';

// Initial state
const initialState = {
  currentScreen: 'auth',
  gameMode: GAME_MODES.CLASSIC,
  sessionId: null,
  username: '',
  userId: null,
  isAuthenticated: false,
  spins: [],
  currentSpinIndex: 0,
  isSpinning: false,
  selectedSegment: null,
  soundEnabled: true,
  personality: null,
  finalScore: null,
  gameComplete: false,
  stats: {
    totalSpins: 0,
    totalDoom: 0,
    history: []
  }
};

// Action types
const ActionTypes = {
  SET_SCREEN: 'SET_SCREEN',
  SET_GAME_MODE: 'SET_GAME_MODE',
  SET_USERNAME: 'SET_USERNAME',
  SET_USER_ID: 'SET_USER_ID',
  SET_AUTH: 'SET_AUTH',
  START_SESSION: 'START_SESSION',
  ADD_SPIN: 'ADD_SPIN',
  SET_SPINNING: 'SET_SPINNING',
  SET_SELECTED_SEGMENT: 'SET_SELECTED_SEGMENT',
  COMPLETE_GAME: 'COMPLETE_GAME',
  RESET_GAME: 'RESET_GAME',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  SET_PERSONALITY: 'SET_PERSONALITY',
  LOAD_STATS: 'LOAD_STATS',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_SCREEN:
      return { ...state, currentScreen: action.payload };
    
    case ActionTypes.SET_GAME_MODE:
      return { ...state, gameMode: action.payload };
    
    case ActionTypes.SET_USERNAME:
      return { ...state, username: action.payload };
    
    case ActionTypes.SET_USER_ID:
      return { ...state, userId: action.payload };
    
    case ActionTypes.SET_AUTH:
      return { ...state, isAuthenticated: action.payload };
    
    case ActionTypes.START_SESSION:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        username: action.payload.username || state.username,
        gameMode: action.payload.gameMode || state.gameMode,
        spins: [],
        currentSpinIndex: 0,
        gameComplete: false,
        finalScore: null
      };
    
    case ActionTypes.ADD_SPIN:
      const newSpin = {
        id: generateId(),
        question: action.payload.question,
        answer: action.payload.answer,
        doom: action.payload.doom,
        result: action.payload.result,
        timestamp: Date.now(),
        spinIndex: state.currentSpinIndex
      };
      
      const updatedSpins = [...state.spins, newSpin];
      const maxSpins = getMaxSpinsForMode(state.gameMode);
      const isComplete = updatedSpins.length >= maxSpins;
      
      return {
        ...state,
        spins: updatedSpins,
        currentSpinIndex: state.currentSpinIndex + 1,
        gameComplete: isComplete,
        finalScore: isComplete ? calculateFinalScore(updatedSpins, state.gameMode) : null
      };
    
    case ActionTypes.SET_SPINNING:
      return { ...state, isSpinning: action.payload };
    
    case ActionTypes.SET_SELECTED_SEGMENT:
      return { ...state, selectedSegment: action.payload };
    
    case ActionTypes.COMPLETE_GAME:
      return {
        ...state,
        gameComplete: true,
        finalScore: calculateFinalScore(state.spins, state.gameMode)
      };
    
    case ActionTypes.RESET_GAME:
      return {
        ...state,
        sessionId: null,
        spins: [],
        currentSpinIndex: 0,
        isSpinning: false,
        selectedSegment: null,
        gameComplete: false,
        finalScore: null
      };
    
    case ActionTypes.TOGGLE_SOUND:
      return { ...state, soundEnabled: !state.soundEnabled };
    
    case ActionTypes.SET_PERSONALITY:
      return { ...state, personality: action.payload };
    
    case ActionTypes.LOAD_STATS:
      return { ...state, stats: action.payload };
    
    case ActionTypes.UPDATE_STATS:
      const newStats = {
        totalSpins: state.stats.totalSpins + 1,
        totalDoom: state.stats.totalDoom + (action.payload.doom || 0),
        history: [...state.stats.history, action.payload.spinResult].slice(-100) // Keep last 100
      };
      return { ...state, stats: newStats };
    
    default:
      return state;
  }
};

// Helper function
const getMaxSpinsForMode = (mode) => {
  const modeData = {
    [GAME_MODES.CLASSIC]: 1,
    [GAME_MODES.CHAOS]: 6,
    [GAME_MODES.FATE]: 6,
    [GAME_MODES.RAPID]: 6
  };
  return modeData[mode] || 1;
};

// Create context
const GameStateContext = createContext();

// Provider component
export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Load stats from localStorage on mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('wheelStats');
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        dispatch({ type: ActionTypes.LOAD_STATS, payload: stats });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Clear corrupted data
      localStorage.removeItem('wheelStats');
    }
  }, []);
  
  // Save stats to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('wheelStats', JSON.stringify(state.stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }, [state.stats]);
  
  // Action creators
  const actions = {
    setScreen: (screen) => dispatch({ type: ActionTypes.SET_SCREEN, payload: screen }),
    setGameMode: (mode) => dispatch({ type: ActionTypes.SET_GAME_MODE, payload: mode }),
    setUsername: (username) => dispatch({ type: ActionTypes.SET_USERNAME, payload: username }),
    setUserId: (userId) => dispatch({ type: ActionTypes.SET_USER_ID, payload: userId }),
    setAuth: (isAuthenticated) => dispatch({ type: ActionTypes.SET_AUTH, payload: isAuthenticated }),
    startSession: (username, gameMode) => dispatch({ 
      type: ActionTypes.START_SESSION, 
      payload: { sessionId: generateId(), username, gameMode } 
    }),
    addSpin: (question, segment) => {
      const answer = getAIAnswer(segment.doom, state.gameMode);
      const spinData = {
        question,
        result: segment.text,
        doom: segment.doom,
        answer
      };
      
      dispatch({ type: ActionTypes.ADD_SPIN, payload: spinData });
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: { doom: segment.doom, spinResult: spinData } });
    },
    setSpinning: (isSpinning) => dispatch({ type: ActionTypes.SET_SPINNING, payload: isSpinning }),
    setSelectedSegment: (segment) => dispatch({ type: ActionTypes.SET_SELECTED_SEGMENT, payload: segment }),
    completeGame: () => dispatch({ type: ActionTypes.COMPLETE_GAME }),
    resetGame: () => dispatch({ type: ActionTypes.RESET_GAME }),
    toggleSound: () => dispatch({ type: ActionTypes.TOGGLE_SOUND }),
    setPersonality: (personality) => dispatch({ type: ActionTypes.SET_PERSONALITY, payload: personality })
  };
  
  const value = {
    ...state,
    ...actions,
    // Computed values
    currentSession: {
      id: state.sessionId,
      mode: state.gameMode,
      username: state.username,
      spins: state.spins,
      maxSpins: getMaxSpinsForMode(state.gameMode),
      isComplete: state.gameComplete,
      finalScore: state.finalScore
    },
    canSpin: state.spins.length < getMaxSpinsForMode(state.gameMode) && !state.isSpinning,
    averageDoom: state.stats.totalSpins > 0 ? Math.round(state.stats.totalDoom / state.stats.totalSpins) : 0
  };
  
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Hook to use the context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default GameStateContext;
