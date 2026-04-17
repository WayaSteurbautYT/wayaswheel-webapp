import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, rgba(26, 26, 31, 0.95), rgba(0, 0, 0, 0.95));
  border: 2px solid #ff0000;
  border-radius: 15px;
  padding: 20px;
  min-width: 300px;
  z-index: 9999;
  box-shadow: 0 10px 40px rgba(255, 0, 0, 0.3);
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
`;

const AchievementTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff0000;
`;

const AchievementDescription = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

const AchievementNotification = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <NotificationContainer
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 30 }}
      >
        <NotificationHeader>
          <AchievementIcon>{achievement.icon}</AchievementIcon>
          <AchievementTitle>Achievement Unlocked!</AchievementTitle>
        </NotificationHeader>
        <AchievementDescription>
          <strong>{achievement.name}</strong>
          <br />
          {achievement.description}
        </AchievementDescription>
      </NotificationContainer>
    </AnimatePresence>
  );
};

export default AchievementNotification;
