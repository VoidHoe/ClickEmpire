import { PrestigeChallengeState, PRESTIGE_TARGET } from '../empires/bedroom/BedroomPrestige'
import { formatCurrency } from '../engine/Currency'

interface Props {
  challenge: PrestigeChallengeState
  currentCurrency: number
  onStart: () => void
  onClose: () => void
}

export function PrestigeModal({ challenge, currentCurrency, onStart, onClose }: Props) {
  const progress = Math.min(100, (currentCurrency / PRESTIGE_TARGET) * 100)
  const minutes = Math.floor(challenge.timeRemaining / 60)
  const seconds = String(challenge.timeRemaining % 60).padStart(2, '0')

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500 rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-purple-400 text-2xl font-bold mb-2">Prestige Challenge</h2>
        <p className="text-gray-300 mb-6">
          Reach{' '}
          <span className="text-yellow-400 font-bold">${formatCurrency(PRESTIGE_TARGET)}</span>{' '}
          within 5 minutes. Complete it to reset and earn a permanent bonus.
        </p>

        {challenge.active ? (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-yellow-400">
                ${formatCurrency(currentCurrency)} / ${formatCurrency(PRESTIGE_TARGET)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-yellow-400 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-2xl font-bold text-white mb-4">
              {minutes}:{seconds}
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Back to Game
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onStart}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
            >
              Start Challenge
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Not Yet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
