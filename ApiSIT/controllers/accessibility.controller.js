import { Accessibility } from '../models/accessibility.model.js'
import { accessibilitySchema } from './schema/accessibility.schema.js'
import { sequelize } from '../db/database.js'
import { z } from 'zod'

class AccessibilityController {
  async create (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const data = accessibilitySchema.parse(req.body)
      // console.log('jojo', accessibilitySchema.parse(req.body))
      const newAccessibility = await Accessibility.create(data, { transaction })
      // console.log('data:', data)
      // console.log('newAccessibility:', newAccessibility)

      await transaction.commit()
      res.status(201).json({ message: 'Accessibility created successfully', newAccessibility })
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        console(res.status(400).json({ errors: error.errors }))
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const data = accessibilitySchema.parse(req.body)
      const id = req.params.id

      const accessibility = await Accessibility.findByPk(id, { transaction })

      if (!accessibility) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Accessibility information not found' })
      }
      await accessibility.update(data, { transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Accessibility updated successfully', accessibility })
    } catch (error) {
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findAll (req, res) {
    try {
      const accessibilityList = await Accessibility.findAll()
      res.status(200).json(accessibilityList)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findOne (req, res) {
    try {
      const { id } = req.params
      const accessibility = await Accessibility.findByPk(id)

      if (accessibility) {
        res.status(200).json(accessibility)
      } else {
        res.status(404).json({ message: 'Accessibility information not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const { id } = req.params
      const deleted = await Accessibility.destroy({ where: { id }, transaction })

      if (deleted) {
        await transaction.commit()
        res.status(200).json({ message: 'Accessibility information deleted successfully' })
      } else {
        await transaction.rollback()
        res.status(404).json({ message: 'Accessibility information not found' })
      }
    } catch (error) {
      await transaction.rollback()
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new AccessibilityController()
