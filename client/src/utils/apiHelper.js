// API helper with retry logic and exponential backoff

/**
 * Fetch with retry logic and exponential backoff
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} initialDelay - Initial delay in ms (default: 1000)
 * @returns {Promise} - Fetch promise
 */
export const fetchWithRetry = async (url, options = {}, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If response is ok, return it
      if (response.ok) {
        return response;
      }
      
      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // If it's a server error (5xx), retry
      throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate exponential backoff delay
      const delay = initialDelay * Math.pow(2, attempt);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
    }
  }
  
  throw lastError;
};

/**
 * Fetch JSON with retry logic
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} initialDelay - Initial delay in ms (default: 1000)
 * @returns {Promise<object>} - Parsed JSON response
 */
export const fetchJSONWithRetry = async (url, options = {}, maxRetries = 3, initialDelay = 1000) => {
  const response = await fetchWithRetry(url, options, maxRetries, initialDelay);
  return response.json();
};

/**
 * Check if the browser is online
 * @returns {boolean} - Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Add online/offline event listeners
 * @param {function} onOnline - Callback when online
 * @param {function} onOffline - Callback when offline
 * @returns {function} - Cleanup function
 */
export const addNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
