import { ArchaeologicalSite } from '../models/archaeological_site.model.js' // Importa el modelo Sequelize
import { archaeologicalSiteSchema } from './schema/archaeological_site.schema.js' // Importa el esquema de Zod
import { Image } from '../models/image.model.js' // Para manejar las imágenes
import { z } from 'zod'

class ArchaeologicalSiteController {
  // Crear un nuevo sitio arqueológico
  async create (req, res) {
    try {
      console.log(req.body)
      // Validar los datos con Zod
      const validatedData = archaeologicalSiteSchema.parse(req.body)

      // Crear el registro en la base de datos
      const site = await ArchaeologicalSite.create(validatedData)

      return res.status(201).json({ status: 201, data: site })
    } catch (error) {
      // Manejar errores de validación de Zod
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }

      console.error('Error al crear el sitio arqueológico:', error)
      return res.status(500).json({ status: 500, message: 'Error al crear el sitio arqueológico' })
    }
  }

  // Obtener todos los sitios arqueológicos
  async findAll (req, res) {
    try {
      const sites = await ArchaeologicalSite.findAll({
        include: [Image]
      })
      return res.status(200).json({ status: 200, data: sites })
    } catch (error) {
      console.error('Error al obtener los sitios arqueológicos:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener los sitios arqueológicos' })
    }
  }

  // Obtener un sitio arqueológico por ID
  async findOne (req, res) {
    const { id } = req.params

    try {
      const site = await ArchaeologicalSite.findByPk(id)

      if (!site) {
        return res.status(404).json({ status: 404, message: 'Sitio arqueológico no encontrado' })
      }

      return res.status(200).json({ status: 200, data: site })
    } catch (error) {
      console.error('Error al obtener el sitio arqueológico:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener el sitio arqueológico' })
    }
  }

  async uploadImages (req, res) {
    try {
      const objectId = req.params.id
      const files = req.files
      const object = await ArchaeologicalSite.findByPk(objectId)
      console.log(files)
      if (!object) {
        return res.status(404).json({ message: ' not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await Image.create({ entity_id: objectId, entity_type: 'archaeological_Site', filename: file.filename })
          }
          res.status(200).json({ message: 'Images uploaded successfully' })
        } catch (imageError) {
          console.error('Error saving images:', imageError)
          return res.status(500).json({ message: 'Failed to save images', error: imageError.message })
        }
      } else {
        console.log('No images uploaded')
        res.status(400).json({ message: 'No images uploaded' })
      }
    } catch (error) {
      console.log('error')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Actualizar un sitio arqueológico
  async update (req, res) {
    const { id } = req.params

    try {
      // Validar los datos con Zod
      const validatedData = archaeologicalSiteSchema.parse(req.body)

      // Buscar el sitio por ID
      const site = await ArchaeologicalSite.findByPk(id)

      if (!site) {
        return res.status(404).json({ status: 404, message: 'Sitio arqueológico no encontrado' })
      }

      // Actualizar el sitio
      await site.update(validatedData)

      return res.status(200).json({ status: 200, data: site })
    } catch (error) {
      // Manejar errores de validación de Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }

      console.error('Error al actualizar el sitio arqueológico:', error)
      return res.status(500).json({ status: 500, message: 'Error al actualizar el sitio arqueológico' })
    }
  }

  // Eliminar un sitio arqueológico
  async delete (req, res) {
    const { id } = req.params

    try {
      const site = await ArchaeologicalSite.findByPk(id)

      if (!site) {
        return res.status(404).json({ status: 404, message: 'Sitio arqueológico no encontrado' })
      }

      // Eliminar el sitio
      await site.destroy()

      return res.status(200).json({ status: 200, message: 'Sitio arqueológico eliminado con éxito' })
    } catch (error) {
      console.error('Error al eliminar el sitio arqueológico:', error)
      return res.status(500).json({ status: 500, message: 'Error al eliminar el sitio arqueológico' })
    }
  }
}

export default new ArchaeologicalSiteController()
