import React, { Component } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a1f, #000000);
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 30px;
  animation: shake 0.5s ease-in-out;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  color: #ff0000;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin-bottom: 30px;
  text-align: left;
  
  summary {
    color: #ff0000;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  pre {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const RetryButton = styled.button`
  padding: 15px 40px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HomeButton = styled(RetryButton)`
  background: linear-gradient(45deg, #1a1a1f, #000000);
  border: 2px solid #ff0000;
  color: #ff0000;
  margin-left: 15px;
  
  &:hover {
    background: linear-gradient(45deg, #ff0000, #cc0000);
    color: white;
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>💀</ErrorIcon>
          <ErrorTitle>The Wheel Broke</ErrorTitle>
          <ErrorMessage>
            Something went wrong while spinning the wheel of fate. 
            The cosmos have aligned against us, but don't worry—your regret is safe.
          </ErrorMessage>
          
          <ErrorDetails>
            <summary>Technical Details (for the curious)</summary>
            <pre>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </ErrorDetails>
          
          <div>
            <RetryButton onClick={this.handleRetry}>
              🔄 Try Again
            </RetryButton>
            <HomeButton onClick={this.handleGoHome}>
              🏠 Go Home
            </HomeButton>
          </div>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
