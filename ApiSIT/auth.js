import { expressjwt } from 'express-jwt'
import jwt from 'jsonwebtoken'

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
