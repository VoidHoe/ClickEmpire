import { GameState } from '../engine/GameEngine'
import { calculateUpgradeCost } from '../engine/UpgradeSystem'
import { UpgradeCard } from '../components/UpgradeCard'

interface Props {
  state: GameState
  onPurchaseUpgrade: (upgradeId: string) => void
  onOpenPrestige: () => void
}

export function BedroomScreen({ state, onPurchaseUpgrade, onOpenPrestige }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-1">Your Bedroom</h2>
        <p className="text-gray-400 text-sm">Mining crypto one click at a time.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          <button
            onClick={() => onPurchaseUpgrade('__click__')}
            className="w-48 h-48 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-xl font-bold shadow-lg shadow-blue-900 select-none"
          >
            MINE
          </button>
        </div>

        <div className="w-72 p-4 border-l border-gray-700 overflow-y-auto space-y-3">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Upgrades</h3>
          {state.bedroom.upgrades.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              canAfford={state.currency >= calculateUpgradeCost(upgrade)}
              onPurchase={onPurchaseUpgrade}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onOpenPrestige}
          className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg"
        >
          Prestige Challenge
        </button>
      </div>
    </div>
  )
}
