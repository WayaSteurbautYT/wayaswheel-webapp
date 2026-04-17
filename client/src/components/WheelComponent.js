import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { useTheme } from '../context/ThemeContext';
import { WHEEL_SEGMENTS, getAIAnswer } from '../shared/gameData';
import SoundManager from '../utils/SoundManager';
import LoadingSpinner from './LoadingSpinner';
import { API_ENDPOINTS } from '../config';
import { fetchJSONWithRetry } from '../utils/apiHelper';
import { getCachedWheelSegments, cacheWheelSegments, getCachedAIAnalysis, cacheAIAnalysis } from '../utils/cacheHelper';
import { validateQuestion, sanitizeInput } from '../utils/validationHelper';

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const WheelCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 
    0 0 50px rgba(255, 0, 0, 0.5),
    0 0 100px rgba(255, 0, 0, 0.3),
    inset 0 0 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s linear;
  cursor: pointer;
  
  &:hover {
    box-shadow: 
      0 0 60px rgba(255, 0, 0, 0.6),
      0 0 120px rgba(255, 0, 0, 0.4),
      inset 0 0 50px rgba(0, 0, 0, 0.5);
  }
`;

const WheelPointer = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-top: 50px solid #ff0000;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: -50px;
    left: -25px;
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-top: 50px solid #cc0000;
    filter: blur(2px);
  }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningWheel = styled(WheelCanvas)`
  animation: ${spinAnimation} 0.1s linear infinite;
`;

const LoadingWheel = styled(WheelCanvas)`
  animation: ${spinAnimation} 2s linear infinite;
  opacity: 0.6;
`;

const LoadingText = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  color: #ff0000;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 5;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// eslint-disable-next-line no-unused-vars
const CyclingTextBelow = styled(motion.div)`
  margin-top: 30px;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #ff0000;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 2px;
  min-height: 50px;
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 0, 0, 0.9));
  border: 2px solid #ff0000;
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  color: #ff0000;
  font-size: 0.9rem;
`;

// eslint-disable-next-line no-unused-vars
const EndCredits = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 31, 0.95));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
`;

// eslint-disable-next-line no-unused-vars
const CreditsTitle = styled(motion.h1)`
  font-size: 3rem;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 5px;
  margin-bottom: 40px;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
`;

// eslint-disable-next-line no-unused-vars
const CreditsList = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  margin-bottom: 40px;
`;

// eslint-disable-next-line no-unused-vars
const CreditItem = styled(motion.div)`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// eslint-disable-next-line no-unused-vars
const CreditQuestion = styled.div`
  flex: 1;
  color: #ffffff;
  font-size: 1rem;
  margin-right: 20px;
`;

// eslint-disable-next-line no-unused-vars
const CreditResult = styled.div`
  color: #ff0000;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: right;
`;

// eslint-disable-next-line no-unused-vars
const CreditDoom = styled.div`
  color: ${props => props.doom > 70 ? '#ff0000' : props.doom > 40 ? '#ffaa00' : '#00ff00'};
  font-weight: bold;
  min-width: 60px;
  text-align: right;
`;

// eslint-disable-next-line no-unused-vars
const FinalStats = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 0, 0, 0.9));
  border: 2px solid #ff0000;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
`;

// eslint-disable-next-line no-unused-vars
const FinalDoom = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  margin: 20px 0;
`;

// eslint-disable-next-line no-unused-vars
const EndCreditsButton = styled(motion.button)`
  padding: 20px 40px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 30px;
`;

const InputSection = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(0, 0, 0, 0.9));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const QuestionInput = styled.textarea`
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.7);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const CharCount = styled.div`
  text-align: right;
  margin-top: 5px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SpinButton = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    background: linear-gradient(45deg, #666, #444);
    cursor: not-allowed;
    transform: none;
  }
`;

const GenerateButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ff4444, #ff0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 15px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:disabled {
    background: linear-gradient(45deg, #666, #444);
    cursor: not-allowed;
  }
`;

// eslint-disable-next-line no-unused-vars
const CyclingText = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 5;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// eslint-disable-next-line no-unused-vars
const AnalysisBox = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.95), rgba(0, 0, 0, 0.95));
  border: 2px solid rgba(255, 0, 0, 0.4);
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

// eslint-disable-next-line no-unused-vars
const AnalysisTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// eslint-disable-next-line no-unused-vars
const AnalysisContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
`;

// eslint-disable-next-line no-unused-vars
const AnalysisRating = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 10px;
`;

// eslint-disable-next-line no-unused-vars
const RatingLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

// eslint-disable-next-line no-unused-vars
const RatingValue = styled.span`
  color: #ff0000;
  font-weight: bold;
  font-size: 1.1rem;
`;

// eslint-disable-next-line no-unused-vars
const QuestionDisplay = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  padding: 10px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 15px;
`;

const ResultSection = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.95), rgba(0, 0, 0, 0.95));
  border: 2px solid rgba(255, 0, 0, 0.5);
  border-radius: 15px;
  padding: 30px;
  margin-top: 30px;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const WheelResult = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
`;

const AIAnswer = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-left: 4px solid #ff0000;
  font-style: italic;
`;

const DoomMeter = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContinueButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  font-size: 1.1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
    border-color: white;
  }
`;

const WheelComponent = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const cyclingIntervalRef = useRef(null);
  
  const {
    isSpinning,
    setSpinning,
    selectedSegment,
    setSelectedSegment,
    addSpin,
    canSpin,
    currentSession,
    soundEnabled,
    setScreen
  } = useGameState();
  
  const { currentTheme } = useTheme();
  
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState('');
  
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showCyclingText, setShowCyclingText] = useState(false);
  const [cyclingText, setCyclingText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [charCount, setCharCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [aiChoices, setAiChoices] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [choiceIndex, setChoiceIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [aiAnalysis, setAiAnalysis] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [dynamicSegments, setDynamicSegments] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [generatingSegments, setGeneratingSegments] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [multiSpinAnswers, setMultiSpinAnswers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showEndCredits, setShowEndCredits] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [endCreditsData, setEndCreditsData] = useState(null); 

  // Draw the wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If no segments, draw empty wheel
    if (!dynamicSegments && !question) {
      // Draw empty wheel outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw center circle with W logo
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#1a1a1f';
      ctx.fill();
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw W in center
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('W', centerX, centerY);

      // Draw placeholder text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Enter a question to generate options', centerX, centerY + 50);
      return;
    }

    // Use dynamic segments or fall back to WHEEL_SEGMENTS
    const segmentsToUse = dynamicSegments || WHEEL_SEGMENTS;
    const anglePerSegment = (2 * Math.PI) / segmentsToUse.length;

    segmentsToUse.forEach((segment, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      // Draw border with glow effect
      ctx.strokeStyle = segment.isRed ? '#ff0000' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add inner glow for red segments
      if (segment.isRed) {
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(segment.text, radius * 0.7, 0);
      ctx.restore();
    });

    // Draw center circle with W logo
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1f';
    ctx.fill();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw W in center
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('W', centerX, centerY);
  }, [dynamicSegments, question]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 400;
      drawWheel();
    }
  }, [drawWheel]);

  // Redraw wheel when dynamic segments change
  useEffect(() => {
    if (dynamicSegments) {
      drawWheel();
    }
  }, [dynamicSegments, drawWheel, question]);

  // Handle question input
  const handleQuestionChange = (e) => {
    const text = e.target.value;
    setQuestion(text);
    setCharCount(text.length);
    
    // Validate on change
    if (text.trim().length > 0) {
      const validation = validateQuestion(text);
      if (!validation.valid) {
        setQuestionError(validation.error);
      } else {
        setQuestionError('');
      }
    } else {
      setQuestionError('');
    }
  };

  // Generate AI wheel segments from question
  const generateAISegments = async (questionText) => {
    // Validate question before sending
    const validation = validateQuestion(questionText);
    if (!validation.valid) {
      setQuestionError(validation.error);
      setGeneratingSegments(false);
      return null;
    }

    // Sanitize input
    const sanitizedQuestion = sanitizeInput(questionText);
    
    setGeneratingSegments(true);
    const apiKey = localStorage.getItem('grokApiKey');
    const selectedModel = localStorage.getItem('selectedAIModel') || 'gemini';
    const username = localStorage.getItem('username') || 'Player';

    console.log('Generating AI segments for question:', sanitizedQuestion);
    console.log('API Key present:', !!apiKey);
    console.log('Model:', selectedModel);
    console.log('Username:', username);

    // Check cache first for offline support
    const cachedSegments = getCachedWheelSegments(sanitizedQuestion, selectedModel);
    if (cachedSegments) {
      console.log('Using cached wheel segments');
      setDynamicSegments(cachedSegments);
      setGeneratingSegments(false);
      return cachedSegments;
    }

    try {
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AI.GENERATE_SPIN_CHOICES,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: sanitizedQuestion, gameMode: currentSession.mode, model: selectedModel, apiKey, username })
        },
        3,
        1000
      );
      console.log('AI response:', data);

      if (data.success && data.choices && data.choices.length > 0) {
        // Convert AI choices to wheel segments with colors and doom levels
        const colors = currentTheme.colors;
        const segments = data.choices.slice(0, 8).map((choice, index) => ({
          text: choice,
          color: colors[index % colors.length],
          doom: Math.floor(Math.random() * 100),
          isRed: index % 2 === 0
        }));

        // Cache the segments for offline use
        cacheWheelSegments(sanitizedQuestion, segments, selectedModel);
        
        setDynamicSegments(segments);
        setGeneratingSegments(false);
        setQuestionError('');
        return segments;
      } else {
        console.log('AI response invalid or no choices:', data);
      }
    } catch (error) {
      console.error('Failed to generate AI segments:', error);
      // Use fallback segments
    }

    setGeneratingSegments(false);
    // Use default segments as fallback
    setDynamicSegments(null);
    return null;
  };

  // Start cycling text during spin with AI choices
  const startCyclingText = async () => {
    setShowCyclingText(true);
    setShowAnalysis(true);
    
    // Get Grok API key
    const apiKey = localStorage.getItem('grokApiKey');
    const selectedModel = localStorage.getItem('selectedAIModel') || 'grok';
    
    // Generate AI analysis
    generateAIAnalysis(question, selectedModel, apiKey);
    
    // Try to get AI choices based on question
    try {
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AI.GENERATE_SPIN_CHOICES,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, gameMode: currentSession.mode, model: selectedModel, apiKey })
        },
        3,
        1000
      );
      console.log('AI choices response:', data);
      
      if (data.success && data.choices && data.choices.length > 0) {
        setAiChoices(data.choices);
        setChoiceIndex(0);
        setCyclingText(data.choices[0]);
        
        // Cycle through AI choices
        cyclingIntervalRef.current = setInterval(() => {
          setChoiceIndex(prev => {
            const nextIndex = (prev + 1) % data.choices.length;
            setCyclingText(data.choices[nextIndex]);
            return nextIndex;
          });
        }, 150);
        return;
      }
    } catch (error) {
      console.log('AI choices unavailable, using fallback:', error);
    }
    
    // Fallback to wheel segments (more dramatic than random)
    const fallbackChoices = WHEEL_SEGMENTS.map(s => s.text);
    setAiChoices(fallbackChoices);
    setChoiceIndex(0);
    setCyclingText(fallbackChoices[0]);
    
    cyclingIntervalRef.current = setInterval(() => {
      setChoiceIndex(prev => {
        const nextIndex = (prev + 1) % fallbackChoices.length;
        setCyclingText(fallbackChoices[nextIndex]);
        return nextIndex;
      });
    }, 100);
  };

  // Generate AI analysis of the question
  // eslint-disable-next-line no-unused-vars
  const generateAIAnalysis = async (questionText, model, apiKey) => {
    // Check cache first
    const cachedAnalysis = getCachedAIAnalysis(questionText, model);
    if (cachedAnalysis) {
      console.log('Using cached AI analysis');
      setAiAnalysis(cachedAnalysis);
      return;
    }

    try {
      const prompt = `Analyze this question for a wheel of fate game: "${questionText}". 
      Provide a JSON response with:
      - rating: a number from 1-10 rating the question's intensity
      - doom_prediction: a number from 0-100 predicting doom level
      - choice_analysis: a brief analysis of what choices might appear
      - wisdom: a short piece of wisdom related to the question
      Return ONLY valid JSON, no other text.`;
      
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AI.GENERATE_TEXT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model, apiKey, style: 'creative' })
        },
        3,
        1000
      );
      if (data.success && data.response) {
        try {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            
            // Cache the analysis
            cacheAIAnalysis(questionText, analysis, model);
            
            setAiAnalysis(analysis);
          }
        } catch (error) {
          console.log('Failed to parse AI analysis:', error);
        }
      }
    } catch (error) {
      console.log('AI analysis generation failed:', error);
    }
  };

  // Stop cycling text
  const stopCyclingText = () => {
    if (cyclingIntervalRef.current) {
      clearInterval(cyclingIntervalRef.current);
    }
    setShowCyclingText(false);
    setCyclingText('');
  };

  // Spin the wheel
  const spinWheel = async () => {
    if (!question.trim() || isSpinning || !canSpin) return;

    setSpinning(true);
    setShowResult(false);
    setSelectedSegment(null);

    startCyclingText();

    // Use dynamic segments or fall back to WHEEL_SEGMENTS
    const segmentsToUse = dynamicSegments || WHEEL_SEGMENTS;

    // Calculate spin parameters
    const spins = 5 + Math.random() * 3; // 5-8 rotations
    const randomSegment = Math.floor(Math.random() * segmentsToUse.length);
    const anglePerSegment = 360 / segmentsToUse.length;
    const targetRotation = spins * 360 + randomSegment * anglePerSegment;
    
    // Animate the spin
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for realistic deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const newRotation = startRotation + (targetRotation * easedProgress);
      setCurrentRotation(newRotation);
      
      if (canvasRef.current) {
        canvasRef.current.style.transform = `rotate(${newRotation}deg)`;
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Spin complete - handle AI response asynchronously
        handleSpinComplete(randomSegment);
      }
    };
    
    animate();
  };

  // Handle spin completion with AI response
  const handleSpinComplete = async (randomSegment) => {
    stopCyclingText();
    setShowAnalysis(false);

    // Use dynamic segments or fall back to WHEEL_SEGMENTS
    const segmentsToUse = dynamicSegments || WHEEL_SEGMENTS;
    const selected = segmentsToUse[randomSegment];

    // Get Grok API key and username
    const apiKey = localStorage.getItem('grokApiKey');
    const selectedModel = localStorage.getItem('selectedAIModel') || 'grok';
    const username = localStorage.getItem('username') || 'Player';
    
    // Get AI answer from API
    let aiAnswer;
    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          result: selected.text,
          doomLevel: selected.doom,
          gameMode: currentSession.mode,
          personality: username,
          model: selectedModel,
          apiKey,
          username
        })
      });
      const data = await response.json();
      if (data.success && data.response) {
        aiAnswer = data.response;
      } else {
        aiAnswer = getAIAnswer(selected.doom, currentSession.mode);
      }
    } catch (error) {
      console.log('AI response failed, using fallback');
      aiAnswer = getAIAnswer(selected.doom, currentSession.mode);
    }

    // Save answer for multi-spin modes
    const newAnswer = {
      question,
      result: selected.text,
      doom: selected.doom,
      aiAnswer,
      timestamp: Date.now()
    };

    const updatedAnswers = [...multiSpinAnswers, newAnswer];
    setMultiSpinAnswers(updatedAnswers);

    // Save result to Supabase
    try {
      await fetch('http://localhost:5000/api/ai/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          question,
          result: selected.text,
          doom: selected.doom,
          answer: aiAnswer,
          gameMode: currentSession.mode
        })
      });
    } catch (error) {
      console.log('Failed to save result to Supabase:', error);
    }

    // Check if we should show end credits (multi-spin mode complete)
    const maxSpins = currentSession.maxSpins || 1;
    if (currentSession.mode !== 'classic' && updatedAnswers.length >= maxSpins) {
      setShowEndCredits(true);
      setEndCreditsData({
        answers: updatedAnswers,
        username,
        totalDoom: updatedAnswers.reduce((sum, a) => sum + a.doom, 0),
        avgDoom: Math.round(updatedAnswers.reduce((sum, a) => sum + a.doom, 0) / updatedAnswers.length)
      });
    }

    setSelectedSegment({ ...selected, answer: aiAnswer });
    addSpin(question, { ...selected, answer: aiAnswer });
    setShowResult(true);
    setSpinning(false);
    
    if (soundEnabled) {
      SoundManager.play('stop');
    }
  };

  // Continue to next spin or results
  const handleContinue = () => {
    setShowResult(false);
    setQuestion('');
    setCharCount(0);
    
    if (currentSession.isComplete) {
      setScreen('results');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (cyclingIntervalRef.current) {
        clearInterval(cyclingIntervalRef.current);
      }
      stopCyclingText();
    };
  }, []);

  const getDoomColor = (doom) => {
    if (doom < 30) return '#4CAF50';
    if (doom < 60) return '#FF9800';
    if (doom < 80) return '#F44336';
    return '#8B0000';
  };

  const getDoomEmoji = (doom) => {
    if (doom < 30) return 'ð';
    if (doom < 60) return 'ð';
    if (doom < 80) return 'ð°';
    return 'ð';
  };

  return (
    <>
    <WheelContainer>
      <InputSection>
        <QuestionInput
          value={question}
          onChange={handleQuestionChange}
          onFocus={() => SoundManager.play('click')}
          placeholder="What question troubles your soul?"
          maxLength={200}
          disabled={isSpinning}
        />
        <CharCount>{charCount}/200</CharCount>

        {questionError && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {questionError}
          </ErrorMessage>
        )}

        {!dynamicSegments && question.trim() && !questionError && (
          <GenerateButton
            onClick={() => {
              SoundManager.play('click');
              generateAISegments(question);
            }}
            onHoverStart={() => SoundManager.play('hover')}
            disabled={generatingSegments}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {generatingSegments ? (
              <>
                <LoadingSpinner inline size={16} />
                GENERATING OPTIONS...
              </>
            ) : (
              '⚡ GENERATE AI OPTIONS ⚡'
            )}
          </GenerateButton>
        )}

        {dynamicSegments && (
          <SpinButton
            onClick={spinWheel}
            onHoverStart={() => SoundManager.play('hover')}
            disabled={isSpinning || !question.trim() || !canSpin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSpinning ? '🌪️ SPINNING...' : '🎰 SPIN THE WHEEL 🎰'}
          </SpinButton>
        )}
      </InputSection>

      <WheelWrapper>
        <WheelPointer />
        <WheelCanvas
          ref={canvasRef}
          as={isSpinning ? SpinningWheel : generatingSegments ? LoadingWheel : undefined}
        />
        <AnimatePresence>
          {generatingSegments && (
            <LoadingText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              ⚡ Generating Options ⚡
            </LoadingText>
          )}
        </AnimatePresence>
      </WheelWrapper>

      <AnimatePresence>
        {showCyclingText && (
          <CyclingTextBelow
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1 }}
          >
            {cyclingText}
          </CyclingTextBelow>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalysis && aiAnalysis && (
          <AnalysisBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisTitle>AI Analysis</AnalysisTitle>
            <AnalysisContent>{aiAnalysis.choice_analysis || 'Analyzing your question...'}</AnalysisContent>
            {aiAnalysis.wisdom && (
              <AnalysisContent>"{aiAnalysis.wisdom}"</AnalysisContent>
            )}
            {aiAnalysis.rating && (
              <AnalysisRating>
                <RatingLabel>Question Intensity</RatingLabel>
                <RatingValue>{aiAnalysis.rating}/10</RatingValue>
              </AnalysisRating>
            )}
            {aiAnalysis.doom_prediction && (
              <AnalysisRating>
                <RatingLabel>Predicted Doom</RatingLabel>
                <RatingValue>{aiAnalysis.doom_prediction}%</RatingValue>
              </AnalysisRating>
            )}
            <QuestionDisplay>"{question}"</QuestionDisplay>
          </AnalysisBox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResult && selectedSegment && (
          <ResultSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResultTitle>The Wheel Has Spoken</ResultTitle>
            <WheelResult>{selectedSegment.text}</WheelResult>
            <AIAnswer>
              {selectedSegment.answer}
            </AIAnswer>
            <DoomMeter style={{ background: getDoomColor(selectedSegment.doom) }}>
              DOOM: {selectedSegment.doom}% {getDoomEmoji(selectedSegment.doom)}
            </DoomMeter>
            <ContinueButton
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentSession.isComplete ? 'View Results' : 'Next Question'}
            </ContinueButton>
          </ResultSection>
        )}
      </AnimatePresence>
    </WheelContainer>

    {showEndCredits && endCreditsData && (
      <AnimatePresence>
        <EndCredits
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <CreditsTitle
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            🎭 {endCreditsData.username}'s Journey 🎭
          </CreditsTitle>
          <CreditsList>
            {endCreditsData.answers.map((answer, index) => (
              <CreditItem
                key={index}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              >
                <CreditQuestion>{answer.question}</CreditQuestion>
                <CreditResult>{answer.result}</CreditResult>
                <CreditDoom doom={answer.doom}>{answer.doom}%</CreditDoom>
              </CreditItem>
            ))}
          </CreditsList>
          <FinalStats
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <h3>Final Doom Rating</h3>
            <FinalDoom>{endCreditsData.avgDoom}%</FinalDoom>
            <p>Total Doom: {endCreditsData.totalDoom}</p>
            <EndCreditsButton
              onClick={() => {
                setShowEndCredits(false);
                setMultiSpinAnswers([]);
                setDynamicSegments(null);
                setQuestion('');
                setScreen('main');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return to Menu
            </EndCreditsButton>
          </FinalStats>
        </EndCredits>
      </AnimatePresence>
    )}
    </>
  );
};

export default WheelComponent;
