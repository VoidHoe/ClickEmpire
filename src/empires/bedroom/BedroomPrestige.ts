export const PRESTIGE_TARGET = 1_000_000
export const PRESTIGE_TIME_LIMIT = 300

export interface PrestigeChallengeState {
  active: boolean
  startTime: number
  timeRemaining: number
}

export function createPrestigeChallenge(): PrestigeChallengeState {
  return {
    active: false,
    startTime: 0,
    timeRemaining: PRESTIGE_TIME_LIMIT,
  }
}

export function startPrestigeChallenge(): PrestigeChallengeState {
  return {
    active: true,
    startTime: Date.now(),
    timeRemaining: PRESTIGE_TIME_LIMIT,
  }
}

export function tickPrestigeChallenge(state: PrestigeChallengeState): PrestigeChallengeState {
  if (!state.active) return { ...state }
  return { ...state, timeRemaining: Math.max(0, state.timeRemaining - 1) }
}

export function isPrestigeChallengeComplete(
  state: PrestigeChallengeState,
  currentCurrency: number
): boolean {
  return state.active && currentCurrency >= PRESTIGE_TARGET
}

export function isPrestigeChallengeFailed(state: PrestigeChallengeState): boolean {
  return state.active && state.timeRemaining <= 0
}

export interface PrestigeBonus {
  freeMiners: number
}

export function calculatePrestigeBonus(prestigeCount: number): PrestigeBonus {
  return { freeMiners: prestigeCount }
}

export function applyPrestigeBonus(bonus: PrestigeBonus, basePassiveIncome: number): number {
  return basePassiveIncome + bonus.freeMiners * 0.5
}
