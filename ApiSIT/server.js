import express, { json } from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import { router } from './router/all.routes.js'
import { sequelize } from './db/database.js'
import './relationships.js'
import { authMiddleware } from './auth.js'
import { } from './jobs/refresh_token.job.js'
import { } from './jobs/cronJobs.js'
import publicRouter from './router/public.routes.js'
import { Server } from 'socket.io'
import http from 'http'

export const PORT = process.env.PORT ?? 9000
export const app = express()

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } })
let connectedUsers = 0;

app.disable('x-powered-by')
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Origen permitido
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}), json(), cookieParser())

app.use('/images', express.static(path.join('images')))

app.use(publicRouter)

app.use('/sit', authMiddleware, router)

// Conexión de socket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)
  connectedUsers++;
  io.emit("connectedUsers", connectedUsers);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
    connectedUsers--;
    io.emit("connectedUsers", connectedUsers);
  })
})

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
  })
})

export { io }
