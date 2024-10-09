import { Image } from '../models/image.model.js'
import { Attraction } from '../models/attraction.model.js'
import path from 'path'
import fs from 'fs'

class ImageController {
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

  async deleteImages (req, res) {
    try {
      const attractionId = req.params.id
      const imageIds = req.body.imageIds // Recibimos los IDs de las imágenes que se desean eliminar

      const attraction = await Attraction.findByPk(attractionId)
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      const images = await Image.findAll({ where: { id: imageIds, entity_id: attractionId, entity_type: 'attraction' } })

      if (images.length === 0) {
        return res.status(404).json({ message: 'No images found to delete' })
      }

      // Eliminamos los archivos físicos del sistema
      for (const image of images) {
        const filePath = path.join('images', image.entity_type, image.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath) // Elimina el archivo físico
        }
        await image.destroy() // Elimina el registro de la base de datos
      }

      res.status(200).json({ message: 'Images deleted successfully' })
    } catch (error) {
      console.error('Error deleting images:', error)
      res.status(500).json({ message: 'Failed to delete images', error: error.message })
    }
  }
}

export default new ImageController()
