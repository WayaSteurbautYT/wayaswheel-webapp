// Social sharing helper

/**
 * Share result to Twitter/X
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 */
export const shareToTwitter = (text, url) => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

/**
 * Share result to Facebook
 * @param {string} url - URL to share
 */
export const shareToFacebook = (url) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

/**
 * Share result to LinkedIn
 * @param {string} url - URL to share
 * @param {string} title - Title
 */
export const shareToLinkedIn = (url, title) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
};

/**
 * Share result to Reddit
 * @param {string} title - Title
 * @param {string} url - URL to share
 */
export const shareToReddit = (title, url) => {
  const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  window.open(redditUrl, '_blank', 'width=600,height=400');
};

/**
 * Copy share text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Generate share text for game result
 * @param {object} result - Game result object
 * @param {string} username - Username
 * @returns {string} - Share text
 */
export const generateShareText = (result, username) => {
  const regretLevel = result.finalScore?.regretLevel || 50;
  const doomEmoji = regretLevel < 30 ? '🍀' : regretLevel < 60 ? '⚖️' : '💀';
  
  return `I just spun the Wheel of Regret and got ${regretLevel}% doom! ${doomEmoji}
  
My fate: ${result.finalScore?.finalAnswer || 'The wheel has spoken...'}
  
Spin your own fate at Waya's Wheel of Regret! 🎰
#WayasWheel #WheelOfRegret #Fate`;
};

/**
 * Generate share URL
 * @returns {string} - Share URL
 */
export const generateShareUrl = () => {
  return window.location.origin;
};
