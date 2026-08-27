import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('pilotHarness', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
  restart: () => ipcRenderer.invoke('pilot-harness:restart') as Promise<boolean>,
  pickDirectory: () => ipcRenderer.invoke('pilot-harness:pick-directory') as Promise<string | null>,
  showDataFolder: () => ipcRenderer.invoke('pilot-harness:show-data-folder') as Promise<boolean>,
  copyDiagnostics: () => ipcRenderer.invoke('pilot-harness:copy-diagnostics') as Promise<boolean>,
  getNotificationPrefs: () => ipcRenderer.invoke('pilot-harness:get-notification-prefs') as Promise<{ onTurnCompletion: boolean; onTurnFailure: boolean }>,
  setNotificationPrefs: (prefs: { onTurnCompletion?: boolean; onTurnFailure?: boolean }) => ipcRenderer.invoke('pilot-harness:set-notification-prefs', prefs) as Promise<void>,
  getUpdateInfo: () => ipcRenderer.invoke('pilot-harness:get-update-info') as Promise<{ tag: string; name: string; url: string } | null>,
})

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.pilotDesktop = 'true'
  document.documentElement.dataset.pilotPlatform = process.platform
})
