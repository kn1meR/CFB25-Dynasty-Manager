

const { app, BrowserWindow, ipcMain } = require("fix-esm").require('electron');
const path = require("fix-esm").require('path');
const url = require("fix-esm").require('url');
const ElectronStore  = require("fix-esm").require('electron-store');

const Store = ElectronStore.default;

// Now we can create a new instance of Store
const store = new Store();

const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = isDev 
    ? `http://localhost:${port}`
    : url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true
      });
  
  console.log('Loading URL:', startUrl);
  
  win.loadURL(startUrl);

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('electron-store-get', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('electron-store-set', async (event, key, value) => {
  store.set(key, value);
});
