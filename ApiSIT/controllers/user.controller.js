import { User } from '../models/user.model.js'
import { Person } from '../models/person.model.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sequelize } from '../db/database.js'
import { z } from 'zod'
import { secret, generateToken } from '../auth.js'
import { userSchema } from './schema/user.schema.js'
import { RefreshToken } from '../models/refresh_token.model.js'

class UserController {
  login = async (req, res) => {
    try {
      const { email, username, password } = req.body
      const identifier = email || username

      const user = await this.getUserByEmailOrUsername(identifier)
      if (!user) {
        return res.status(401).json({ message: 'Invalid username/email or password' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username/email or password, no match' })
      }

      const claims = {
        user_id: user.user_id,
        person_id: user.Person.person_id,
        email: user.email,
        username: user.username,
        first_name: user.Person.last_name,
        last_name: user.Person.last_name,
        cedula: user.Person.cedula
      }
      const token = jwt.sign(claims, secret, { expiresIn: '15m' })

      const refreshTokenData = generateToken(user.user_id, 'refresh')
      await RefreshToken.create(refreshTokenData)

      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 // 15 minutos
        })
        .cookie('refresh_token', refreshTokenData.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
          path: '/sit/session/'
        })
        .json({ token, claims })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async logout (req, res) {
    try {
      const refreshToken = req.cookies.refresh_token
      console.log(req.cookies.refresh_token)
      if (refreshToken) {
        await RefreshToken.destroy({ where: { token: refreshToken } })
      }

      res
        .clearCookie('access_token') // Elimina el token de acceso
        .clearCookie('refresh_token') // Elimina el token de refresco
        .status(200)
        .json({ message: 'Logout successful' })
    } catch (error) {
      console.error('Error during logout:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  refreshAccessToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided' })
      }

      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
        include: [{
          model: User,
          include: [Person]
        }]
      })

      if (!storedToken || storedToken.expires < new Date()) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' })
      }

      // Generar nuevo access token
      const newAccessToken = jwt.sign({
        user_id: storedToken.User.user_id,
        person_id: storedToken.User.Person.person_id,
        email: storedToken.User.email,
        username: storedToken.User.username,
        first_name: storedToken.User.Person.first_name,
        last_name: storedToken.User.Person.last_name,
        cedula: storedToken.User.Person.cedula
      }, secret, { expiresIn: '15m' })

      // Opcional: Regenerar refresh token para mayor seguridad
      await storedToken.destroy()
      const newRefreshTokenData = generateToken(storedToken.User.user_id, 'refresh')
      await RefreshToken.create(newRefreshTokenData)

      res
        .cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 // 15 minutos
        })
        .cookie('refresh_token', newRefreshTokenData.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
          path: '/sit/session/'
        })
        .json({ message: 'Access token refreshed' })
    } catch (error) {
      console.error('Error refreshing access token:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async userInfo (req, res) {
    try {
      const userInfo = {
        user_id: req.auth.user_id,
        person_id: req.auth.person_id,
        email: req.auth.email,
        username: req.auth.username,
        first_name: req.auth.first_name,
        last_name: req.auth.last_name,
        cedula: req.auth.cedula
      }

      res.status(200).json({ userInfo })
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async create (req, res) {
    const transaction = await sequelize.transaction()

    try {
      const { username, email, password, person } = userSchema.parse(req.body)

      const user = await User.create({ username, email, password }, { transaction })

      if (person) {
        try {
          await Person.create({ ...person, user_id: user.user_id }, { transaction })
        } catch (error) {
          console.error('Failed to create person:', error)
          await transaction.rollback()
          return res.status(500).json({ message: 'Failed to create person', error: error.message })
        }
      }
      await transaction.commit()
      res.status(201).json({ message: 'User created successfully', user })
    } catch (error) {
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error', error })
    }
  }

  async findAll (req, res) {
    try {
      const users = await User.findAll({ include: Person })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findOne (req, res) {
    try {
      const user = await User.findByPk(req.params.id, { include: Person })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getUserByEmailOrUsername = async (identifier) => {
    console.log(identifier)
    return await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      },
      include: [Person]
    })
  }

  async update (req, res) {
    try {
      const { username, email, password, person } = userSchema.parse(req.body)
      const user = await User.findByPk(req.params.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const updateData = { username, email }
      if (password) {
        updateData.password = password // La encriptación se maneja en el hook del modelo
      }

      await user.update({ username, email, password })

      if (person) {
        const personRecord = await Person.findOne({ where: { user_id: user.user_id } })
        if (personRecord) {
          await personRecord.update(person)
        } else {
          await Person.create({ ...person, user_id: user.user_id })
        }
      }

      res.status(200).json({ message: 'User updated successfully', user })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete (req, res) {
    try {
      const user = await User.findByPk(req.params.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      await Person.destroy({ where: { user_id: user.user_id } })

      await user.destroy()
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new UserController()
