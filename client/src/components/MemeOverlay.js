import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const MemeImage = styled(motion.img)`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.8));
`;

const MemeText = styled(motion.div)`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Impact', sans-serif;
  font-size: 5rem;
  color: white;
  text-transform: uppercase;
  text-shadow: 4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000;
  text-align: center;
  white-space: nowrap;
`;

const MEMES = [
  { text: "OH NO!", img: "https://i.imgflip.com/30z0.jpg" }, // Example meme URLs
  { text: "TOTAL DOOM!", img: "https://i.imgflip.com/1otk9m.jpg" },
  { text: "RIP USER", img: "https://i.imgflip.com/26am.jpg" },
  { text: "CATASTROPHIC!", img: "https://i.imgflip.com/1g8m.jpg" },
];

const MemeOverlay = ({ isActive, doomLevel }) => {
  const [currentMeme, setCurrentMeme] = useState(MEMES[0]);

  useEffect(() => {
    if (isActive) {
      const randomMeme = MEMES[Math.floor(Math.random() * MEMES.length)];
      setCurrentMeme(randomMeme);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <OverlayContainer>
          <MemeText
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {currentMeme.text}
          </MemeText>
          <MemeImage
            src={currentMeme.img}
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          />
        </OverlayContainer>
      )}
    </AnimatePresence>
  );
};

export default MemeOverlay;