import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PlayerSessionManager } from './PlayerSession'
import { canSendTrap, recordTrapSent, buildTrapEvent, TrapType } from './TrapHandler'

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

const sessions = new PlayerSessionManager()

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('player:join', (username: string) => {
    const player = sessions.addPlayer(socket.id, username)
    socket.emit('player:joined', player)
    io.emit('players:update', sessions.getAllPlayers())
    console.log(`${username} joined. Online: ${sessions.getOnlineCount()}`)
  })

  socket.on('trap:send', ({ toId, trapType }: { toId: string; trapType: TrapType }) => {
    const sender = sessions.getPlayer(socket.id)
    if (!sender) return

    if (!canSendTrap(socket.id, trapType)) {
      socket.emit('trap:cooldown', { trapType })
      return
    }

    const target = sessions.getPlayer(toId)
    if (!target) return

    recordTrapSent(socket.id, trapType)
    const event = buildTrapEvent(socket.id, sender.username, toId, trapType)
    io.to(target.socketId).emit('trap:received', event)
    socket.emit('trap:sent', event)
  })

  socket.on('disconnect', () => {
    sessions.removePlayer(socket.id)
    io.emit('players:update', sessions.getAllPlayers())
    console.log(`Client disconnected: ${socket.id}`)
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', players: sessions.getOnlineCount() })
})

const PORT = process.env['PORT'] ?? 3001
httpServer.listen(PORT, () => {
  console.log(`ClickEmpire server running on port ${PORT}`)
})
