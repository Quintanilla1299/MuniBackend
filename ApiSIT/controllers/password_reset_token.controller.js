import { Op } from 'sequelize'
import { z } from 'zod'
import { User } from '../models/user.model.js'
import { PasswordResetToken } from '../models/password_reset_token.model.js'
import { generateToken } from '../auth.js'
import { getEmailTemplate } from '../templates/template.js'
import { sendEmail } from '../utils/email.util.js'

const passwordSchema = z.string().min(10, 'Password must be at least 10 characters long').max(100, 'Password must be less than 100 characters')

class PasswordResetTokenController {
  async sendResetEmail (req, res) {
    const { email } = req.body

    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }
      const tokenData = generateToken(user.user_id, 'passwordReset')

      await PasswordResetToken.create(tokenData)

      const emailHTMLTemplate = getEmailTemplate({ email: user.email, token: tokenData.token })

      await sendEmail(user.email, 'Restablecer su contraseña', emailHTMLTemplate)

      return res.status(200).json({ status: 200, message: 'Correo de restablecimiento enviado' })
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error)
      return res.status(500).json({ status: 500, message: 'Error al enviar el correo de restablecimiento' })
    }
  }

  async resetPassword (req, res) {
    const { newPassword, newPasswordVerify } = req.body
    const { token } = req.params

    try {
      // Verificar si el token es válido y no ha expirado
      const resetToken = await PasswordResetToken.findOne({
        where: {
          token,
          expires: { [Op.gt]: new Date() } // Asegura que el token no haya expirado
        }
      })

      if (!resetToken) {
        return res.status(400).json({ status: 400, message: 'Token inválido o expirado' })
      }

      if (newPassword !== newPasswordVerify) {
        return res.status(400).json({ status: 400, message: 'Las contraseñas no coinciden' })
      }

      const passwordValidation = passwordSchema.safeParse(newPassword)
      if (!passwordValidation.success) {
        return res.status(400).json({ status: 400, message: passwordValidation.error.errors[0].message })
      }

      const user = await User.findOne({ where: { user_id: resetToken.user_id } })
      if (!user) {
        return res.status(404).json({ status: 404, message: 'Usuario no encontrado' })
      }
      user.password = newPassword
      await user.save()

      await PasswordResetToken.destroy({ where: { token } })

      return res.status(200).json({ status: 200, message: 'Contraseña restablecida con éxito' })
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error)
      return res.status(500).json({ status: 500, message: 'Error al restablecer la contraseña' })
    }
  }
}

export default new PasswordResetTokenController()
