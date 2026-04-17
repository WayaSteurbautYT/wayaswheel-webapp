import React, { createContext, useContext, useState, useEffect } from 'react';

const AchievementContext = createContext();

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_SPIN: {
    id: 'first_spin',
    name: 'First Spin',
    description: 'Spin the wheel for the first time',
    icon: '🎰',
    condition: (stats) => stats.totalSpins >= 1
  },
  TEN_SPINS: {
    id: 'ten_spins',
    name: 'Wheel Warrior',
    description: 'Spin the wheel 10 times',
    icon: '⚔️',
    condition: (stats) => stats.totalSpins >= 10
  },
  FIFTY_SPINS: {
    id: 'fifty_spins',
    name: 'Doom Master',
    description: 'Spin the wheel 50 times',
    icon: '💀',
    condition: (stats) => stats.totalSpins >= 50
  },
  HUNDRED_SPINS: {
    id: 'hundred_spins',
    name: 'Legend of Regret',
    description: 'Spin the wheel 100 times',
    icon: '👑',
    condition: (stats) => stats.totalSpins >= 100
  },
  LOW_DOOM: {
    id: 'low_doom',
    name: 'Lucky Duck',
    description: 'Get a doom level below 20%',
    icon: '🍀',
    condition: (stats) => stats.lowestDoom < 20
  },
  HIGH_DOOM: {
    id: 'high_doom',
    name: 'Doom Bringer',
    description: 'Get a doom level above 80%',
    icon: '🔥',
    condition: (stats) => stats.highestDoom > 80
  },
  PERFECT_DOOM: {
    id: 'perfect_doom',
    name: 'Fate\'s Favorite',
    description: 'Get exactly 50% doom',
    icon: '⚖️',
    condition: (stats) => stats.spins.some(s => s.doom === 50)
  },
  BALANCED: {
    id: 'balanced',
    name: 'Seeker of Balance',
    description: 'Average doom between 45-55%',
    icon: '☯️',
    condition: (stats) => {
      if (stats.totalSpins === 0) return false;
      const avgDoom = stats.totalDoom / stats.totalSpins;
      return avgDoom >= 45 && avgDoom <= 55;
    }
  },
  SURVIVOR: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete a game mode',
    icon: '🏆',
    condition: (stats) => stats.gamesCompleted >= 1
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    description: 'Complete 5 game modes',
    icon: '🎖️',
    condition: (stats) => stats.gamesCompleted >= 5
  }
};

export const AchievementProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [showNotification, setShowNotification] = useState(null);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      try {
        setUnlockedAchievements(new Set(JSON.parse(saved)));
      } catch (error) {
        console.warn('Failed to load achievements:', error);
      }
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify([...unlockedAchievements]));
  }, [unlockedAchievements]);

  const checkAchievements = (stats) => {
    const newUnlocks = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!unlockedAchievements.has(achievement.id) && achievement.condition(stats)) {
        newUnlocks.push(achievement);
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
      }
    });

    // Show notification for new achievements
    if (newUnlocks.length > 0) {
      setShowNotification(newUnlocks[0]);
      setTimeout(() => setShowNotification(null), 3000);
    }
  };

  const unlockAchievement = (achievementId) => {
    setUnlockedAchievements(prev => new Set([...prev, achievementId]));
  };

  const getAchievementProgress = () => {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = unlockedAchievements.size;
    return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
  };

  const value = {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    unlockAchievement,
    checkAchievements,
    getAchievementProgress,
    showNotification,
    setShowNotification
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementContext;
