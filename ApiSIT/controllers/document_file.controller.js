import { DocumentFile } from '../models/document_file.model.js'
import { documentFileSchema } from './schema/documentFile.schema.js'
import { z } from 'zod'

class DocumentFileController {
  async create (req, res) {
    try {
      // Validar los datos enviados con Zod
      const validatedData = documentFileSchema.parse(req.body)

      // Guardar el archivo/documento
      const document = await DocumentFile.create(validatedData)
      return res.status(201).json({ status: 201, data: document })
    } catch (error) {
      // Manejar errores de validación
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al crear el documento' })
    }
  }

  async findAll (req, res) {
    try {
      const documents = await DocumentFile.findAll({
        include: [
          // Incluir asociaciones con otras tablas si es necesario
          { association: 'relatedEntity1' },
          { association: 'relatedEntity2' }
        ]
      })
      return res.status(200).json({ status: 200, data: documents })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener los documentos' })
    }
  }

  async findOne (req, res) {
    const { id } = req.params
    try {
      const document = await DocumentFile.findByPk(id, {
        include: [
          // Incluir asociaciones si es necesario
          { association: 'relatedEntity1' },
          { association: 'relatedEntity2' }
        ]
      })
      if (!document) {
        return res.status(404).json({ message: 'Documento no encontrado' })
      }
      return res.status(200).json({ status: 200, data: document })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener el documento' })
    }
  }

  async update (req, res) {
    const { id } = req.params
    try {
      const validatedData = documentFileSchema.parse(req.body)
      const [updated] = await DocumentFile.update(validatedData, {
        where: { id }
      })
      if (!updated) {
        return res.status(404).json({ message: 'Documento no encontrado' })
      }
      return res.status(200).json({ status: 200, message: 'Documento actualizado' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      return res.status(500).json({ status: 500, message: 'Error al actualizar el documento' })
    }
  }

  async delete (req, res) {
    const { id } = req.params
    try {
      const deleted = await DocumentFile.destroy({
        where: { id }
      })
      if (!deleted) {
        return res.status(404).json({ message: 'Documento no encontrado' })
      }
      return res.status(204).json() // No content
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al eliminar el documento' })
    }
  }
}

export default new DocumentFileController()
