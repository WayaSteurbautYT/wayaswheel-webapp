// Input validation helper

/**
 * Validate question input
 * @param {string} question - The question to validate
 * @returns {object} - Validation result { valid: boolean, error: string }
 */
export const validateQuestion = (question) => {
  if (!question || typeof question !== 'string') {
    return { valid: false, error: 'Question is required' };
  }

  const trimmedQuestion = question.trim();

  // Check minimum length
  if (trimmedQuestion.length < 3) {
    return { valid: false, error: 'Question must be at least 3 characters long' };
  }

  // Check maximum length
  if (trimmedQuestion.length > 200) {
    return { valid: false, error: 'Question must be less than 200 characters' };
  }

  // Check for empty or whitespace-only
  if (trimmedQuestion.length === 0) {
    return { valid: false, error: 'Question cannot be empty' };
  }

  // Check for inappropriate content (basic filter)
  const inappropriateWords = [
    'kill', 'murder', 'suicide', 'terrorism', 'bomb', 'weapon',
    'hate', 'racist', 'nazi', 'violence', 'abuse'
  ];

  const lowerQuestion = trimmedQuestion.toLowerCase();
  const foundInappropriate = inappropriateWords.some(word => 
    lowerQuestion.includes(word)
  );

  if (foundInappropriate) {
    return { valid: false, error: 'Question contains inappropriate content' };
  }

  // Check for repeated characters (spam detection)
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(trimmedQuestion)) {
    return { valid: false, error: 'Question contains too many repeated characters' };
  }

  // Check for excessive special characters
  const specialCharCount = (trimmedQuestion.match(/[^a-zA-Z0-9\s?.,!']/g) || []).length;
  if (specialCharCount > trimmedQuestion.length * 0.3) {
    return { valid: false, error: 'Question contains too many special characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate username
 * @param {string} username - The username to validate
 * @returns {object} - Validation result { valid: boolean, error: string }
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const trimmedUsername = username.trim();

  // Check minimum length
  if (trimmedUsername.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  // Check maximum length
  if (trimmedUsername.length > 30) {
    return { valid: false, error: 'Username must be less than 30 characters' };
  }

  // Check for valid characters (alphanumeric, underscore, hyphen)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(trimmedUsername)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  // Check for inappropriate content
  const inappropriateWords = [
    'admin', 'moderator', 'system', 'root', 'support'
  ];

  const lowerUsername = trimmedUsername.toLowerCase();
  const foundInappropriate = inappropriateWords.some(word => 
    lowerUsername.includes(word)
  );

  if (foundInappropriate) {
    return { valid: false, error: 'Username contains restricted words' };
  }

  return { valid: true, error: null };
};

/**
 * Validate email
 * @param {string} email - The email to validate
 * @returns {object} - Validation result { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check length
  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true, error: null };
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result { valid: boolean, error: string, strength: number }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required', strength: 0 };
  }

  // Check minimum length
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long', strength: 20 };
  }

  let strength = 0;

  // Check for lowercase
  if (/[a-z]/.test(password)) {
    strength += 20;
  }

  // Check for uppercase
  if (/[A-Z]/.test(password)) {
    strength += 20;
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    strength += 20;
  }

  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 20;
  }

  // Check for length
  if (password.length >= 12) {
    strength += 20;
  }

  const valid = strength >= 60;
  const error = valid ? null : 'Password is too weak. Please use a stronger password.';

  return { valid, error, strength };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
