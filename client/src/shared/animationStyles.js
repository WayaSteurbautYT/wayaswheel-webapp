// Animation style definitions for wheel spinning

export const ANIMATION_STYLES = {
  DEFAULT: {
    name: 'Smooth',
    description: 'Standard smooth rotation',
    easing: 'easeOutCubic',
    duration: 3000
  },
  BOUNCE: {
    name: 'Bounce',
    description: 'Bouncy rotation effect',
    easing: 'easeOutBounce',
    duration: 3500
  },
  ELASTIC: {
    name: 'Elastic',
    description: 'Elastic overshoot effect',
    easing: 'easeOutElastic',
    duration: 4000
  },
  DRAMATIC: {
    name: 'Dramatic',
    description: 'Slow dramatic spin',
    easing: 'easeInOutCubic',
    duration: 5000
  },
  QUICK: {
    name: 'Quick',
    description: 'Fast snappy spin',
    easing: 'easeOutExpo',
    duration: 2000
  }
};

// Custom easing functions
export const EASING_FUNCTIONS = {
  easeOutCubic: (t) => {
    return (--t) * t * t + 1;
  },
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutCubic: (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  easeOutExpo: (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
};

// Apply easing to rotation
export const applyEasing = (progress, easingName) => {
  const easingFunction = EASING_FUNCTIONS[easingName] || EASING_FUNCTIONS.easeOutCubic;
  return easingFunction(progress);
};
