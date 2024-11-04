import { Router } from 'express'
import notificationController from '../controllers/notification.controller.js'

export const notificationRouter = Router()

// Crear una nueva notificación
notificationRouter.post('/crear', notificationController.create)

// Obtener todas las notificaciones de un usuario específico
notificationRouter.get('/listar', notificationController.findAll)

// Obtener una notificación por ID
notificationRouter.get('/buscar/:id', notificationController.findOne)

// Actualizar una notificación
notificationRouter.put('/actualizar/:id', notificationController.update)

// Eliminar una notificación
notificationRouter.delete('/eliminar/:id', notificationController.delete)

// Marcar una notificación como leída
notificationRouter.put('/marcar-leida/:id', notificationController.markAsRead)
