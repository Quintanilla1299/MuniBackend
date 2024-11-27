import { DocumentFile } from '../models/document_file.model.js'
import { documentFileSchema } from './schema/documentFile.schema.js'
import { z } from 'zod'

class DocumentFileController {
/**
 * The function creates a new document by validating the data, saving it, and handling any errors that
 * may occur.
 * @param req - The `req` parameter in the `create` function stands for the request object, which
 * contains information about the HTTP request made to the server. This object includes data such as
 * the request headers, body, parameters, and other details sent by the client to the server. In this
 * context, `req
 * @param res - The `res` parameter in the `create` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object that represents the HTTP response
 * that will be sent back to the client. The response object (`res`) has methods like `status
 * @returns If the data sent in the request body passes validation with Zod, a new document is created
 * and returned with a status of 201 (Created) along with the document data in the response.
 */
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

  /**
 * The `findAll` function retrieves all documents from the `DocumentFile` model including related
 * entities and returns them as JSON response.
 * @param req - req is the request object representing the HTTP request made to the server. It contains
 * information about the request such as the URL, headers, parameters, and body data. In this context,
 * it is used to handle incoming requests to the findAll function.
 * @param res - The `res` parameter in the `findAll` function is the response object that will be used
 * to send the response back to the client. It is typically provided by the Express.js framework in
 * Node.js applications. The `res` object has methods like `res.status()` and `res.json()` that
 * @returns The `findAll` method is returning a list of documents fetched from the `DocumentFile`
 * model, including associations with `relatedEntity1` and `relatedEntity2`. If successful, it will
 * respond with a status of 200 and return the documents in JSON format. If an error occurs during the
 * process, it will respond with a status of 500 and a message indicating the failure to retrieve the
 */
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

  /**
 * The function findOne asynchronously retrieves a document by its ID and includes related entities,
 * returning the document data or an error message.
 * @param req - req is an object representing the HTTP request. It contains information about the
 * request made by the client, such as the parameters, body, headers, and other details. In the
 * provided code snippet, req is used to extract the id parameter from the request URL params using
 * destructuring: `const { id
 * @param res - The `res` parameter in the `findOne` function represents the response object in
 * Node.js. It is used to send a response back to the client who made the request. In this case, the
 * `res` object is used to send JSON responses with status codes and data or error messages based on
 * @returns If the document is found successfully, a response with status code 200 and the document
 * data will be returned. If the document is not found, a response with status code 404 and a message
 * indicating that the document was not found will be returned. If an error occurs during the process
 * of finding the document, a response with status code 500 and a message indicating that there was an
 * error retrieving the
 */
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

  /**
 * This async function updates a document file based on the provided ID and returns appropriate
 * responses for success and error cases.
 * @param req - The `req` parameter in the `update` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and more. In this specific function, `req` is being used to extract the
 * `id
 * @param res - The `res` parameter in the `update` function is typically the response object in
 * Node.js Express framework. It is used to send a response back to the client making the request. In
 * this function, `res` is used to send different HTTP status codes and JSON responses based on the
 * outcome of
 * @returns The `update` function is returning different responses based on the outcome of the update
 * operation:
 */
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

  /**
 * The function deletes a document file based on the provided ID and returns appropriate status codes
 * and messages.
 * @param req - The `req` parameter in the `delete` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, parameters, body, and more. In this specific function, `req.params` is used to extract the
 * `id
 * @param res - The `res` parameter in the `delete` function is the response object that is used to
 * send a response back to the client making the request. It is typically used to set the status code
 * and send data back in the response. In the provided code snippet, `res` is used to send
 * @returns If the document with the specified ID is successfully deleted, a response with status code
 * 204 (No Content) is returned. If the document is not found (not deleted), a response with status
 * code 404 and a message 'Documento no encontrado' is returned. If there is an error during the
 * deletion process, a response with status code 500 and a message 'Error al eliminar el documento'
 */
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
