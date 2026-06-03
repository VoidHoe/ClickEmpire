import { io, Socket } from 'socket.io-client'

export type TrapType = 'popup_bomb' | 'cursor_wobble' | 'fake_lag' | 'rick_roll'

export interface OnlinePlayer {
  id: string
  username: string
  socketId: string
  connectedAt: number
}

export type TrapReceivedCallback = (trapType: TrapType, fromUsername: string) => void
export type PlayersUpdateCallback = (players: OnlinePlayer[]) => void

const SERVER_URL = 'http://localhost:3001'

export class SocketClient {
  private socket: Socket
  private onTrapReceived: TrapReceivedCallback
  private onPlayersUpdate: PlayersUpdateCallback

  constructor(onTrapReceived: TrapReceivedCallback, onPlayersUpdate: PlayersUpdateCallback) {
    this.onTrapReceived = onTrapReceived
    this.onPlayersUpdate = onPlayersUpdate
    this.socket = io(SERVER_URL, { autoConnect: false })
    this.registerHandlers()
  }

  private registerHandlers() {
    this.socket.on('trap:received', ({ trapType, fromUsername }: { trapType: TrapType; fromUsername: string }) => {
      this.onTrapReceived(trapType, fromUsername)
    })
    this.socket.on('players:update', (players: OnlinePlayer[]) => {
      this.onPlayersUpdate(players)
    })
  }

  connect(username: string) {
    this.socket.connect()
    this.socket.emit('player:join', username)
  }

  disconnect() {
    this.socket.disconnect()
  }

  sendTrap(toId: string, trapType: TrapType) {
    this.socket.emit('trap:send', { toId, trapType })
  }

  getSocketId(): string {
    return this.socket.id ?? ''
  }
}
