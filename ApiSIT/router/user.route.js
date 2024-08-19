import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import { authMiddleware } from '../auth.js'

export const userRouter = Router()

userRouter.post('/login', userController.login)

userRouter.post('/agregar', userController.create)

userRouter.get('/listar', authMiddleware, userController.findAll)

userRouter.get('/buscar/:id', authMiddleware, userController.findOne)

userRouter.put('/actualizar/:id', authMiddleware, userController.update)

userRouter.delete('/eliminar/:id', authMiddleware, userController.delete)
