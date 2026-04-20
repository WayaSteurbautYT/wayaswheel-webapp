import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #000;
  color: #ff0000;
  text-align: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ErrorTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-shadow: 0 0 10px #ff0000;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ccc;
`;

const RetryButton = styled.button`
  background: #ff0000;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition: transform 0.2s, background 0.2s;
  &:hover {
    background: #cc0000;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Wheel of Regret Error Catch:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Fatal Regret</ErrorTitle>
          <ErrorMessage>
            The wheel has broken under the weight of your fate. 
            {this.state.error && `(Error: ${this.state.error.message})`}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>Try to Defy Fate Again</RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;