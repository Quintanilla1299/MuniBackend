import { Image } from '../models/image.model.js'
import { Attraction } from '../models/attraction.model.js'
import path from 'path'
import fs from 'fs'

class ImageController {
/**
 * The function `uploadImages` asynchronously uploads images associated with a specific attraction,
 * handling errors and returning appropriate responses.
 * @param req - The `req` parameter in the `uploadImages` function is typically the request object that
 * represents the HTTP request made to the server. It contains information about the request such as
 * headers, parameters, body, files, etc. In this function, `req` is used to access the parameters
 * (`req
 * @param res - The `res` parameter in the `uploadImages` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In the provided code snippet, `
 * @returns The `uploadImages` function returns different responses based on the outcome of the image
 * upload process:
 */
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

  /**
 * The `deleteImages` function deletes images associated with a specific attraction, both from the file
 * system and the database, based on the provided image IDs.
 * @param req - The `req` parameter in the `deleteImages` function stands for the request object. It
 * contains information about the HTTP request that triggered the function, such as request headers,
 * parameters, body, and more. In this case, it is used to extract the `id` parameter from the route (`
 * @param res - The `res` parameter in the `deleteImages` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data.
 * @returns The `deleteImages` function is returning a JSON response with a success message if the
 * images are deleted successfully. If there is an error during the deletion process, it will return a
 * JSON response with an error message and a status code of 500.
 */
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
