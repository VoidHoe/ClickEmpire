import { Upgrade } from '../../engine/UpgradeSystem'

export const BEDROOM_UPGRADES: Upgrade[] = [
  {
    id: 'gpu_1',
    name: 'Basic GPU',
    baseCost: 50,
    costScaling: 1.15,
    level: 0,
    maxLevel: 20,
    passiveIncomeBonus: 0.5,
    clickBonus: 0,
  },
  {
    id: 'gpu_2',
    name: 'Mining Rig',
    baseCost: 500,
    costScaling: 1.15,
    level: 0,
    maxLevel: 20,
    passiveIncomeBonus: 5,
    clickBonus: 0,
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    baseCost: 200,
    costScaling: 1.12,
    level: 0,
    maxLevel: 10,
    passiveIncomeBonus: 2,
    clickBonus: 1,
  },
  {
    id: 'mining_bot',
    name: 'Mining Bot',
    baseCost: 2000,
    costScaling: 1.2,
    level: 0,
    maxLevel: 10,
    passiveIncomeBonus: 20,
    clickBonus: 0,
  },
]
