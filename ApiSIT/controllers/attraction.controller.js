import { Attraction } from '../models/attraction.model.js'
import { attractionSchema } from './schema/attraction.schema .js'
import { Contact } from '../models/contact.model.js'
import { Image } from '../models/image.model.js'
import { z } from 'zod'
import path from 'path'
import fs from 'fs'

class AttractionController {
  async create (req, res) {
    try {
      const data = attractionSchema.parse(req.body)
      const attraction = await Attraction.create(data)

      if (data.contacts) {
        try {
          for (const contactData of data.contacts) {
            await Contact.create({ entity_type: 'attraction', entity_id: attraction.attraction_id, ...contactData })
          }
        } catch (contactError) {
          console.error('Error creating contacts:', contactError)
          return res.status(500).json({ message: 'Failed to create contacts', error: contactError.message })
        }
      }

      res.status(201).json({ message: 'Attraction created successfully', attraction })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async uploadImages (req, res) {
    try {
      const attractionId = req.params.id
      const files = req.files

      const attraction = await Attraction.findByPk(attractionId)
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await Image.create({ entity_id: attractionId, entity_type: 'attraction', filename: file.filename })
          }
          res.status(200).json({ message: 'Images uploaded successfully' })
        } catch (imageError) {
          console.error('Error saving images:', imageError)
          return res.status(500).json({ message: 'Failed to save images', error: imageError.message })
        }
      } else {
        res.status(400).json({ message: 'No images uploaded' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findAll (req, res) {
    try {
      const attractions = await Attraction.findAll({
        include: [Contact, Image]
      })
      res.status(200).json(attractions)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async findOne (req, res) {
    try {
      const attraction = await Attraction.findByPk(req.params.id, {
        include: [Contact, Image]
      })
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }
      res.status(200).json(attraction)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update (req, res) {
    try {
      const data = attractionSchema.parse(req.body)
      const id = req.params.id
      const attraction = await Attraction.findByPk(id)

      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      if (data.contacts) {
        await Contact.destroy({ where: { entity_id: id, entity_type: 'attraction' } })
        for (const contactData of data.contacts) {
          await Contact.create({ entity_type: 'attraction', entity_id: id, ...contactData })
        }
      }

      if (data.images) {
        // Elimina las imágenes viejas y sus archivos
        const oldImages = await Image.findAll({ where: { entity_id: id, entity_type: 'attraction' } })
        for (const image of oldImages) {
          const filePath = path.join('images', image.entity_type, image.filename)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
          await image.destroy()
        }

        // Agrega nuevas imágenes
        for (const image of data.images) {
          await Image.create({ entity_id: id, entity_type: 'attraction', filename: image.filename })
        }
      }

      await attraction.update(data)
      res.status(200).json({ message: 'Attraction updated successfully', attraction })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete (req, res) {
    try {
      const attraction = await Attraction.findByPk(req.params.id, {
        include: [Image]
      })

      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      if (attraction.Images.length > 0) {
        for (const image of attraction.Images) {
          const filePath = path.join('images', image.entity_type, image.filename)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }
      }

      await attraction.destroy()
      res.status(200).json({ message: 'Attraction deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new AttractionController()
