import { RefreshToken } from '../models/refresh_token.model.js'
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
