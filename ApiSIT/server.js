import express, { json } from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import { router } from './router/all.routes.js'
import { sequelize } from './db/database.js'
import './relationships.js'
import { authMiddleware } from './auth.js'
import { } from './jobs/refresh_token.job.js'
import publicRouter from './router/public.routes.js'

export const PORT = process.env.PORT ?? 9000
export const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: '*', credentials: true }), json(), cookieParser())

app.use('/images', express.static(path.join('images')))

app.use(publicRouter)

app.use('/sit', authMiddleware, router)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}/sit`)
  })
})
