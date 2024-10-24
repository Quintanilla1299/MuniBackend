import DocumentFile from '../models/document_file.model.js'
import { EducationalResource } from '../models/educational_resource.model.js'
import { educationalResourceSchema } from './schema/educationalResource.schema.js'

import { z } from 'zod'

class EducationalResourceController {
  async create (req, res) {
    try {
      console.log(req.body)
      const validatedData = educationalResourceSchema.parse(req.body)
      console.log(validatedData)
      const resource = await EducationalResource.create(validatedData)
      return res.status(201).json({ status: 201, data: resource })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      console.log(error)
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

  async uploadFiles (req, res) {
    try {
      const id = req.params.id
      const files = req.files
      const attraction = await EducationalResource.findByPk(id)
      if (!attraction) {
        return res.status(404).json({ message: 'not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await DocumentFile.create({ entity_id: id, filename: file.filename })
          }
          res.status(200).json({ message: 'uploaded successfully' })
        } catch (imageError) {
          console.error('Error saving:', imageError)
          return res.status(500).json({ message: 'Failed to save', error: imageError.message })
        }
      } else {
        console.log('No uploaded')
        res.status(400).json({ message: 'No uploaded' })
      }
    } catch (error) {
      console.log('error')
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new EducationalResourceController()
