const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Ollama status
  getOllamaStatus: () => ipcRenderer.invoke('get-ollama-status'),
  setOllamaPath: (path) => ipcRenderer.invoke('set-ollama-path', path),
  restartOllama: () => ipcRenderer.invoke('restart-ollama'),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Local storage wrapper (for persistence)
  store: {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
  }
});

// Listen for updates from main process
ipcRenderer.on('ollama-status-changed', (event, status) => {
  window.postMessage({ type: 'ollama-status', status }, '*');
});
