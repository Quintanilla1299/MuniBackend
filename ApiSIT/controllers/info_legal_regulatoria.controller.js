// controllers/legalInfoController.js
import DocumentFile from '../models/document_file.model.js'
import { InfoLegalRegulatoria } from '../models/info_legal_regulatoria.model.js'
import { legalInfoSchema } from './schema/info_legal_regulatoria.schema.js'
import path from 'path'
import { z } from 'zod'

class LegalInfoController {
/**
 * The function creates legal information by validating the request data, creating a new legal info
 * object, and handling any errors that may occur.
 * @param req - The `req` parameter in the `create` function typically represents the HTTP request
 * object, which contains information about the incoming request such as the request headers, body,
 * parameters, and more. In this specific context, it seems like `req` is being used to access the
 * request body (`req.body
 * @param res - The `res` parameter in the `create` function is the response object that is used to
 * send a response back to the client making the request. In this case, the function is handling the
 * creation of legal information and sending a response back to the client based on the outcome of the
 * operation. The
 * @returns The `create` function is returning a response based on the outcome of the try-catch block:
 */
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

  /**
 * The `normalizePath` function in JavaScript converts file paths to use forward slashes.
 * @param filePath - The `filePath` parameter is a string representing a file path that may contain
 * backslashes (`\`) as separators. The `normalizePath` function takes this `filePath` and replaces all
 * backslashes with forward slashes to ensure consistent path formatting.
 * @returns The `normalizePath` function is returning the `filePath` with all occurrences of the
 * platform-specific path separator (`path.sep`) replaced with forward slashes ('/').
 */
  static normalizePath (filePath) {
    return filePath.split(path.sep).join('/')
  }

  /**
 * The function asynchronously retrieves legal information, includes document files, normalizes file
 * paths, and returns the data in a JSON response.
 * @param req - The `req` parameter in the `findAll` function typically stands for the request object,
 * which contains information about the HTTP request that triggered this function. This object includes
 * details such as the request headers, parameters, body, query parameters, and more.
 * @param res - The `res` parameter in the code snippet refers to the response object in
 * Node.js/Express. It is used to send a response back to the client making the request. In this case,
 * `res` is being used to send JSON responses with status codes and data or error messages in case of
 * @returns The `findAll` method is returning a JSON response with a status code and data. If the
 * operation is successful, it returns a status of 200 along with the normalized legal information
 * data. If there is an error, it returns a status of 500 along with an error message indicating the
 * failure to retrieve legal information.
 */
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

  /**
 * The function findOne retrieves legal information by ID and returns it in a JSON response, handling
 * errors appropriately.
 * @param req - The `req` parameter in the `findOne` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client, such as the
 * parameters, body, headers, and more. It is commonly used to extract data sent by the client to the
 * server.
 * @param res - The `res` parameter in the `findOne` function is typically used to send a response back
 * to the client making the request. In this case, it is an object representing the HTTP response that
 * will be sent back to the client. The response object (`res`) has methods like `status()` to
 * @returns If the `InfoLegalRegulatoria` with the specified `id` is found, a JSON response with status
 * code 200 and the data of the legal information will be returned. If the `InfoLegalRegulatoria` is
 * not found, a JSON response with status code 404 and a message indicating that the legal information
 * was not found will be returned. If an error occurs during the process
 */
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

  /**
 * This JavaScript function updates legal information based on the provided ID and returns appropriate
 * status messages.
 * @param req - The `req` parameter in the `update` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and more. In this specific function, `req` is being used to extract the
 * `id
 * @param res - The `res` parameter in the `update` function is the response object that is used to
 * send a response back to the client who made the request. In this function, the response object is
 * used to send different HTTP status codes and messages based on the outcome of the update operation.
 * It is typically
 * @returns The `update` function is returning different responses based on the outcome of the update
 * operation:
 */
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

  /**
 * The function is an asynchronous method that deletes legal information based on the provided ID and
 * returns appropriate status codes and messages.
 * @param req - The `req` parameter in the `delete` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, parameters, body, and more. In this specific function, `req` is used to extract the `id`
 * @param res - The `res` parameter in the code snippet represents the response object in Node.js. It
 * is used to send a response back to the client who made the request. In this context, the `res`
 * object is used to send different HTTP status codes and JSON responses based on the outcome of
 * deleting legal
 * @returns If the information legal with the specified ID is successfully deleted, a 204 status code
 * with an empty JSON response is returned. If the information legal is not found, a 404 status code
 * with a message 'Información legal no encontrada' is returned. If there is an error during the
 * deletion process, a 500 status code with a message 'Error al eliminar la información legal' is
 * returned
 */
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

  /**
 * The function `uploadFiles` handles the uploading of files, associating them with a specific entity
 * in the database, and returns appropriate responses based on the outcome.
 * @param req - The `req` parameter in the `uploadFiles` function is typically an object representing
 * the HTTP request. It contains information sent by the client to the server. This information can
 * include the request body, parameters, headers, and files uploaded through a form.
 * @param res - The `res` parameter in the `uploadFiles` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In this function, the `res
 * @returns The `uploadFiles` function returns different responses based on the conditions:
 */
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
/* `export default new LegalInfoController()` is exporting a new instance of the `LegalInfoController`
class as the default export of the module. This allows other modules to import and use this instance
of the `LegalInfoController` class in their code. By exporting it as the default export, it can be
imported without needing to specify a specific name for the imported object. */

export default new LegalInfoController()
