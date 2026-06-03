import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('electronAPI', {
  saveWrite: (_key: string, _data: string) => Promise.resolve({ success: true }),
  saveRead: (_key: string) => Promise.resolve(null)
})
