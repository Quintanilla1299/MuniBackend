import { Op } from 'sequelize'
import { z } from 'zod'
import { User } from '../models/user.model.js'
import { PasswordResetToken } from '../models/password_reset_token.model.js'
import { generateToken } from '../auth.js'
import { getEmailTemplate } from '../templates/template.js'
import { sendEmail } from '../utils/email.util.js'

/* The line `const passwordSchema = z.string().min(10, 'Password must be at least 10 characters
long').max(100, 'Password must be less than 100 characters')` is defining a schema using the Zod
library for validating password strings. */
const passwordSchema = z.string().min(10, 'Password must be at least 10 characters long').max(100, 'Password must be less than 100 characters')

class PasswordResetTokenController {
/**
 * The function `sendResetEmail` sends a password reset email to a user with a generated token for
 * resetting their password.
 * @param req - req is the request object that contains information about the HTTP request made by the
 * client, such as request headers, parameters, body, and more. In this specific function, the req
 * object is used to extract the email from the request body to send a password reset email to the user
 * associated with that email
 * @param res - The `res` parameter in the `sendResetEmail` function is typically used to send a
 * response back to the client making the request. In this case, it is an HTTP response object that
 * allows you to send a response with a status code and data back to the client.
 * @returns The `sendResetEmail` function returns a response with status code and message in JSON
 * format. If the user is not found, it returns a 404 status with a message 'Usuario no encontrado'. If
 * the email is successfully sent, it returns a 200 status with a message 'Correo de restablecimiento
 * enviado'. If there is an error during the process, it returns a 500 status with
 */
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

  /**
 * The function `resetPassword` handles the process of resetting a user's password by validating a
 * reset token, checking password criteria, updating the password, and handling potential errors.
 * @param req - The `req` parameter in the `resetPassword` function stands for the request object. It
 * contains information about the HTTP request made to the server, including data sent in the request
 * body, parameters, headers, etc. In this function, `req.body` is used to access data sent in the
 * @param res - The `res` parameter in the `resetPassword` function is the response object in Node.js
 * Express framework. It is used to send a response back to the client making the request. In this
 * function, `res` is used to send different HTTP status codes and JSON responses based on the outcome
 * of
 * @returns The `resetPassword` function returns JSON responses based on different scenarios:
 * - If the token is invalid or expired: `{ status: 400, message: 'Token inválido o expirado' }` with
 * status code 400.
 * - If the new passwords do not match: `{ status: 400, message: 'Las contraseñas no coinciden' }` with
 * status code
 */
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
