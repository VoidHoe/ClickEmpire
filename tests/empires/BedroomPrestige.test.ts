import { describe, it, expect } from 'vitest'
import {
  createPrestigeChallenge,
  startPrestigeChallenge,
  tickPrestigeChallenge,
  isPrestigeChallengeComplete,
  isPrestigeChallengeFailed,
  calculatePrestigeBonus,
  applyPrestigeBonus,
  PRESTIGE_TARGET,
  PRESTIGE_TIME_LIMIT,
} from '../../src/empires/bedroom/BedroomPrestige'

describe('constants', () => {
  it('PRESTIGE_TARGET is 1000000', () => {
    expect(PRESTIGE_TARGET).toBe(1_000_000)
  })
  it('PRESTIGE_TIME_LIMIT is 300 seconds', () => {
    expect(PRESTIGE_TIME_LIMIT).toBe(300)
  })
})

describe('createPrestigeChallenge', () => {
  it('starts inactive', () => {
    expect(createPrestigeChallenge().active).toBe(false)
  })
  it('starts with full timeRemaining', () => {
    expect(createPrestigeChallenge().timeRemaining).toBe(PRESTIGE_TIME_LIMIT)
  })
})

describe('startPrestigeChallenge', () => {
  it('returns active challenge', () => {
    expect(startPrestigeChallenge().active).toBe(true)
  })
  it('sets timeRemaining to PRESTIGE_TIME_LIMIT', () => {
    expect(startPrestigeChallenge().timeRemaining).toBe(PRESTIGE_TIME_LIMIT)
  })
})

describe('tickPrestigeChallenge', () => {
  it('decrements timeRemaining by 1', () => {
    const challenge = startPrestigeChallenge()
    expect(tickPrestigeChallenge(challenge).timeRemaining).toBe(PRESTIGE_TIME_LIMIT - 1)
  })
  it('does not go below 0', () => {
    const challenge = { active: true, startTime: Date.now(), timeRemaining: 0 }
    expect(tickPrestigeChallenge(challenge).timeRemaining).toBe(0)
  })
  it('does not tick inactive challenges', () => {
    const challenge = createPrestigeChallenge()
    expect(tickPrestigeChallenge(challenge).timeRemaining).toBe(PRESTIGE_TIME_LIMIT)
  })
  it('does not mutate original', () => {
    const challenge = startPrestigeChallenge()
    tickPrestigeChallenge(challenge)
    expect(challenge.timeRemaining).toBe(PRESTIGE_TIME_LIMIT)
  })
})

describe('isPrestigeChallengeComplete', () => {
  it('returns true when currency meets target', () => {
    const challenge = startPrestigeChallenge()
    expect(isPrestigeChallengeComplete(challenge, PRESTIGE_TARGET)).toBe(true)
  })
  it('returns false below target', () => {
    const challenge = startPrestigeChallenge()
    expect(isPrestigeChallengeComplete(challenge, PRESTIGE_TARGET - 1)).toBe(false)
  })
  it('returns false when challenge is inactive', () => {
    const challenge = createPrestigeChallenge()
    expect(isPrestigeChallengeComplete(challenge, PRESTIGE_TARGET)).toBe(false)
  })
})

describe('isPrestigeChallengeFailed', () => {
  it('returns true when active and timeRemaining is 0', () => {
    const challenge = { active: true, startTime: Date.now(), timeRemaining: 0 }
    expect(isPrestigeChallengeFailed(challenge)).toBe(true)
  })
  it('returns false when time remains', () => {
    const challenge = startPrestigeChallenge()
    expect(isPrestigeChallengeFailed(challenge)).toBe(false)
  })
  it('returns false when inactive', () => {
    const challenge = createPrestigeChallenge()
    expect(isPrestigeChallengeFailed(challenge)).toBe(false)
  })
})

describe('calculatePrestigeBonus', () => {
  it('returns freeMiners equal to prestigeCount', () => {
    expect(calculatePrestigeBonus(3).freeMiners).toBe(3)
  })
  it('returns 0 freeMiners for first prestige (count=1)', () => {
    expect(calculatePrestigeBonus(1).freeMiners).toBe(1)
  })
})

describe('applyPrestigeBonus', () => {
  it('adds freeMiners * 0.5 to base passive income', () => {
    const bonus = { freeMiners: 4 }
    expect(applyPrestigeBonus(bonus, 0)).toBe(2)
  })
  it('adds on top of existing passive income', () => {
    const bonus = { freeMiners: 2 }
    expect(applyPrestigeBonus(bonus, 10)).toBe(11)
  })
})
