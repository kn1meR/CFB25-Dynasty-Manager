const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: (key) => ipcRenderer.invoke('electron-store-get', key),
  saveData: (key, value) => ipcRenderer.invoke('electron-store-set', key, value),
});