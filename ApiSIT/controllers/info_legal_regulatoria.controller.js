// controllers/legalInfoController.js
import { InfoLegalRegulatoria } from '../models/info_legal_regulatoria.model.js'
import { legalInfoSchema } from './schema/info_legal_regulatoria.schema.js'
import { z } from 'zod'

class LegalInfoController {
  async create (req, res) {
    try {
      const validatedData = legalInfoSchema.parse(req.body)
      const legalInfo = await InfoLegalRegulatoria.create(validatedData)
      return res.status(201).json({ status: 201, data: legalInfo })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al crear la información legal' })
    }
  }

  async findAll (req, res) {
    try {
      const legalInfos = await InfoLegalRegulatoria.findAll()
      return res.status(200).json({ status: 200, data: legalInfos })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener la información legal' })
    }
  }

  async findOne (req, res) {
    const { id } = req.params
    try {
      const legalInfo = await InfoLegalRegulatoria.findByPk(id)
      if (!legalInfo) {
        return res.status(404).json({ message: 'Información legal no encontrada' })
      }
      return res.status(200).json({ status: 200, data: legalInfo })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener la información legal' })
    }
  }

  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = legalInfoSchema.parse(req.body)
      const [updated] = await InfoLegalRegulatoria.update(validatedData, {
        where: { id }
      })
      if (!updated) {
        return res.status(404).json({ message: 'Información legal no encontrada' })
      }
      return res.status(200).json({ status: 200, message: 'Información legal actualizada' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar la información legal' })
    }
  }

  async delete (req, res) {
    const { id } = req.params
    try {
      const deleted = await InfoLegalRegulatoria.destroy({
        where: { id }
      })
      if (!deleted) {
        return res.status(404).json({ message: 'Información legal no encontrada' })
      }
      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar la información legal' })
    }
  }
}

export default new LegalInfoController()
