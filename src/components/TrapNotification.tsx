import { useEffect } from 'react'
import { TrapType } from '../../server/TrapHandler'

interface Props {
  trapType: TrapType | null
  fromUsername: string
  onDismiss: () => void
}

const TRAP_MESSAGES: Record<TrapType, string> = {
  popup_bomb: '💥 BOOM! Got bombed!',
  cursor_wobble: '🌀 Your cursor is dizzy...',
  fake_lag: '🥶 CONNECTION LOST...',
  rick_roll: '🎵 Never gonna give you up~',
}

export function TrapNotification({ trapType, fromUsername, onDismiss }: Props) {
  useEffect(() => {
    if (!trapType) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [trapType])

  if (!trapType) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-red-900 border-2 border-red-500 rounded-xl p-8 max-w-sm text-center">
        <p className="text-white text-2xl font-bold mb-2">{TRAP_MESSAGES[trapType]}</p>
        <p className="text-red-300 text-sm mb-4">Sent by {fromUsername}</p>
        <button
          onClick={onDismiss}
          className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
