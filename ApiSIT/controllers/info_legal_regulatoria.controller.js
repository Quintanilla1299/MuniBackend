// controllers/legalInfoController.js
import DocumentFile from '../models/document_file.model.js'
import { InfoLegalRegulatoria } from '../models/info_legal_regulatoria.model.js'
import { legalInfoSchema } from './schema/info_legal_regulatoria.schema.js'
import path from 'path'
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

  static normalizePath (filePath) {
    return filePath.split(path.sep).join('/')
  }

  async findAll (req, res) {
    try {
      const legalInfos = await InfoLegalRegulatoria.findAll({
        include: [DocumentFile]
      })

      // Normalizar la ruta de los archivos
      const normalizedLegalInfos = legalInfos.map(info => {
        if (info.document_files && info.document_files.length > 0) {
          // Normaliza la ruta de cada archivo
          info.document_files = info.document_files.map(file => {
            file.filePath = LegalInfoController.normalizePath(file.filePath)
            return file
          })
        }
        return info
      })

      return res.status(200).json({ status: 200, data: normalizedLegalInfos })
    } catch (error) {
      console.log(error)
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

  async uploadFiles (req, res) {
    try {
      console.log(req.body)
      const id = req.params.id
      const files = req.files
      const ilr = await InfoLegalRegulatoria.findByPk(id)
      console.log(files)
      console.log(ilr)

      if (!ilr) {
        return res.status(404).json({ message: 'not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await DocumentFile.create({ entity_id: id, filename: file.filename, filePath: file.path, fileSize: file.size, fileType: file.mimetype })
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

export default new LegalInfoController()
