import { Router } from 'express'
import userController from '../controllers/user.controller.js'

export const userRouter = Router()

userRouter.get('/listar', userController.findAll)

userRouter.get('/buscar/:id', userController.findOne)

userRouter.put('/actualizar/:id', userController.update)

userRouter.delete('/eliminar/:id', userController.delete)
