import { RefreshToken } from '../models/refresh_token.model.js'
import { Notification } from '../models/notification.model.js' // Asegúrate de que la ruta sea correcta
import { Op } from 'sequelize'

const batchSize = 1000
setInterval(async () => {
  try {
    const expiredTokens = await RefreshToken.findAll({
      where: {
        expires: { [Op.lt]: new Date() }
      },
      limit: batchSize
    })

    if (expiredTokens.length > 0) {
      await RefreshToken.destroy({
        where: {
          refresh_token_id: expiredTokens.map(RefreshToken => RefreshToken.refresh_token_id)
        }
      })
    }
  } catch (error) {
    console.error('Error cleaning expired tokens:', error)
  }
}, 24 * 60 * 60 * 1000) // Ejecutar una vez al día

setInterval(async () => {
  try {
    // Busca las notificaciones que han sido leídas y que se pueden eliminar
    const readNotifications = await Notification.findAll({
      where: {
        read: true,
        createdAt: { [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Elimina notificaciones leídas que sean más antiguas de 30 días
      },
      limit: batchSize
    })

    if (readNotifications.length > 0) {
      // Elimina las notificaciones leídas encontradas
      await Notification.destroy({
        where: {
          id: readNotifications.map(notification => notification.id) // Suponiendo que el campo de ID es `id`
        }
      })
      console.log(`Eliminadas ${readNotifications.length} notificaciones leídas.`)
    } else {
      console.log('No hay notificaciones leídas para eliminar.')
    }
  } catch (error) {
    console.error('Error eliminando notificaciones leídas:', error)
  }
}, 24 * 60 * 60 * 1000) // Ejecutar una vez al día
