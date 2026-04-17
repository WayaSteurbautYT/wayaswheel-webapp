// Cache helper for offline support

const CACHE_PREFIX = 'wayawheel_cache_';
const CACHE_VERSION = 'v1';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key
 * @param {string} key - Base key
 * @returns {string} - Full cache key with version
 */
const getCacheKey = (key) => {
  return `${CACHE_PREFIX}${CACHE_VERSION}_${key}`;
};

/**
 * Set item in cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds (default: 24 hours)
 */
export const setCache = (key, value, ttl = DEFAULT_TTL) => {
  try {
    const cacheData = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to set cache:', error);
  }
};

/**
 * Get item from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if expired/not found
 */
export const getCache = (key) => {
  try {
    const cacheKey = getCacheKey(key);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const cacheData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cacheData.timestamp > cacheData.ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return cacheData.value;
  } catch (error) {
    console.warn('Failed to get cache:', error);
    return null;
  }
};

/**
 * Remove item from cache
 * @param {string} key - Cache key
 */
export const removeCache = (key) => {
  try {
    localStorage.removeItem(getCacheKey(key));
  } catch (error) {
    console.warn('Failed to remove cache:', error);
  }
};

/**
 * Clear all cached items
 */
export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

/**
 * Get cache size in bytes
 * @returns {number} - Cache size in bytes
 */
export const getCacheSize = () => {
  try {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        size += localStorage.getItem(key).length;
      }
    });
    return size;
  } catch (error) {
    console.warn('Failed to get cache size:', error);
    return 0;
  }
};

/**
 * Get cache info (count, size, oldest item)
 * @returns {object} - Cache information
 */
export const getCacheInfo = () => {
  try {
    let count = 0;
    let size = 0;
    let oldestTimestamp = Date.now();
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        count++;
        const item = localStorage.getItem(key);
        size += item.length;
        
        try {
          const data = JSON.parse(item);
          if (data.timestamp < oldestTimestamp) {
            oldestTimestamp = data.timestamp;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });
    
    return {
      count,
      size,
      sizeInMB: (size / (1024 * 1024)).toFixed(2),
      oldestItemAge: Date.now() - oldestTimestamp
    };
  } catch (error) {
    console.warn('Failed to get cache info:', error);
    return { count: 0, size: 0, sizeInMB: '0', oldestItemAge: 0 };
  }
};

/**
 * Cache AI wheel segments
 * @param {string} question - The question
 * @param {array} segments - Wheel segments
 * @param {string} model - AI model used
 */
export const cacheWheelSegments = (question, segments, model) => {
  const key = `wheel_${model}_${question.toLowerCase().trim().substring(0, 50)}`;
  setCache(key, segments);
};

/**
 * Get cached wheel segments
 * @param {string} question - The question
 * @param {string} model - AI model used
 * @returns {array|null} - Cached segments or null
 */
export const getCachedWheelSegments = (question, model) => {
  const key = `wheel_${model}_${question.toLowerCase().trim().substring(0, 50)}`;
  return getCache(key);
};

/**
 * Cache AI analysis
 * @param {string} question - The question
 * @param {object} analysis - AI analysis
 * @param {string} model - AI model used
 */
export const cacheAIAnalysis = (question, analysis, model) => {
  const key = `analysis_${model}_${question.toLowerCase().trim().substring(0, 50)}`;
  setCache(key, analysis);
};

/**
 * Get cached AI analysis
 * @param {string} question - The question
 * @param {string} model - AI model used
 * @returns {object|null} - Cached analysis or null
 */
export const getCachedAIAnalysis = (question, model) => {
  const key = `analysis_${model}_${question.toLowerCase().trim().substring(0, 50)}`;
  return getCache(key);
};
