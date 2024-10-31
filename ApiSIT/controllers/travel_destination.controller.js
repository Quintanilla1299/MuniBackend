import { TravelDestination } from '../models/travel_destination.modelo.js'
import { travelDestinationSchema } from './schema/travel_destination.schema.js'
import { z } from 'zod'

class TravelDestinationController {
  // Crear un nuevo destino de viaje
  async create (req, res) {
    try {
      const validatedData = travelDestinationSchema.parse(req.body)
      const destination = await TravelDestination.create(validatedData)
      return res.status(201).json({ status: 201, data: destination })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Error al crear el destino de viaje' })
    }
  }

  // Obtener todos los destinos de viaje
  async findAll (req, res) {
    try {
      const destinations = await TravelDestination.findAll()
      return res.status(200).json({ status: 200, data: destinations })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener los destinos de viaje' })
    }
  }

  // Obtener un destino de viaje por ID
  async findOne (req, res) {
    const { id } = req.params
    try {
      const destination = await TravelDestination.findByPk(id)
      if (!destination) {
        return res.status(404).json({ status: 404, message: 'Destino de viaje no encontrado' })
      }
      return res.status(200).json({ status: 200, data: destination })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener el destino de viaje' })
    }
  }

  // Actualizar un destino de viaje
  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = travelDestinationSchema.parse(req.body)
      const destination = await TravelDestination.findByPk(id)
      if (!destination) {
        return res.status(404).json({ status: 404, message: 'Destino de viaje no encontrado' })
      }
      await destination.update(validatedData)
      return res.status(200).json({ status: 200, data: destination })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar el destino de viaje' })
    }
  }

  // Eliminar un destino de viaje
  async delete (req, res) {
    const { id } = req.params
    try {
      const destination = await TravelDestination.findByPk(id)
      if (!destination) {
        return res.status(404).json({ status: 404, message: 'Destino de viaje no encontrado' })
      }
      await destination.destroy()
      return res.status(200).json({ status: 200, message: 'Destino de viaje eliminado con éxito' })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar el destino de viaje' })
    }
  }
}

export default new TravelDestinationController()
