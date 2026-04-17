import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: ${props => props.size || 50}px;
  height: ${props => props.size || 50}px;
`;

const SpinnerRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #ff0000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  &:nth-child(2) {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border-top-color: #cc0000;
    animation-duration: 0.8s;
  }
  
  &:nth-child(3) {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    border-top-color: #ff4444;
    animation-duration: 0.6s;
  }
`;

const SpinnerText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${props => props.textSize || 1}rem;
  margin-top: 15px;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-align: center;
`;

const InlineSpinner = styled.span`
  display: inline-block;
  width: ${props => props.size || 20}px;
  height: ${props => props.size || 20}px;
  border: 2px solid transparent;
  border-top-color: #ff0000;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
`;

const LoadingSpinner = ({ 
  size = 50, 
  text = 'Loading...', 
  textSize = 1,
  inline = false 
}) => {
  if (inline) {
    return <InlineSpinner size={size} />;
  }

  return (
    <SpinnerContainer>
      <SpinnerWrapper size={size}>
        <SpinnerRing />
        <SpinnerRing />
        <SpinnerRing />
      </SpinnerWrapper>
      {text && <SpinnerText textSize={textSize}>{text}</SpinnerText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
