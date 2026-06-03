import { OnlinePlayer } from '../multiplayer/SocketClient'
import { TrapType } from '../../server/TrapHandler'

interface Props {
  players: OnlinePlayer[]
  mySocketId: string
  onSendTrap: (toId: string, trapType: TrapType) => void
}

const TRAPS: { id: TrapType; label: string }[] = [
  { id: 'popup_bomb', label: '💥 Popup' },
  { id: 'cursor_wobble', label: '🌀 Wobble' },
  { id: 'fake_lag', label: '🥶 Fake Lag' },
  { id: 'rick_roll', label: '🎵 Rick Roll' },
]

export function PlayerList({ players, mySocketId, onSendTrap }: Props) {
  const others = players.filter(p => p.socketId !== mySocketId)

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto flex-shrink-0">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
        Online ({players.length})
      </h3>
      {others.length === 0 ? (
        <p className="text-gray-500 text-sm">No other players online.</p>
      ) : (
        others.map(player => (
          <div key={player.id} className="mb-4">
            <div className="text-white font-semibold text-sm mb-2">{player.username}</div>
            <div className="grid grid-cols-2 gap-1">
              {TRAPS.map(trap => (
                <button
                  key={trap.id}
                  onClick={() => onSendTrap(player.id, trap.id)}
                  className="text-xs py-1 px-2 bg-red-900 hover:bg-red-700 text-red-200 rounded transition-colors"
                >
                  {trap.label}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
