import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import LoadingSpinner from './LoadingSpinner';
import { API_ENDPOINTS } from '../config';
import { fetchJSONWithRetry } from '../utils/apiHelper';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
`;

const AuthCard = styled(motion.div)`
  background: rgba(26, 26, 31, 0.9);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff0000;
  text-align: center;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  text-align: center;
  opacity: 0.7;
  margin-bottom: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(255, 0, 0, 0.3);
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px;
  background: transparent;
  border: none;
  color: ${props => props.active ? '#ff0000' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: ${props => props.active ? '2px solid #ff0000' : 'none'};
  margin-bottom: -2px;

  &:hover {
    color: #ff0000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff0000;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 0, 0, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

// eslint-disable-next-line no-unused-vars
const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

// eslint-disable-next-line no-unused-vars
const CharCount = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  display: block;
  margin-top: 5px;
`;

// eslint-disable-next-line no-unused-vars
const PasswordStrength = styled.div`
  margin-top: 8px;
`;

// eslint-disable-next-line no-unused-vars
const StrengthBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
`;

// eslint-disable-next-line no-unused-vars
const StrengthFill = styled(motion.div)`
  height: 100%;
  background: ${props => {
    if (props.strength <= 20) return '#ff0000';
    if (props.strength <= 40) return '#ff6600';
    if (props.strength <= 60) return '#ffcc00';
    if (props.strength <= 80) return '#66ff00';
    return '#00ff00';
  }};
`;

// eslint-disable-next-line no-unused-vars
const StrengthText = styled.span`
  font-size: 0.75rem;
  color: ${props => {
    if (props.strength <= 20) return '#ff0000';
    if (props.strength <= 40) return '#ff6600';
    if (props.strength <= 60) return '#ffcc00';
    if (props.strength <= 80) return '#66ff00';
    return '#00ff00';
  }};
`;

// eslint-disable-next-line no-unused-vars
const PasswordHint = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 5px;
`;

const VerificationOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const VerificationCard = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  
  h2 {
    color: #ff0000;
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 30px;
  }
`;

const VerificationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VerificationInput = styled.input`
  padding: 15px;
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 5px;
  
  &:focus {
    outline: none;
    border-color: #ff0000;
  }
`;

const BackButton = styled(motion.button)`
  padding: 10px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    border-color: #ff0000;
    color: #ff0000;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  opacity: 0.5;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }

  span {
    padding: 0 15px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const GuestButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff0000;
    color: #ff0000;
  }
`;

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [storedPassword, setStoredPassword] = useState(''); // Store password for auto-login
  const { setScreen, setUsername: setGameStateUsername, setAuth } = useGameState();

  // eslint-disable-next-line no-unused-vars
  const updateConfirmPassword = (value) => setConfirmPassword(value);

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength += 20;
    if (pwd.length >= 12) strength += 10;
    
    // Complexity checks
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 25;
    
    return Math.min(100, strength);
  };

  const passwordStrength = calculatePasswordStrength(password);
  // eslint-disable-next-line no-unused-vars
  const strengthText = passwordStrength <= 20 ? 'Very Weak' : 
                      passwordStrength <= 40 ? 'Weak' :
                      passwordStrength <= 60 ? 'Fair' :
                      passwordStrength <= 80 ? 'Strong' : 'Very Strong';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        },
        3,
        1000
      );

      if (data.error) {
        if (data.requiresVerification) {
          setShowVerification(true);
          setError('Please verify your email first');
          setLoading(false);
          return;
        }
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setGameStateUsername(data.user.user_metadata?.username || email.split('@')[0]);
      setAuth(true);
      setScreen('main');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 40) {
      setError('Password is too weak. Please use a stronger password.');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AUTH.SIGNUP,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password })
        },
        3,
        1000
      );

      if (data.error) {
        setError(data.error || 'Sign up failed');
        setLoading(false);
        return;
      }

      // Store password for auto-login after verification
      setStoredPassword(password);

      // Show verification screen
      setShowVerification(true);
      setError(data.message || 'Verification code sent to email');
      setLoading(false);
    } catch (err) {
      setError('Failed to connect to server');
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AUTH.VERIFY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: verificationCode, password: storedPassword })
        },
        3,
        1000
      );

      if (data.error) {
        setError(data.error || 'Verification failed');
        setLoading(false);
        return;
      }

      // If verification includes auto-login, handle the login
      if (data.token && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setGameStateUsername(data.user.user_metadata?.username || email.split('@')[0]);
        setAuth(true);
        setScreen('main');
        return;
      }

      // Otherwise, proceed with normal login
      handleLogin(e);
    } catch (err) {
      setError('Failed to verify');
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    const guestUsername = `Guest_${Math.random().toString(36).substr(2, 6)}`;
    const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    try {
      // Create guest session on server
      const data = await fetchJSONWithRetry(
        API_ENDPOINTS.AUTH.GUEST,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: guestUsername, token: guestToken })
        },
        3,
        1000
      );

      if (data.success) {
        localStorage.setItem('token', guestToken);
        localStorage.setItem('user', JSON.stringify({ username: guestUsername, is_guest: true }));
        setGameStateUsername(guestUsername);
        setAuth(true);
        setScreen('main');
      } else {
        // Fallback if server fails
        localStorage.setItem('token', guestToken);
        localStorage.setItem('user', JSON.stringify({ username: guestUsername, is_guest: true }));
        setGameStateUsername(guestUsername);
        setAuth(true);
        setScreen('main');
      }
    } catch (error) {
      // Fallback if server fails
      localStorage.setItem('token', guestToken);
      localStorage.setItem('user', JSON.stringify({ username: guestUsername, is_guest: true }));
      setGameStateUsername(guestUsername);
      setAuth(true);
      setScreen('main');
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Waya's Wheel</Title>
        <Subtitle>Sign in to save your progress</Subtitle>

        <TabContainer>
          <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
            Login
          </Tab>
          <Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
            Sign Up
          </Tab>
        </TabContainer>

        <form onSubmit={activeTab === 'login' ? handleLogin : handleSignUp}>
          {activeTab === 'signup' && (
            <InputWrapper>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                required
                maxLength={20}
              />
              <CharCount>{username.length}/20</CharCount>
            </InputWrapper>
          )}
          <InputWrapper>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 50))}
              required
              minLength={6}
              maxLength={50}
            />
            <CharCount>{password.length}/50</CharCount>
            {activeTab === 'signup' && password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill 
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    transition={{ duration: 0.3 }}
                    strength={passwordStrength}
                  />
                </StrengthBar>
                <StrengthText strength={passwordStrength}>{strengthText}</StrengthText>
                <PasswordHint>Min 6 chars, use uppercase, lowercase, numbers & symbols</PasswordHint>
              </PasswordStrength>
            )}
          </InputWrapper>
          {activeTab === 'signup' && (
            <InputWrapper>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                maxLength={50}
              />
              {confirmPassword && confirmPassword !== password && (
                <ErrorMessage style={{ marginTop: '5px', marginBottom: '0' }}>
                  Passwords do not match
                </ErrorMessage>
              )}
            </InputWrapper>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            type="submit"
            disabled={loading || (activeTab === 'signup' && password !== confirmPassword)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Loading...' : activeTab === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <Divider>
          <span>OR</span>
        </Divider>

        <GuestButton
          onClick={handleGuest}
          type="button"
          disabled={loading}
        >
          Continue as Guest
        </GuestButton>
      </AuthCard>
      
      {showVerification && (
        <VerificationOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <VerificationCard
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit code sent to {email}</p>
            <VerificationForm onSubmit={handleVerification}>
              <VerificationInput
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner inline size={16} />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </SubmitButton>
              <BackButton
                type="button"
                onClick={() => setShowVerification(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </BackButton>
            </VerificationForm>
          </VerificationCard>
        </VerificationOverlay>
      )}
    </AuthContainer>
  );
};

export default AuthScreen;
