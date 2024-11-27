// controllers/NotificationController.js
import { Notification } from '../models/notification.model.js'
import { notificationSchema } from './schema/notification.schema.js'
import { z } from 'zod'
import { io } from '../server.js'

class NotificationController {
  // Crear una nueva notificación y emitir evento de tiempo real
/**
 * The function creates a new notification, validates the input data, emits the notification in
 * real-time to all connected clients, and returns the created notification or error messages.
 * @param req - The `req` parameter in the `create` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client, such as the request
 * headers, parameters, body, and other relevant data. In this specific context, `req` is being used to
 * access the request body
 * @param res - The `res` parameter in the `create` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object representing the HTTP response
 * that will be sent back to the client.
 * @returns If the `create` function is successful in creating a new notification and emitting it in
 * real-time, a response with status code 201 and the created notification data will be returned.
 */
  async create (req, res) {
    try {
      const validatedData = notificationSchema.parse(req.body)
      const notification = await Notification.create(validatedData)

      // Emitir la notificación en tiempo real
      io.emit('nueva_notificacion', notification) // Emite a todos los clientes conectados

      return res.status(201).json({ status: 201, data: notification })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al crear la notificación' })
    }
  }

  // Obtener todas las notificaciones de un usuario
  async findAll (req, res) {
    try {
      const notifications = await Notification.findAll()
      return res.status(200).json({ status: 200, data: notifications })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Error al obtener las notificaciones' })
    }
  }

  // Obtener una notificación por ID
  async findOne (req, res) {
    const { id } = req.params
    try {
      const notification = await Notification.findByPk(id)
      if (!notification) {
        return res.status(404).json({ status: 404, message: 'Notificación no encontrada' })
      }
      return res.status(200).json({ status: 200, data: notification })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener la notificación' })
    }
  }

  // Actualizar una notificación
  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = notificationSchema.parse(req.body)
      const notification = await Notification.findByPk(id)
      if (!notification) {
        return res.status(404).json({ status: 404, message: 'Notificación no encontrada' })
      }
      await notification.update(validatedData)
      return res.status(200).json({ status: 200, data: notification })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar la notificación' })
    }
  }

  // Eliminar una notificación
  async delete (req, res) {
    const { id } = req.params
    try {
      const notification = await Notification.findByPk(id)
      if (!notification) {
        return res.status(404).json({ status: 404, message: 'Notificación no encontrada' })
      }
      await notification.destroy()
      return res.status(200).json({ status: 200, message: 'Notificación eliminada con éxito' })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar la notificación' })
    }
  }

  /**
 * The function `markAsRead` asynchronously marks a notification as read in a JavaScript application.
 * @param req - The `req` parameter in the `markAsRead` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client. This object includes
 * data such as request headers, parameters, body, query parameters, and more.
 * @param res - The `res` parameter in the `markAsRead` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to set the
 * status code, send data, and end the response.
 * @returns If the notification is found and successfully marked as read, a JSON response with status
 * code 200, a success message 'Notificación marcada como leída', and the updated notification data is
 * returned.
 */
  async markAsRead (req, res) {
    const { id } = req.params

    try {
      const notification = await Notification.findByPk(id)

      // Verificar si la notificación existe
      if (!notification) {
        return res.status(404).json({ status: 404, message: 'Notificación no encontrada' })
      }

      // Actualizar el estado de la notificación
      notification.read = true
      await notification.save()

      return res.status(200).json({ status: 200, message: 'Notificación marcada como leída', data: notification })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Error al marcar la notificación como leída' })
    }
  }
}

export default new NotificationController()
