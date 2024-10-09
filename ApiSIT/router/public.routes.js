import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import PasswordResetTokenController from '../controllers/password_reset_token.controller.js'
import { refreshAuthMiddleware } from '../auth.js'

const publicRouter = Router()

publicRouter.post('/sit/login', userController.login)
publicRouter.post('/sit/register', userController.create)
publicRouter.post('/sit/send-email', PasswordResetTokenController.sendResetEmail)
publicRouter.post('/sit/reset/:token', PasswordResetTokenController.resetPassword)
publicRouter.post('/sit/session/refresh-token', refreshAuthMiddleware, userController.refreshAccessToken)
publicRouter.post('/sit/session/logout', refreshAuthMiddleware, userController.logout)

export default publicRouter
