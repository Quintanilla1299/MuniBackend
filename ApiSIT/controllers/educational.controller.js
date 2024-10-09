import { EducationalResource } from '../models/educational_resource.model.js'
import { educationalResourceSchema } from './schema/educationalResource.schema.js'

import { z } from 'zod'

class EducationalResourceController {
  async create (req, res) {
    try {
      const validatedData = educationalResourceSchema.parse(req.body)
      const resource = await EducationalResource.create(validatedData)
      return res.status(201).json({ status: 201, data: resource })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al crear el recurso educativo' })
    }
  }

  async findAll (req, res) {
    try {
      const resources = await EducationalResource.findAll()
      return res.status(200).json({ status: 200, data: resources })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener los recursos educativos' })
    }
  }

  async findOne (req, res) {
    const { id } = req.params
    try {
      const resource = await EducationalResource.findByPk(id)
      if (!resource) {
        return res.status(404).json({ message: 'Recurso educativo no encontrado' })
      }
      return res.status(200).json({ status: 200, data: resource })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener el recurso educativo' })
    }
  }

  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = educationalResourceSchema.parse(req.body)
      const [updated] = await EducationalResource.update(validatedData, {
        where: { id }
      })
      if (!updated) {
        return res.status(404).json({ message: 'Recurso educativo no encontrado' })
      }
      return res.status(200).json({ status: 200, message: 'Recurso educativo actualizado' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar el recurso educativo' })
    }
  }

  async delete (req, res) {
    const { id } = req.params
    try {
      const deleted = await EducationalResource.destroy({
        where: { id }
      })
      if (!deleted) {
        return res.status(404).json({ message: 'Recurso educativo no encontrado' })
      }
      return res.status(204).json() // No content
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar el recurso educativo' })
    }
  }
}

export default new EducationalResourceController()
