export type TrapType = 'popup_bomb' | 'cursor_wobble' | 'fake_lag' | 'rick_roll'

export interface TrapEvent {
  fromId: string
  fromUsername: string
  toId: string
  trapType: TrapType
  sentAt: number
}

const TRAP_COOLDOWNS = new Map<string, number>()
const COOLDOWN_MS = 10_000

export function canSendTrap(fromId: string, trapType: TrapType): boolean {
  const key = `${fromId}:${trapType}`
  const lastSent = TRAP_COOLDOWNS.get(key)
  if (!lastSent) return true
  if (Date.now() - lastSent >= COOLDOWN_MS) {
    TRAP_COOLDOWNS.delete(key)
    return true
  }
  return false
}

export function recordTrapSent(fromId: string, trapType: TrapType): void {
  const key = `${fromId}:${trapType}`
  TRAP_COOLDOWNS.set(key, Date.now())
}

export function buildTrapEvent(
  fromId: string,
  fromUsername: string,
  toId: string,
  trapType: TrapType
): TrapEvent {
  return { fromId, fromUsername, toId, trapType, sentAt: Date.now() }
}
