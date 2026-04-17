const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { spawn } = require('child_process');
const fs = require('fs');

const store = new Store();

let mainWindow;
let serverProcess;

// Check for Ollama installation
function checkOllama() {
  const ollamaPath = store.get('ollamaPath', 'ollama');
  return new Promise((resolve) => {
    const process = spawn(ollamaPath, ['--version']);
    process.on('error', () => resolve({ installed: false }));
    process.on('close', (code) => {
      resolve({ installed: code === 0, path: ollamaPath });
    });
  });
}

// Start local Ollama server
async function startOllamaServer() {
  const ollamaPath = store.get('ollamaPath', 'ollama');
  
  return new Promise((resolve, reject) => {
    serverProcess = spawn(ollamaPath, ['serve']);
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`Ollama: ${data}`);
      if (data.toString().includes('Listening')) {
        resolve(true);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Ollama error: ${data}`);
    });
    
    serverProcess.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (serverProcess) {
        resolve(false);
      }
    }, 10000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: "Waya's Wheel of Regret",
    backgroundColor: '#1a1a1f',
    show: false // Don't show until ready to prevent flash
  });

  // Load the app from built client
  mainWindow.loadFile(path.join(__dirname, '../client/build/index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  // Check for Ollama
  const ollamaCheck = await checkOllama();
  store.set('ollamaInstalled', ollamaCheck.installed);
  
  if (ollamaCheck.installed) {
    try {
      await startOllamaServer();
      store.set('ollamaRunning', true);
    } catch (error) {
      console.error('Failed to start Ollama:', error);
      store.set('ollamaRunning', false);
    }
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-ollama-status', async () => {
  const installed = store.get('ollamaInstalled', false);
  const running = store.get('ollamaRunning', false);
  return { installed, running };
});

ipcMain.handle('set-ollama-path', async (event, path) => {
  store.set('ollamaPath', path);
  const check = await checkOllama();
  store.set('ollamaInstalled', check.installed);
  return check;
});

ipcMain.handle('restart-ollama', async () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  try {
    await startOllamaServer();
    store.set('ollamaRunning', true);
    return { success: true };
  } catch (error) {
    store.set('ollamaRunning', false);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

// Auto-updater (for future use)
// const { autoUpdater } = require('electron-updater');
// autoUpdater.checkForUpdatesAndNotify();
