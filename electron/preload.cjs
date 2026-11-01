// @ts-check
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  openM3UFile: () => ipcRenderer.invoke('dialog:openM3UFile'),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  platform: process.platform
});
