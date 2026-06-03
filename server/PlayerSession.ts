export interface Player {
  id: string
  username: string
  socketId: string
  connectedAt: number
}

export class PlayerSessionManager {
  private players: Map<string, Player> = new Map()

  addPlayer(socketId: string, username: string): Player {
    const player: Player = {
      id: socketId,
      username,
      socketId,
      connectedAt: Date.now(),
    }
    this.players.set(socketId, player)
    return player
  }

  removePlayer(socketId: string): void {
    this.players.delete(socketId)
  }

  getPlayer(socketId: string): Player | undefined {
    return this.players.get(socketId)
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  getOnlineCount(): number {
    return this.players.size
  }
}
