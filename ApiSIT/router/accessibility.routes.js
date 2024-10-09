import { Router } from 'express'
import AccessibilityController from '../controllers/accessibility.controller.js'

export const accessibilityRouter = Router()

accessibilityRouter.post('/agregar', AccessibilityController.create)
accessibilityRouter.get('/listar', AccessibilityController.findAll)
accessibilityRouter.delete('/eliminar/:id', AccessibilityController.delete)
accessibilityRouter.put('/actualizar/:id', AccessibilityController.update)
accessibilityRouter.get('/buscar/:id', AccessibilityController.findOne)
