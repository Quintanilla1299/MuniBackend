import { RiskZone } from '../models/risk_zone.model.js'
import { riskZoneSchema } from './schema/risk_zone.schema.js'
import { z } from 'zod'

class RiskZoneController {
  // Crear una nueva zona de riesgo
  async create (req, res) {
    try {
      console.log(req.body)
      const validatedData = riskZoneSchema.parse(req.body)
      console.log(validatedData)
      const riskZone = await RiskZone.create(validatedData)
      return res.status(201).json({ status: 201, data: riskZone })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Error al crear la zona de riesgo' })
    }
  }

  // Obtener todas las zonas de riesgo
  async findAll (req, res) {
    try {
      const riskZones = await RiskZone.findAll()
      return res.status(200).json({ status: 200, data: riskZones })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener las zonas de riesgo' })
    }
  }

  // Obtener una zona de riesgo por su ID
  async findOne (req, res) {
    const { id } = req.params
    try {
      const riskZone = await RiskZone.findByPk(id)
      if (!riskZone) {
        return res.status(404).json({ message: 'Zona de riesgo no encontrada' })
      }
      return res.status(200).json({ status: 200, data: riskZone })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener la zona de riesgo' })
    }
  }

  // Actualizar una zona de riesgo
  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = riskZoneSchema.parse(req.body)
      const [updated] = await RiskZone.update(validatedData, { where: { id } })
      if (!updated) {
        return res.status(404).json({ message: 'Zona de riesgo no encontrada' })
      }
      return res.status(200).json({ status: 200, message: 'Zona de riesgo actualizada' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar la zona de riesgo' })
    }
  }

  // Eliminar una zona de riesgo
  async delete (req, res) {
    const { id } = req.params
    try {
      const deleted = await RiskZone.destroy({ where: { id } })
      if (!deleted) {
        return res.status(404).json({ message: 'Zona de riesgo no encontrada' })
      }
      return res.status(204).json() // No Content
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar la zona de riesgo' })
    }
  }
}

export default new RiskZoneController()
