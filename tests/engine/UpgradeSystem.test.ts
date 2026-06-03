import { describe, it, expect } from 'vitest'
import { calculateUpgradeCost, applyUpgrade, getTotalPassiveIncome, getTotalClickBonus, Upgrade } from '../../src/engine/UpgradeSystem'

const mockUpgrade: Upgrade = {
  id: 'gpu_1',
  name: 'Better GPU',
  baseCost: 100,
  costScaling: 1.15,
  level: 0,
  maxLevel: 10,
  passiveIncomeBonus: 1,
  clickBonus: 0,
}

describe('calculateUpgradeCost', () => {
  it('returns baseCost when level is 0', () => {
    expect(calculateUpgradeCost(mockUpgrade)).toBe(100)
  })
  it('scales cost by costScaling factor per level', () => {
    const upgraded = { ...mockUpgrade, level: 1 }
    expect(calculateUpgradeCost(upgraded)).toBeCloseTo(115, 0)
  })
  it('scales correctly at level 2', () => {
    const upgraded = { ...mockUpgrade, level: 2 }
    expect(calculateUpgradeCost(upgraded)).toBeCloseTo(132, 0)
  })
})

describe('applyUpgrade', () => {
  it('increments upgrade level', () => {
    const result = applyUpgrade(mockUpgrade)
    expect(result.level).toBe(1)
  })
  it('does not exceed maxLevel', () => {
    const maxed = { ...mockUpgrade, level: 10 }
    const result = applyUpgrade(maxed)
    expect(result.level).toBe(10)
  })
  it('returns new object, does not mutate original', () => {
    applyUpgrade(mockUpgrade)
    expect(mockUpgrade.level).toBe(0)
  })
})

describe('getTotalPassiveIncome', () => {
  it('returns 0 for all level-0 upgrades', () => {
    expect(getTotalPassiveIncome([mockUpgrade])).toBe(0)
  })
  it('returns sum of passiveIncomeBonus * level across upgrades', () => {
    const upgraded = { ...mockUpgrade, level: 3 }
    expect(getTotalPassiveIncome([upgraded])).toBe(3)
  })
  it('sums across multiple upgrades', () => {
    const a = { ...mockUpgrade, level: 2, passiveIncomeBonus: 1 }
    const b = { ...mockUpgrade, id: 'b', level: 1, passiveIncomeBonus: 5 }
    expect(getTotalPassiveIncome([a, b])).toBe(7)
  })
})

describe('getTotalClickBonus', () => {
  it('returns 0 when no click upgrades', () => {
    expect(getTotalClickBonus([mockUpgrade])).toBe(0)
  })
  it('returns sum of clickBonus * level', () => {
    const clicker = { ...mockUpgrade, clickBonus: 2, level: 3 }
    expect(getTotalClickBonus([clicker])).toBe(6)
  })
})
