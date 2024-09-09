import nodemailer from 'nodemailer'
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendEmail = async (email, _subject, _html) => {
  try {
    await emailTransporter.sendMail({
      from: `Sistema de información turística <${process.env.EMAIL_USER}>`,
      to: email,
      subject: _subject,
      text: 'Hola, ingresa a este link para restaurar la contraseña',
      html: _html
    })
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error)
  }
}
