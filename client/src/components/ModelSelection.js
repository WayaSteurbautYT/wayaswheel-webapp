import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled(motion.div)`
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.98), rgba(0, 0, 0, 0.98));
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  margin: 20px auto;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #ff0000;
  margin-bottom: 10px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ModelCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.selected ? '#ff0000' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(255, 0, 0, 0.5);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.2);
  }

  ${props => props.selected && `
    border-color: #ff0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
  `}
`;

const ModelName = styled.h3`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const ModelSize = styled.span`
  background: ${props => {
    if (props.size < 2) return '#4CAF50';
    if (props.size < 4) return '#FF9800';
    return '#F44336';
  }};
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: inline-block;
`;

const ModelSpecs = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const ModelFeatures = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FeatureTag = styled.span`
  background: rgba(255, 0, 0, 0.1);
  color: #ff0000;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff0000;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
`;

const DownloadButton = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border: none;
  border-radius: 15px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;

  &:disabled {
    background: linear-gradient(45deg, #666, #444);
    cursor: not-allowed;
  }

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
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ff4444);
  border-radius: 4px;
`;

const StatusText = styled.p`
  text-align: center;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const CloudToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const ToggleLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: #ff0000;
  }

  &:checked + span:before {
    transform: translateX(30px);
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
  border-radius: 30px;

  &:before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const AI_MODELS = [
  {
    id: 'qwen3.5:0.8b',
    name: 'Qwen 3.5 0.8B',
    size: 1.0,
    context: '256K',
    features: ['Vision', 'Lightweight', 'Fast'],
    description: 'Smallest model, great for low-end systems'
  },
  {
    id: 'qwen3.5:2b',
    name: 'Qwen 3.5 2B',
    size: 2.7,
    context: '256K',
    features: ['Vision', 'Balanced', 'Quality'],
    description: 'Good balance of speed and quality'
  },
  {
    id: 'qwen3.5:4b',
    name: 'Qwen 3.5 4B',
    size: 3.4,
    context: '256K',
    features: ['Vision', 'Smart', 'Recommended'],
    description: 'Best balance for most systems'
  },
  {
    id: 'qwen3.5:latest',
    name: 'Qwen 3.5 9B',
    size: 6.6,
    context: '256K',
    features: ['Vision', 'Powerful', 'High Quality'],
    description: 'Maximum quality for high-end systems'
  },
  {
    id: 'qwen3.5:cloud',
    name: 'Qwen 3.5 Cloud',
    size: 0,
    context: '256K',
    features: ['Cloud', 'No Download', 'API Required'],
    description: 'Use cloud API (requires API key)'
  },
  {
    id: 'qwen3.5:397b-cloud',
    name: 'Qwen 3.5 397B Cloud',
    size: 0,
    context: '256K',
    features: ['Cloud', 'Ultra Powerful', 'API Required'],
    description: 'Maximum quality via cloud API'
  }
];

const ModelSelection = ({ onModelSelect, isDesktop = false }) => {
  const [selectedModel, setSelectedModel] = useState('qwen3.5:4b');
  const [useCloud, setUseCloud] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
  };

  const handleDownload = async () => {
    if (useCloud) {
      // Cloud model - just save selection
      onModelSelect?.(selectedModel);
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('Initializing download...');

    try {
      if (isDesktop) {
        // For desktop app, use IPC to trigger Ollama download
        const response = await fetch('http://localhost:5000/api/ai/pull-model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: selectedModel })
        });

        if (response.ok) {
          // Simulate progress for now
          const interval = setInterval(() => {
            setDownloadProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                setIsDownloading(false);
                setDownloadStatus('Download complete!');
                return 100;
              }
              setDownloadStatus(`Downloading... ${prev + 10}%`);
              return prev + 10;
            });
          }, 500);
          
          // Cleanup interval on unmount
          return () => clearInterval(interval);
        }
      } else {
        // For web app, just save selection
        setDownloadStatus('Model selected (download in desktop app)');
        setTimeout(() => {
          setIsDownloading(false);
          onModelSelect?.(selectedModel);
        }, 1000);
      }
    } catch (error) {
      setDownloadStatus('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  const filteredModels = useCloud 
    ? AI_MODELS.filter(m => m.id.includes('cloud'))
    : AI_MODELS.filter(m => !m.id.includes('cloud'));

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>🤖 Choose Your AI Model</Title>
      <Subtitle>
        Select a Qwen 3.5 model for AI-powered features. Larger models are smarter but require more resources.
      </Subtitle>

      {isDesktop && (
        <CloudToggle>
          <ToggleLabel>Use Cloud API</ToggleLabel>
          <ToggleSwitch>
            <ToggleInput 
              type="checkbox" 
              checked={useCloud}
              onChange={(e) => setUseCloud(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </CloudToggle>
      )}

      <ModelGrid>
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            selected={selectedModel === model.id}
            onClick={() => handleModelSelect(model.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedModel === model.id && <SelectedBadge>✓</SelectedBadge>}
            <ModelName>{model.name}</ModelName>
            <ModelSize size={model.size}>
              {model.size > 0 ? `${model.size} GB` : 'Cloud'}
            </ModelSize>
            <ModelSpecs>
              {model.context} context • {model.description}
            </ModelSpecs>
            <ModelFeatures>
              {model.features.map((feature, idx) => (
                <FeatureTag key={idx}>{feature}</FeatureTag>
              ))}
            </ModelFeatures>
          </ModelCard>
        ))}
      </ModelGrid>

      <DownloadButton
        onClick={handleDownload}
        disabled={isDownloading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isDownloading ? 'Downloading...' : useCloud ? 'Configure Cloud API' : 'Download & Use Model'}
      </DownloadButton>

      {isDownloading && (
        <>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${downloadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </ProgressBar>
          <StatusText>{downloadStatus}</StatusText>
        </>
      )}
    </Container>
  );
};

export default ModelSelection;
