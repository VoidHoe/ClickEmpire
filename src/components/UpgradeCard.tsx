import { Upgrade, calculateUpgradeCost } from '../engine/UpgradeSystem'
import { formatCurrency } from '../engine/Currency'

interface Props {
  upgrade: Upgrade
  canAfford: boolean
  onPurchase: (id: string) => void
}

export function UpgradeCard({ upgrade, canAfford, onPurchase }: Props) {
  const cost = calculateUpgradeCost(upgrade)
  const isMaxed = upgrade.level >= upgrade.maxLevel

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-semibold">{upgrade.name}</h3>
        <span className="text-gray-400 text-xs">Lv {upgrade.level}/{upgrade.maxLevel}</span>
      </div>
      <div className="text-gray-400 text-sm mb-3">
        {upgrade.passiveIncomeBonus > 0 && (
          <div>+{(upgrade.passiveIncomeBonus * upgrade.level).toFixed(1)}/sec</div>
        )}
        {upgrade.clickBonus > 0 && (
          <div>+{upgrade.clickBonus * upgrade.level} click</div>
        )}
      </div>
      <button
        onClick={() => onPurchase(upgrade.id)}
        disabled={!canAfford || isMaxed}
        className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
          isMaxed
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
            : canAfford
            ? 'bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isMaxed ? 'MAXED' : `$${formatCurrency(cost)}`}
      </button>
    </div>
  )
}
