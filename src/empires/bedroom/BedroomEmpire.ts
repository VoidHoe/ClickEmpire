import { Upgrade, applyUpgrade, calculateUpgradeCost, getTotalPassiveIncome, getTotalClickBonus } from '../../engine/UpgradeSystem'
import { canAfford } from '../../engine/Currency'
import { BEDROOM_UPGRADES } from './BedroomUpgrades'

export interface BedroomState {
  upgrades: Upgrade[]
}

export function createInitialBedroomState(): BedroomState {
  return {
    upgrades: BEDROOM_UPGRADES.map(u => ({ ...u })),
  }
}

export function getBedroomPassiveIncome(state: BedroomState): number {
  return getTotalPassiveIncome(state.upgrades)
}

export function getBedroomClickValue(state: BedroomState): number {
  return 1 + getTotalClickBonus(state.upgrades)
}

export interface PurchaseResult {
  success: boolean
  state: BedroomState
  currencySpent: number
}

export function purchaseBedroomUpgrade(
  state: BedroomState,
  upgradeId: string,
  availableCurrency: number
): PurchaseResult {
  const upgradeIndex = state.upgrades.findIndex(u => u.id === upgradeId)
  if (upgradeIndex === -1) return { success: false, state, currencySpent: 0 }

  const upgrade = state.upgrades[upgradeIndex]
  const cost = calculateUpgradeCost(upgrade)

  if (!canAfford(availableCurrency, cost)) {
    return { success: false, state, currencySpent: 0 }
  }

  const newUpgrades = [...state.upgrades]
  newUpgrades[upgradeIndex] = applyUpgrade(upgrade)

  return {
    success: true,
    state: { ...state, upgrades: newUpgrades },
    currencySpent: cost,
  }
}
