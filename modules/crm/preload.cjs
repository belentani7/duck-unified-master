const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('duckDesktop', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  getMode: () => ipcRenderer.invoke('app:mode'),
});
