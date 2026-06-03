import { describe, it, expect } from 'vitest'
import {
  createInitialBedroomState,
  purchaseBedroomUpgrade,
  getBedroomPassiveIncome,
  getBedroomClickValue,
} from '../../src/empires/bedroom/BedroomEmpire'

describe('BedroomEmpire', () => {
  it('starts with zero passive income', () => {
    const state = createInitialBedroomState()
    expect(getBedroomPassiveIncome(state)).toBe(0)
  })

  it('starts with click value of 1', () => {
    const state = createInitialBedroomState()
    expect(getBedroomClickValue(state)).toBe(1)
  })

  it('purchasing an upgrade increases passive income', () => {
    const state = createInitialBedroomState()
    const result = purchaseBedroomUpgrade(state, 'gpu_1', 1000)
    expect(getBedroomPassiveIncome(result.state)).toBeGreaterThan(0)
    expect(result.currencySpent).toBeGreaterThan(0)
  })

  it('cannot purchase upgrade without enough currency', () => {
    const state = createInitialBedroomState()
    const result = purchaseBedroomUpgrade(state, 'gpu_1', 0)
    expect(result.success).toBe(false)
    expect(result.currencySpent).toBe(0)
  })

  it('returns success false for unknown upgrade id', () => {
    const state = createInitialBedroomState()
    const result = purchaseBedroomUpgrade(state, 'nonexistent', 9999)
    expect(result.success).toBe(false)
  })

  it('does not mutate original state on purchase', () => {
    const state = createInitialBedroomState()
    const original = getBedroomPassiveIncome(state)
    purchaseBedroomUpgrade(state, 'gpu_1', 1000)
    expect(getBedroomPassiveIncome(state)).toBe(original)
  })

  it('purchase success returns correct currencySpent', () => {
    const state = createInitialBedroomState()
    const result = purchaseBedroomUpgrade(state, 'gpu_1', 9999)
    expect(result.success).toBe(true)
    expect(result.currencySpent).toBe(50) // gpu_1 baseCost is 50
  })
})
