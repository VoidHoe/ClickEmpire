import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GameEngine, createInitialState } from '../../src/engine/GameEngine'
import { formatCurrency } from '../../src/engine/Currency'

describe('formatCurrency', () => {
  it('formats numbers below 1000 as plain integers', () => {
    expect(formatCurrency(500)).toBe('500')
  })
  it('formats thousands with K suffix', () => {
    expect(formatCurrency(1500)).toBe('1.50K')
  })
  it('formats millions with M suffix', () => {
    expect(formatCurrency(2500000)).toBe('2.50M')
  })
})

describe('GameEngine', () => {
  let engine: GameEngine
  let updates: ReturnType<typeof createInitialState>[]

  beforeEach(() => {
    updates = []
    engine = new GameEngine(createInitialState(), (state) => updates.push(state))
  })
  afterEach(() => engine.stop())

  it('starts with zero currency', () => {
    expect(engine.getState().currency).toBe(0)
  })
  it('click adds clickValue currency', () => {
    engine.click()
    expect(engine.getState().currency).toBe(1)
  })
  it('tick adds passiveIncome to currency', () => {
    engine['state'].passiveIncome = 5
    engine['tick']()
    expect(engine.getState().currency).toBe(5)
  })
  it('tick triggers onUpdate callback', () => {
    engine['tick']()
    expect(updates.length).toBe(1)
  })
  it('click triggers onUpdate callback', () => {
    engine.click()
    expect(updates.length).toBe(1)
  })
  it('setState replaces state', () => {
    const newState = createInitialState()
    newState.currency = 999
    engine.setState(newState)
    expect(engine.getState().currency).toBe(999)
  })
})
