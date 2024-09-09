import express, { json } from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import { router } from './router/all.routes.js'
import { sequelize } from './db/database.js'
import './relationships.js'
import { authMiddleware, refreshAuthMiddleware } from './auth.js'
import userController from './controllers/user.controller.js'
import {} from './jobs/refresh_token.job.js'
import PasswordResetTokenController from './controllers/password_reset_token.controller.js'

export const PORT = process.env.PORT ?? 9000
export const app = express()
app.disable('x-powered-by')
app.use(cors({ credentials: true }), json(), cookieParser())

app.use('/images', express.static(path.join('images')))
app.post('/sit/login', userController.login)
app.post('/sit/register', userController.create)

app.post('/sit/send-email', PasswordResetTokenController.sendResetEmail)
app.post('/sit/reset/:token', PasswordResetTokenController.resetPassword)

app.post('/sit/session/refresh-token', refreshAuthMiddleware, userController.refreshAccessToken)
app.post('/sit/session/logout', refreshAuthMiddleware, userController.logout)

app.use('/sit', authMiddleware, router)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}/sit`)
  })
})
