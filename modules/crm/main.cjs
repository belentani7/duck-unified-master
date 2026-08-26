const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const { spawn } = require('node:child_process');

let windowRef;
let localBackend;

function createWindow() {
  windowRef = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 680,
    backgroundColor: '#080c0b',
    show: false,
    title: 'DUCK.OS — Ritmo & Frequência',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devUrl = process.env.DUCK_DEV_URL;
  if (devUrl) windowRef.loadURL(devUrl);
  else windowRef.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  windowRef.once('ready-to-show', () => windowRef.show());
  windowRef.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

function startLocalBackend() {
  if (process.env.DUCK_DISABLE_BACKEND === '1') return;
  const backendName = process.platform === 'win32' ? 'duckos-core.exe' : 'duckos-core';
  const backend = path.join(process.resourcesPath || path.join(__dirname, '..'), 'backend', backendName);
  try { localBackend = spawn(backend, [], { windowsHide: true, stdio: 'ignore' }); } catch (error) { console.warn('[Duck] backend local opcional não iniciou', error.message); }
}

app.whenReady().then(() => { startLocalBackend(); createWindow(); });
app.on('window-all-closed', () => { if (localBackend) localBackend.kill(); if (process.platform !== 'darwin') app.quit(); });
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:mode', () => ({ mode: process.env.DUCK_DEV_URL ? 'desenvolvimento' : 'local-offline' }));
