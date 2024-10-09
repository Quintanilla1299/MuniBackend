import { Router } from 'express'
import ContactController from '../controllers/contact.controller.js'

export const contactRouter = Router()

contactRouter.post('/agregar', ContactController.create)
contactRouter.get('/listar', ContactController.findAll)
contactRouter.delete('/eliminar/:id', ContactController.delete)
contactRouter.put('/actualizar/:id', ContactController.update)
contactRouter.get('/buscar/:id', ContactController.findOne)
