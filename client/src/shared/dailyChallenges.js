// Daily challenge questions

export const DAILY_CHALLENGES = [
  {
    id: 1,
    question: "Should I quit my job without having another one lined up?",
    category: "Career",
    difficulty: "High"
  },
  {
    id: 2,
    question: "Should I text my ex after 3 months of no contact?",
    category: "Relationship",
    difficulty: "Medium"
  },
  {
    id: 3,
    question: "Should I move to a new city where I know no one?",
    category: "Life Decision",
    difficulty: "High"
  },
  {
    id: 4,
    question: "Should I adopt a pet while living alone?",
    category: "Lifestyle",
    difficulty: "Low"
  },
  {
    id: 5,
    question: "Should I go back to school at 30 years old?",
    category: "Career",
    difficulty: "Medium"
  },
  {
    id: 6,
    question: "Should I confess my feelings to my best friend?",
    category: "Relationship",
    difficulty: "High"
  },
  {
    id: 7,
    question: "Should I invest my savings in cryptocurrency?",
    category: "Finance",
    difficulty: "High"
  },
  {
    id: 8,
    question: "Should I cut off toxic family members?",
    category: "Family",
    difficulty: "High"
  },
  {
    id: 9,
    question: "Should I start a business with my savings?",
    category: "Career",
    difficulty: "High"
  },
  {
    id: 10,
    question: "Should I delete all my social media accounts?",
    category: "Lifestyle",
    difficulty: "Medium"
  },
  {
    id: 11,
    question: "Should I go on that solo trip I've been planning?",
    category: "Travel",
    difficulty: "Low"
  },
  {
    id: 12,
    question: "Should I tell my boss about my coworker's mistake?",
    category: "Work Ethics",
    difficulty: "Medium"
  },
  {
    id: 13,
    question: "Should I reconnect with my estranged parent?",
    category: "Family",
    difficulty: "High"
  },
  {
    id: 14,
    question: "Should I buy a house in this market?",
    category: "Finance",
    difficulty: "High"
  },
  {
    id: 15,
    question: "Should I pursue my passion project full-time?",
    category: "Career",
    difficulty: "High"
  },
  {
    id: 16,
    question: "Should I end a long-term friendship that feels one-sided?",
    category: "Relationship",
    difficulty: "Medium"
  },
  {
    id: 17,
    question: "Should I learn a new skill or improve existing ones?",
    category: "Personal Growth",
    difficulty: "Low"
  },
  {
    id: 18,
    question: "Should I confront my neighbor about their noise?",
    category: "Social",
    difficulty: "Low"
  },
  {
    id: 19,
    question: "Should I join a dating app?",
    category: "Relationship",
    difficulty: "Low"
  },
  {
    id: 20,
    question: "Should I speak up in a meeting even if I'm unsure?",
    category: "Career",
    difficulty: "Medium"
  }
];

// Get challenge for today based on date
export const getDailyChallenge = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
};

// Get challenge for specific date
export const getChallengeForDate = (date) => {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
};
