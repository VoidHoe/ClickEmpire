import { useEffect, useRef, useState } from 'react'
import { GameEngine, GameState, createInitialState } from './engine/GameEngine'
import {
  purchaseBedroomUpgrade,
  getBedroomPassiveIncome,
  getBedroomClickValue,
} from './empires/bedroom/BedroomEmpire'
import {
  startPrestigeChallenge,
  tickPrestigeChallenge,
  isPrestigeChallengeComplete,
  isPrestigeChallengeFailed,
  createPrestigeChallenge,
  calculatePrestigeBonus,
  applyPrestigeBonus,
  PrestigeChallengeState,
} from './empires/bedroom/BedroomPrestige'
import { saveGame, loadGame } from './save/SaveSystem'
import { CurrencyDisplay } from './components/CurrencyDisplay'
import { BedroomScreen } from './screens/BedroomScreen'
import { PrestigeModal } from './components/PrestigeModal'
import { SocketClient, OnlinePlayer } from './multiplayer/SocketClient'
import { PlayerList } from './components/PlayerList'
import { TrapNotification } from './components/TrapNotification'
import { TrapType } from '../server/TrapHandler'

export default function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState)
  const [showPrestige, setShowPrestige] = useState(false)
  const [prestigeChallenge, setPrestigeChallenge] = useState<PrestigeChallengeState>(
    createPrestigeChallenge
  )
  const engineRef = useRef<GameEngine | null>(null)
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([])
  const [incomingTrap, setIncomingTrap] = useState<{ type: TrapType; from: string } | null>(null)
  const [mySocketId, setMySocketId] = useState('')
  const socketRef = useRef<SocketClient | null>(null)

  useEffect(() => {
    let engine: GameEngine

    loadGame().then(saved => {
      const initialState = saved ?? createInitialState()
      engine = new GameEngine(initialState, state => {
        setGameState(state)
        saveGame(state)
      })
      engineRef.current = engine
      engine.start()
      setGameState(initialState)
      const username = `Player_${Math.floor(Math.random() * 9000) + 1000}`
      const client = new SocketClient(
        (trapType, fromUsername) => setIncomingTrap({ type: trapType, from: fromUsername }),
        (players) => setOnlinePlayers(players)
      )
      socketRef.current = client
      client.connect(username)
      setTimeout(() => setMySocketId(client.getSocketId()), 500)
    })

    return () => {
      engine?.stop()
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!prestigeChallenge.active) return

    const interval = setInterval(() => {
      setPrestigeChallenge(prev => {
        const ticked = tickPrestigeChallenge(prev)

        if (isPrestigeChallengeComplete(ticked, gameState.currency)) {
          handlePrestigeSuccess()
          return createPrestigeChallenge()
        }

        if (isPrestigeChallengeFailed(ticked)) {
          alert('Challenge failed! Try again.')
          return createPrestigeChallenge()
        }

        return ticked
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [prestigeChallenge.active, gameState.currency])

  function handlePrestigeSuccess() {
    if (!engineRef.current) return
    const newPrestigeCount = gameState.prestigeCount + 1
    const bonus = calculatePrestigeBonus(newPrestigeCount)
    const freshState = createInitialState()
    freshState.prestigeCount = newPrestigeCount
    freshState.passiveIncome = applyPrestigeBonus(bonus, 0)
    engineRef.current.setState(freshState)
    setGameState(freshState)
    setShowPrestige(false)
    alert(`Prestige ${newPrestigeCount}! You now start with ${bonus.freeMiners} free miners.`)
  }

  function handleSendTrap(toId: string, trapType: TrapType) {
    socketRef.current?.sendTrap(toId, trapType)
  }

  function handlePurchaseUpgrade(upgradeId: string) {
    if (!engineRef.current) return

    if (upgradeId === '__click__') {
      engineRef.current.click()
      return
    }

    const current = engineRef.current.getState()
    const result = purchaseBedroomUpgrade(current.bedroom, upgradeId, current.currency)
    if (!result.success) return

    const newState: GameState = {
      ...current,
      currency: current.currency - result.currencySpent,
      bedroom: result.state,
      passiveIncome: getBedroomPassiveIncome(result.state),
      clickValue: getBedroomClickValue(result.state),
    }
    engineRef.current.setState(newState)
    setGameState(newState)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <CurrencyDisplay
        currency={gameState.currency}
        passiveIncome={gameState.passiveIncome}
        clickValue={gameState.clickValue}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <BedroomScreen
            state={gameState}
            onPurchaseUpgrade={handlePurchaseUpgrade}
            onOpenPrestige={() => setShowPrestige(true)}
          />
        </div>
        <PlayerList
          players={onlinePlayers}
          mySocketId={mySocketId}
          onSendTrap={handleSendTrap}
        />
      </div>
      {showPrestige && (
        <PrestigeModal
          challenge={prestigeChallenge}
          currentCurrency={gameState.currency}
          onStart={() => setPrestigeChallenge(startPrestigeChallenge())}
          onClose={() => setShowPrestige(false)}
        />
      )}
    {incomingTrap && (
        <TrapNotification
          trapType={incomingTrap.type}
          fromUsername={incomingTrap.from}
          onDismiss={() => setIncomingTrap(null)}
        />
      )}
    </div>
  )
}
