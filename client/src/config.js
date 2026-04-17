// Configuration file for the web app

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    CHECK_SESSION: `${API_BASE_URL}/api/auth/check-session`,
    GUEST: `${API_BASE_URL}/api/auth/guest`,
    USER: `${API_BASE_URL}/api/auth/user`,
    PROFILE: (userId) => `${API_BASE_URL}/api/auth/profile/${userId}`
  },
  AI: {
    HEALTH: `${API_BASE_URL}/api/ai/health`,
    DEVICE_CAPABILITIES: `${API_BASE_URL}/api/ai/device-capabilities`,
    GENERATE_ENDING: `${API_BASE_URL}/api/ai/generate-ending`,
    GENERATE_THEMED_ENDING: `${API_BASE_URL}/api/ai/generate-themed-ending`,
    GENERATE_GAME_MODE: `${API_BASE_URL}/api/ai/generate-game-mode`,
    GENERATE_RESPONSE: `${API_BASE_URL}/api/ai/generate-response`,
    GENERATE_SPIN_CHOICES: `${API_BASE_URL}/api/ai/generate-spin-choices`,
    GENERATE_TEXT: `${API_BASE_URL}/api/ai/generate-text`,
    GENERATE_REVIEW: `${API_BASE_URL}/api/ai/generate-review`,
    PULL_MODEL: `${API_BASE_URL}/api/ai/pull-model`,
    MODELS: `${API_BASE_URL}/api/ai/models`
  },
  GAME: {
    SESSION: `${API_BASE_URL}/api/game/session`,
    SAVE_RESULT: `${API_BASE_URL}/api/game/save-result`,
    REGRETS: `${API_BASE_URL}/api/game/regrets`
  }
};

export const APP_CONFIG = {
  MAX_QUESTION_LENGTH: 200,
  MAX_USERNAME_LENGTH: 30,
  SPIN_DURATION: 3000,
  LOADING_INTRO_DURATION: 5000,
  LOADING_STEP_DURATION: 600,
  DEFAULT_MUSIC_VOLUME: 0.3,
  DEFAULT_SFX_VOLUME: 0.5
};
