import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

contextBridge.exposeInMainWorld('electron', electronAPI)

contextBridge.exposeInMainWorld('electronAPI', {
  saveWrite: (key: string, data: string): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('save:write', key, data),
  saveRead: (key: string): Promise<string | null> =>
    ipcRenderer.invoke('save:read', key),
})
