import { Contact } from '../models/contact.model.js'
import { contactSchema } from './schema/contact.schema.js'
import { z } from 'zod'

class ContactController {
  async create (req, res) {
    const transaction = await Contact.sequelize.transaction()
    let contact
    try {
      const data = contactSchema.parse(req.body)
      for (const contactData of data.contacts) {
        contact = await Contact.create({ entity_id: data.entity_id, entity_type: 'attraction', ...contactData }, { transaction })
      }

      console.log(data)
      console.log(contact)
      await transaction.commit()
      res.status(201).json({ message: 'Contact created successfully', contact })
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findAll (req, res) {
    try {
      const contacts = await Contact.findAll()
      res.status(200).json(contacts)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findOne (req, res) {
    try {
      const contact = await Contact.findByPk(req.params.id)
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' })
      }
      res.status(200).json(contact)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update (req, res) {
    const transaction = await Contact.sequelize.transaction()
    try {
      const data = contactSchema.parse(req.body)
      const contact = await Contact.findByPk(req.params.id)

      if (!contact) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Contact not found' })
      }

      await contact.update(data, { transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Contact updated successfully', contact })
    } catch (error) {
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete (req, res) {
    const transaction = await Contact.sequelize.transaction()
    try {
      const contact = await Contact.findByPk(req.params.id)
      if (!contact) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Contact not found' })
      }

      await contact.destroy({ transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
      await transaction.rollback()
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new ContactController()
