import { multimediaSchema } from './schema/multimedia.schema.js'
import { MultimediaModel } from '../models/multimedia.model.js'
import { z } from 'zod'

class MultimediaController {
  // Crear un nuevo archivo multimedia
  async create (req, res) {
    try {
      // Extraer los archivos y el cuerpo
      const files = req.files // Asegúrate de que esto sea un array
      const { name, title, description, type } = req.body

      // Verificar si se subieron archivos
      if (!files || files.length === 0) {
        return res.status(400).json({ status: 400, message: 'El archivo es requerido' })
      }

      // Iterar sobre los archivos
      const multimediaEntries = [] // Almacena los registros que se crearán
      for (const file of files) {
        // Validar los datos de req.body con Zod
        const validatedData = multimediaSchema.parse({
          name,
          title,
          description,
          url: `${req.protocol}://${req.get('host')}/images/multimedia/${file.filename}`, // Asegúrate de que 'multimedia' es la carpeta correcta
          type
        })

        console.log(validatedData)

        // Crear el registro en la base de datos
        const multimedia = await MultimediaModel.create({
          title: validatedData.title,
          url: validatedData.url,
          type: validatedData.type,
          name: validatedData.name,
          description: validatedData.description,
          file: file.path // Almacena la ruta del archivo
        })

        multimediaEntries.push(multimedia) // Agregar a la lista de entradas
      }

      return res.status(201).json({ status: 201, data: multimediaEntries })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      console.error('Error al crear el archivo multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al crear el archivo multimedia' })
    }
  }

  // Obtener todos los archivos multimedia
  async findAll (req, res) {
    try {
      const multimediaList = await MultimediaModel.findAll()
      return res.status(200).json({ status: 200, data: multimediaList })
    } catch (error) {
      console.error('Error al obtener los archivos multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener los archivos multimedia' })
    }
  }

  // Obtener un archivo multimedia por ID
  async findOne (req, res) {
    const { id } = req.params
    try {
      const multimedia = await MultimediaModel.findByPk(id)
      if (!multimedia) {
        return res.status(404).json({ status: 404, message: 'Archivo multimedia no encontrado' })
      }
      return res.status(200).json({ status: 200, data: multimedia })
    } catch (error) {
      console.error('Error al obtener el archivo multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener el archivo multimedia' })
    }
  }

  // Actualizar un archivo multimedia
  async update (req, res) {
    const { id } = req.params
    try {
      // Validar los datos con Zod
      const validatedData = multimediaSchema.parse(req.body)

      // Buscar el archivo multimedia por ID
      const multimedia = await MultimediaModel.findByPk(id)
      if (!multimedia) {
        return res.status(404).json({ status: 404, message: 'Archivo multimedia no encontrado' })
      }

      // Actualizar el archivo multimedia
      await multimedia.update(validatedData)
      return res.status(200).json({ status: 200, data: multimedia })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 400, errors: error.errors })
      }
      console.error('Error al actualizar el archivo multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al actualizar el archivo multimedia' })
    }
  }

  // Eliminar un archivo multimedia
  async delete (req, res) {
    const { id } = req.params
    try {
      const multimedia = await MultimediaModel.findByPk(id)
      if (!multimedia) {
        return res.status(404).json({ status: 404, message: 'Archivo multimedia no encontrado' })
      }

      // Eliminar el archivo multimedia
      await multimedia.destroy()
      return res.status(200).json({ status: 200, message: 'Archivo multimedia eliminado con éxito' })
    } catch (error) {
      console.error('Error al eliminar el archivo multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al eliminar el archivo multimedia' })
    }
  }
}

export default new MultimediaController()
