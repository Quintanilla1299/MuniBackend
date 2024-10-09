import { Transport } from '../models/transport.model.js' // Importa el modelo Sequelize
import { transportInfoSchema } from './schema/transport.schema.js' // Importa el esquema de Zod
import { Image } from '../models/image.model.js'
import { z } from 'zod'

class TransportController {
  // Crear un nuevo transporte
  async create (req, res) {
    try {
      console.log(req.body)
      // Validar los datos con Zod
      const validatedData = transportInfoSchema.parse(req.body)

      // Crear el registro en la base de datos
      const transport = await Transport.create(validatedData)

      return res.status(201).json({ status: 201, data: transport })
    } catch (error) {
      // Manejar errores de validación de Zod
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }

      console.error('Error al crear el transporte:', error)
      return res.status(500).json({ status: 500, message: 'Error al crear el transporte' })
    }
  }

  async uploadImages (req, res) {
    try {
      const transportId = req.params.id
      const files = req.files
      const tranport = await Transport.findByPk(transportId)
      if (!tranport) {
        return res.status(404).json({ message: 'Transport not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await Image.create({ entity_id: transportId, entity_type: 'transport', filename: file.filename })
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

  // Obtener todos los transportes
  async findAll (req, res) {
    try {
      const transports = await Transport.findAll({
        include: [Image]
      })
      return res.status(200).json({ status: 200, data: transports })
    } catch (error) {
      console.error('Error al obtener los transportes:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener los transportes' })
    }
  }

  // Obtener un transporte por ID
  async findOne (req, res) {
    const { id } = req.params

    try {
      const transport = await Transport.findByPk(id)

      if (!transport) {
        return res.status(404).json({ status: 404, message: 'Transporte no encontrado' })
      }

      return res.status(200).json({ status: 200, data: transport })
    } catch (error) {
      console.error('Error al obtener el transporte:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener el transporte' })
    }
  }

  // Actualizar un transporte
  async update (req, res) {
    const { id } = req.params

    try {
      // Validar los datos con Zod
      const validatedData = transportInfoSchema.parse(req.body)

      // Buscar el transporte por ID
      const transport = await Transport.findByPk(id)

      if (!transport) {
        return res.status(404).json({ status: 404, message: 'Transporte no encontrado' })
      }

      // Actualizar el transporte
      await transport.update(validatedData)

      return res.status(200).json({ status: 200, data: transport })
    } catch (error) {
      // Manejar errores de validación de Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }

      console.error('Error al actualizar el transporte:', error)
      return res.status(500).json({ status: 500, message: 'Error al actualizar el transporte' })
    }
  }

  // Eliminar un transporte
  async delete (req, res) {
    const { id } = req.params

    try {
      const transport = await Transport.findByPk(id)

      if (!transport) {
        return res.status(404).json({ status: 404, message: 'Transporte no encontrado' })
      }

      // Eliminar el transporte
      await transport.destroy()

      return res.status(200).json({ status: 200, message: 'Transporte eliminado con éxito' })
    } catch (error) {
      console.error('Error al eliminar el transporte:', error)
      return res.status(500).json({ status: 500, message: 'Error al eliminar el transporte' })
    }
  }
}

export default new TransportController()
