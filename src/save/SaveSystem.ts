import { GameState } from '../engine/GameEngine'

declare global {
  interface Window {
    electronAPI: {
      saveWrite: (key: string, data: string) => Promise<{ success: boolean }>
      saveRead: (key: string) => Promise<string | null>
    }
  }
}

const SAVE_KEY = 'gamestate_v1'

export async function saveGame(state: GameState): Promise<void> {
  await window.electronAPI.saveWrite(SAVE_KEY, JSON.stringify(state))
}

export async function loadGame(): Promise<GameState | null> {
  const raw = await window.electronAPI.saveRead(SAVE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}
