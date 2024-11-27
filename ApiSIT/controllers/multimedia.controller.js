import { multimediaSchema } from './schema/multimedia.schema.js'
import { MultimediaModel } from '../models/multimedia.model.js'
import { z } from 'zod'

class MultimediaController {
/**
 * The function `create` handles the creation of multimedia entries by validating data, storing files,
 * and saving records in the database.
 * @param req - The `req` parameter in the `create` function represents the request object in Node.js,
 * typically provided by Express.js or another web framework. It contains information about the
 * incoming HTTP request, such as headers, parameters, body data, and files uploaded through a form.
 * @param res - The `res` parameter in the `create` function is the response object in Node.js Express
 * framework. It is used to send a response back to the client making the request. In this function,
 * `res` is used to send different HTTP responses based on the outcome of the file creation process.
 * @returns The `create` function is handling the creation of multimedia entries based on the request
 * data. If the creation is successful, it returns a response with status 201 and the created
 * multimedia entries in the `data` field. If there are validation errors (handled by Zod), it returns
 * a response with status 400 and the validation errors. If there is any other error during the
 * process, it returns
 */
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
  /**
 * The `findAll` function asynchronously retrieves all multimedia files from the database and returns
 * them as a JSON response.
 * @param req - The `req` parameter in the `findAll` function typically represents the request object,
 * which contains information about the HTTP request that triggered the function. This object includes
 * properties such as the request headers, parameters, body, URL, and more. It is commonly used to
 * access data sent from the client to
 * @param res - The `res` parameter in the code snippet refers to the response object in Node.js. It is
 * used to send a response back to the client making the request. In this case, the `res` object is
 * used to send a JSON response with status code and data or an error message in case
 * @returns The `findAll` method is returning a response with status code 200 and a JSON object
 * containing the status code and the multimedia list data if the operation is successful. If an error
 * occurs, it returns a response with status code 500 and a message indicating the error in obtaining
 * the multimedia files.
 */
  async findAll (req, res) {
    try {
      const multimediaList = await MultimediaModel.findAll()
      return res.status(200).json({ status: 200, data: multimediaList })
    } catch (error) {
      console.error('Error al obtener los archivos multimedia:', error)
      return res.status(500).json({ status: 500, message: 'Error al obtener los archivos multimedia' })
    }
  }

  /**
 * The function `findOne` retrieves a multimedia file by its ID and returns it in a JSON response,
 * handling errors appropriately.
 * @param req - The `req` parameter in the `findOne` function typically represents the request object,
 * which contains information about the HTTP request that is being made. This object includes
 * properties such as headers, parameters, body, query parameters, and more, depending on the type of
 * request being made (GET, POST,
 * @param res - The `res` parameter in the `findOne` function is typically the response object in
 * Node.js applications using Express or similar frameworks. It is used to send a response back to the
 * client making the request.
 * @returns This function is an asynchronous function that handles a request to find a multimedia file
 * by its ID.
 */
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

  /**
 * The function `update` asynchronously updates a multimedia file based on the provided data after
 * validating it with Zod schema.
 * @param req - `req` is the request object which contains information about the HTTP request made to
 * the server. It includes data such as request parameters, headers, body, and more. In the provided
 * code snippet, `req` is used to access the parameters sent in the request, specifically the `id`
 * parameter
 * @param res - The `res` parameter in the `update` function is the response object that will be used
 * to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In the provided code snippet,
 * `res
 * @returns If the update operation is successful, a response with status code 200 and the updated
 * multimedia data will be returned. If there are validation errors with the data provided, a response
 * with status code 400 and the validation errors will be returned. If there is an error during the
 * update process, a response with status code 500 and an error message will be returned.
 */
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

  /**
 * The function `delete` asynchronously deletes a multimedia file based on the provided ID and returns
 * appropriate status messages.
 * @param req - The `req` parameter in the provided code snippet is typically an object representing
 * the HTTP request. It contains information about the request made to the server, such as the request
 * headers, parameters, body, URL, and more. In this context, `req` is used to extract the `id`
 * @param res - The `res` parameter in the `delete` function represents the response object in Node.js.
 * It is used to send a response back to the client who made the request. In this function, the `res`
 * object is used to send different HTTP status codes and JSON responses based on the outcome of
 * @returns The `delete` function is an asynchronous function that handles the deletion of a multimedia
 * file based on the provided ID. Here is what is being returned based on different scenarios:
 */
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
