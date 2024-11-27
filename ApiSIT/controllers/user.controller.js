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
      const token = jwt.sign(claims, secret, { expiresIn: '23h' })

      const refreshTokenData = generateToken(user.user_id, 'refresh')
      await RefreshToken.create(refreshTokenData)

      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          // maxAge: 15 * 60 * 1000 // 15 minutos
          maxAge: 1 * 24 * 60 * 60 * 1000 // 7 días

        })
        .cookie('refresh_token', refreshTokenData.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
          path: '/sit/session/'
        })
        .json({ status: 200, token, claims })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ status: 500, message: 'Internal server error' })
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
        .clearCookie('refresh_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          path: '/sit/session/'
        }) // Elimina el token de refresco
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
    console.log(req.body)
    try {
      const { username, email, password, person } = userSchema.parse(req.body)

      const user = await User.create({ username, email, password }, { transaction })
      console.log(user)
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
      console.log(error)
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error', error })
    }
  }

  async findAll (req, res) {
    try {
      const users = await User.findAll({ include: Person, attributes: { exclude: ['password'] } })
      res.status(200).json({ users })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function findOne asynchronously retrieves a user by their ID and includes related person data,
 * handling errors and returning appropriate responses.
 * @param req - The `req` parameter in the `findOne` function typically represents the request object
 * in an Express.js application. It contains information about the HTTP request that triggered the
 * function, such as request headers, parameters, body, and query parameters. In this specific
 * function, `req.params.id` is used to
 * @param res - The `res` parameter in the `findOne` function is typically used to send a response back
 * to the client who made the request. It is an object that represents the HTTP response that an
 * Express.js route sends when it gets an HTTP request. The `res` object has methods like `res.status
 * @returns If the user is found, the user object is being returned with a status code of 200. If the
 * user is not found, a JSON response with a status code of 404 and a message 'User not found' is being
 * returned. If there is an internal server error, a JSON response with a status code of 500 and a
 * message 'Internal server error' is being returned.
 */
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

  /* The above code is a JavaScript function that searches for a user in a database based on their email
or username. It uses Sequelize ORM to query the database and find a user record where either the
email or username matches the provided identifier. The function is asynchronous and returns a
promise that resolves to the user object if found, including related Person data. */
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

  /**
 * The function `update` asynchronously updates a user's information and associated person record,
 * handling errors and returning appropriate responses.
 * @param req - The `req` parameter in the `update` function is typically the request object that
 * contains information about the HTTP request made to the server. It includes details such as the
 * request body, parameters, headers, and more. In this specific code snippet, `req` is being used to
 * access the request
 * @param res - The `res` parameter in the `update` function is typically used to send a response back
 * to the client who made the request. In this case, it is an HTTP response object that allows you to
 * send a response with status codes, headers, and data back to the client.
 * @returns If the user is found and successfully updated, a JSON response with status code 200 and a
 * message "User updated successfully" along with the updated user object will be returned. If the user
 * is not found, a JSON response with status code 404 and a message "User not found" will be returned.
 * If there are validation errors in the request body, a JSON response with status code 400
 */
  async update (req, res) {
    try {
      console.log('req', req.body)
      const { username, email, person } = userSchema.parse(req.body)
      const user = await User.findByPk(req.params.id)
      console.log(user)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      await user.update({ username, email })

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
        console.log(error.errors)
        return res.status(400).json({ errors: error.errors })
      }
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function deletes a user and associated person record from the database and returns appropriate
 * messages based on the outcome.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, such as request headers,
 * parameters, body, and more. In this context, `req` is likely an Express.js request object passed to
 * the `delete` function
 * @param res - The `res` parameter in the `delete` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object representing the HTTP response
 * that will be sent back to the client after the user deletion operation is completed. The response
 * may include status
 * @returns If the user is not found, the function returns a 404 status with a JSON response { message:
 * 'User not found' }. If an internal server error occurs during the deletion process, the function
 * returns a 500 status with a JSON response { message: 'Internal server error' }. If the user is
 * successfully deleted, the function returns a 200 status with a JSON response { message: '
 */
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
