import { expressjwt } from 'express-jwt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { RefreshToken } from './models/refresh_token.model.js'

export const secret = process.env.JWT_SECRET

export const authMiddleware = expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: true, // Requiere token en todas las rutas que usan este middleware
  secret
})

export async function decodeToken (token) {
  try {
    return jwt.verify(token, secret)
  } catch (e) {
    console.log('Error al decodificar el token', e)
    return null
  }
}

export const generateToken = (userId, tokenType) => {
  const token = crypto.randomBytes(40).toString('hex')
  let expires
  switch (tokenType) {
    case 'refresh':
      expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expira en 7 días
      break
    case 'passwordReset':
      expires = new Date(Date.now() + 1 * 60 * 60 * 1000) // Expira en 1 hora
      break
    default:
      throw new Error('Tipo de token no soportado')
  }
  return { token, expires, user_id: userId }
}

export const refreshAuthMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' })
  }

  try {
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } })

    if (!storedToken || storedToken.expires < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' })
    }

    req.storedToken = storedToken
    next()
  } catch (error) {
    console.error('Error verifying refresh token:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
