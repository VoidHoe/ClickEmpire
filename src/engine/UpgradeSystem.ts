export interface Upgrade {
  id: string
  name: string
  baseCost: number
  costScaling: number
  level: number
  maxLevel: number
  passiveIncomeBonus: number
  clickBonus: number
}

export function calculateUpgradeCost(upgrade: Upgrade): number {
  return Math.round(upgrade.baseCost * Math.pow(upgrade.costScaling, upgrade.level))
}

export function applyUpgrade(upgrade: Upgrade): Upgrade {
  if (upgrade.level >= upgrade.maxLevel) return { ...upgrade }
  return { ...upgrade, level: upgrade.level + 1 }
}

export function getTotalPassiveIncome(upgrades: Upgrade[]): number {
  return upgrades.reduce((sum, u) => sum + u.passiveIncomeBonus * u.level, 0)
}

export function getTotalClickBonus(upgrades: Upgrade[]): number {
  return upgrades.reduce((sum, u) => sum + u.clickBonus * u.level, 0)
}
