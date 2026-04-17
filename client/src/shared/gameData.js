// Shared game data and constants

export const GAME_MODES = {
  CLASSIC: 'Classic',
  CHAOS: 'Chaos Chain',
  FATE: 'Wheel of Fate',
  RAPID: 'Rapid Fire'
};

// Sound effect URLs (free from Mixkit)
export const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  spin: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  stop: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  doom: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  background: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  victory: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  horror: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'
};

// Meme GIFs for end results (using Giphy/Tenor free GIFs)
export const MEME_GIFS = {
  lowDoom: [
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // Success kid
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', // Happy dance
    'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif'  // Celebration
  ],
  mediumDoom: [
    'https://media.giphy.com/media/l3nWhI38RWD50C2tO/giphy.gif', // Thinking face
    'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', // Hmm
    'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif'  // Confused
  ],
  highDoom: [
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', // Disaster girl
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', // Panic
    'https://media.giphy.com/media/l1KVaj5UcbHwrBMqI/giphy.gif'  // Oh no
  ],
  victory: [
    'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif', // Fist pump
    'https://media.giphy.com/media/26FLgGTPUDK6vh4O4/giphy.gif', // Winner
    'https://media.giphy.com/media/l0MYGb1LuZ3n7YRBI/giphy.gif'  // All the things
  ]
};

export const WHEEL_SEGMENTS = [
  { text: "DO IT", color: "#FF0000", isRed: true, doom: 30 },
  { text: "REGRET IT", color: "#1A1A1F", isRed: false, doom: 80 },
  { text: "CHAOS", color: "#FF0000", isRed: true, doom: 100 },
  { text: "VIBES ONLY", color: "#1A1A1F", isRed: false, doom: 20 },
  { text: "ASK AGAIN", color: "#FF0000", isRed: true, doom: 50 },
  { text: "ABSOLUTELY", color: "#1A1A1F", isRed: false, doom: 10 },
  { text: "NEVER EVER", color: "#FF0000", isRed: true, doom: 90 },
  { text: "COSMIC YES", color: "#1A1A1F", isRed: false, doom: 15 },
  { text: "RUN AWAY", color: "#FF0000", isRed: true, doom: 85 },
  { text: "EMBRACE IT", color: "#1A1A1F", isRed: false, doom: 40 },
  { text: "DOOM AWAITS", color: "#FF0000", isRed: true, doom: 95 },
  { text: "MAYBE...", color: "#1A1A1F", isRed: false, doom: 55 }
];

export const AI_ANSWERS = {
  positive: [
    "The cosmic forces align in your favor...",
    "The wheel has spoken: fortune smiles...",
    "Against all odds, the universe says YES.",
    "The stars whisper approval...",
    "Proceed, mortal..."
  ],
  negative: [
    "The void laughs at your question. NO.",
    "The wheel has deemed this path unwise.",
    "Your fate is sealed with rejection.",
    "The cosmic balance requires disappointment.",
    "NAH. The wheel doesn't need to think."
  ],
  chaotic: [
    "DO IT BUT REGRET IT IMMEDIATELY.",
    "Do the opposite of what you think is right.",
    "The answer exists in quantum state...",
    "Your question angered the ancient forces.",
    "The wheel grants permission but revokes happiness."
  ],
  cryptic: [
    "Ask yourself: what would your past self think?",
    "The answer lies in the 7th dimension.",
    "When moon is full and stars align...",
    "The prophecy speaks of one who asks this...",
    "Your ancestors are watching..."
  ]
};

export const PERSONALITIES = {
  pewdiepie: { name: "PewDiePie", trait: "Swedish chaos energy", ending: "hammer" },
  mrbeast: { name: "MrBeast", trait: "Philanthropic madness", ending: "pokeball" },
  markiplier: { name: "Markiplier", trait: "Dramatic screaming", ending: "scp" },
  jacksepticeye: { name: "Jacksepticeye", trait: "Irish luck", ending: "hammer" },
  dream: { name: "Dream", trait: "Speedrun destiny", ending: "glitch" },
  tommyinnit: { name: "TommyInnit", trait: "Chaotic child energy", ending: "hammer" },
  technoblade: { name: "Technoblade", trait: "Never dies...", ending: "scp" },
  ninja: { name: "Ninja", trait: "Gamer rage mode", ending: "glitch" },
  pokimane: { name: "Pokimane", trait: "Chat decides your fate", ending: "pokeball" },
  xqc: { name: "xQc", trait: "Incomprehensible speed", ending: "glitch" },
  ludwig: { name: "Ludwig", trait: "Subathon suffering", ending: "hammer" },
  valkyrae: { name: "Valkyrae", trait: "Among Us paranoia", ending: "scp" },
  corpse: { name: "Corpse Husband", trait: "Deep voice doom", ending: "scp" },
  sykkuno: { name: "Sykkuno", trait: "Suspiciously wholesome", ending: "pokeball" },
  waya: { name: "Waya", trait: "Vibe coding master", ending: "hammer" },
  wayacreate: { name: "WayaCreate", trait: "The creator", ending: "hammer" }
};

export const GAME_MODE_DATA = {
  [GAME_MODES.CLASSIC]: { name: "Classic", description: "One question, one fate", maxSpins: 1, icon: "Classic" },
  [GAME_MODES.CHAOS]: { name: "Chaos Chain", description: "6 spins of escalating doom", maxSpins: 6, icon: "Chaos" },
  [GAME_MODES.FATE]: { name: "Wheel of Fate", description: "The wheel knows who you are", maxSpins: 6, icon: "Fate" },
  [GAME_MODES.RAPID]: { name: "Rapid Fire", description: "Auto-spin madness", maxSpins: 6, icon: "Rapid" }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getAIAnswer = (doom, gameMode) => {
  let category;
  if (gameMode === GAME_MODES.CHAOS) {
    category = 'chaotic';
  } else if (doom < 30) {
    category = 'positive';
  } else if (doom > 70) {
    category = 'negative';
  } else {
    category = Math.random() < 0.5 ? 'cryptic' : 'chaotic';
  }
  
  const templates = AI_ANSWERS[category];
  return templates[Math.floor(Math.random() * templates.length)];
};

export const calculateFinalScore = (spins, gameMode) => {
  if (!spins || spins.length === 0) {
    return { stars: 0, regretLevel: 0, creativityPoints: 0, stupidityPoints: 0, totalPoints: 0 };
  }

  const avgDoom = spins.reduce((sum, spin) => sum + spin.doom, 0) / spins.length;
  const questionLength = spins.reduce((sum, spin) => sum + (spin.question?.length || 0), 0);
  const stars = Math.max(0, Math.min(5, Math.round((100 - avgDoom) / 20)));
  const regretLevel = Math.round(avgDoom);
  const creativity = Math.min(100, Math.round(questionLength / spins.length * 2));
  const stupidity = Math.round(avgDoom * 0.8 + Math.random() * 20);
  
  const multiplier = {
    [GAME_MODES.CHAOS]: 2,
    [GAME_MODES.FATE]: 1.5,
    [GAME_MODES.RAPID]: 1.2,
    [GAME_MODES.CLASSIC]: 1
  }[gameMode] || 1;
  
  const total = Math.round((creativity + (100 - regretLevel) + stars * 20) * multiplier);
  
  return { stars, regretLevel, creativityPoints: creativity, stupidityPoints: stupidity, totalPoints: total };
};
