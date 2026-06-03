export interface BedroomState {
  upgrades: unknown[]
}

export function createInitialBedroomState(): BedroomState {
  return { upgrades: [] }
}

function deepCopyBedroom(bedroom: BedroomState): BedroomState {
  return { ...bedroom, upgrades: [...bedroom.upgrades] }
}

export interface GameState {
  currency: number
  passiveIncome: number
  clickValue: number
  lastTick: number
  bedroom: BedroomState
  prestigeCount: number
}

export function createInitialState(): GameState {
  return {
    currency: 0,
    passiveIncome: 0,
    clickValue: 1,
    lastTick: Date.now(),
    bedroom: createInitialBedroomState(),
    prestigeCount: 0,
  }
}

export class GameEngine {
  private state: GameState
  private tickInterval: ReturnType<typeof setInterval> | null = null
  private onUpdate: (state: GameState) => void

  constructor(initialState: GameState, onUpdate: (state: GameState) => void) {
    this.state = { ...initialState, bedroom: deepCopyBedroom(initialState.bedroom) }
    this.onUpdate = onUpdate
  }

  start() {
    if (this.tickInterval) return
    this.tickInterval = setInterval(() => this.tick(), 1000)
  }

  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
  }

  private tick() {
    this.state = {
      ...this.state,
      bedroom: deepCopyBedroom(this.state.bedroom),
      currency: this.state.currency + this.state.passiveIncome,
      lastTick: Date.now(),
    }
    this.onUpdate({ ...this.state, bedroom: deepCopyBedroom(this.state.bedroom) })
  }

  click() {
    this.state = {
      ...this.state,
      bedroom: deepCopyBedroom(this.state.bedroom),
      currency: this.state.currency + this.state.clickValue,
    }
    this.onUpdate({ ...this.state, bedroom: deepCopyBedroom(this.state.bedroom) })
  }

  getState(): GameState {
    return { ...this.state, bedroom: deepCopyBedroom(this.state.bedroom) }
  }

  setState(state: GameState) {
    this.state = { ...state, bedroom: deepCopyBedroom(state.bedroom) }
  }

  updatePassiveIncome(income: number) {
    this.state = { ...this.state, passiveIncome: income }
  }

  updateClickValue(value: number) {
    this.state = { ...this.state, clickValue: value }
  }
}
