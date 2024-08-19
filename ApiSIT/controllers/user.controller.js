import { User } from '../models/user.model.js'
import { Person } from '../models/person.model.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userSchema } from './schema/user.schema.js'
import { secret } from '../auth.js'
import { z } from 'zod'

class UserController {
  login = async (req, res) => {
    try {
      const { email, username, password } = userSchema.parse(req.body)
      const identifier = email || username

      const user = await this.getUserByEmailOrUsername(identifier)

      if (!user) {
        return res.status(401).json({ message: 'Invalid username/email or password' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username/email or password' })
      }

      const claims = { sub: user.user_id, email: user.email, name: user.username }
      const token = jwt.sign(claims, secret, { expiresIn: '1h' })
      res.json({ token, user })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async create (req, res) {
    try {
      const { username, email, password, person } = userSchema.parse(req.body)

      const user = await User.create({ username, email, password })

      if (person) {
        try {
          await Person.create({ ...person, user_id: user.user_id })
        } catch (error) {
          console.error('Failed to create person:', error)
          return res.status(500).json({ message: 'Failed to create person', error: error.message })
        }
      }

      res.status(201).json({ message: 'User created successfully', user })
    } catch (error) {
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
      }
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
