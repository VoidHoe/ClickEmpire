export interface BedroomState {
  upgrades: []
}

export function createInitialBedroomState(): BedroomState {
  return { upgrades: [] }
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
    this.state = { ...initialState }
    this.onUpdate = onUpdate
  }

  start() {
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
      currency: this.state.currency + this.state.passiveIncome,
      lastTick: Date.now(),
    }
    this.onUpdate({ ...this.state })
  }

  click() {
    this.state = {
      ...this.state,
      currency: this.state.currency + this.state.clickValue,
    }
    this.onUpdate({ ...this.state })
  }

  getState(): GameState {
    return { ...this.state }
  }

  setState(state: GameState) {
    this.state = { ...state }
  }

  updatePassiveIncome(income: number) {
    this.state = { ...this.state, passiveIncome: income }
  }

  updateClickValue(value: number) {
    this.state = { ...this.state, clickValue: value }
  }
}
