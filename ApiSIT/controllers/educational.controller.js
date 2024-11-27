import DocumentFile from '../models/document_file.model.js'
import { EducationalResource } from '../models/educational_resource.model.js'
import { educationalResourceSchema } from './schema/educationalResource.schema.js'
import path from 'path'
import { z } from 'zod'

class EducationalResourceController {
/* The `create` method in the `EducationalResourceController` class is responsible for creating a new
educational resource based on the data provided in the request body. Here's a breakdown of what the
method does: */
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

  static normalizePath (filePath) {
    return filePath.split(path.sep).join('/')
  }

  /**
 * The function `findAll` retrieves educational resources with associated document files, normalizes
 * the file paths, and returns the data in a JSON response.
 * @param req - The `req` parameter in the `findAll` function typically stands for the request object,
 * which contains information about the HTTP request that triggered the function. This object includes
 * details such as the request headers, parameters, body, and more. It is commonly used in web
 * development with frameworks like Express.js in
 * @param res - The `res` parameter in the `findAll` function is the response object that will be used
 * to send a response back to the client making the request. In this case, the function is handling a
 * request to retrieve educational resources and sending a JSON response with the status code and data.
 * @returns The `findAll` method is returning a list of educational resources with their document files
 * included. Each document file's file path is normalized before being returned in the response. If
 * successful, a status of 200 and the normalized educational resources data are returned. If an error
 * occurs, a status of 500 and an error message are returned.
 */
  async findAll (req, res) {
    try {
      const resources = await EducationalResource.findAll(
        { include: [DocumentFile] }
      )

      const normalizedLegalInfos = resources.map(info => {
        if (info.document_files && info.document_files.length > 0) {
          // Normaliza la ruta de cada archivo
          info.document_files = info.document_files.map(file => {
            file.filePath = EducationalResourceController.normalizePath(file.filePath)
            return file
          })
        }
        return info
      })

      return res.status(200).json({ status: 200, data: normalizedLegalInfos })
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Error al obtener los recursos educativos' })
    }
  }

  /**
 * The function findOne asynchronously retrieves an educational resource by its ID and returns it in a
 * JSON response, handling errors appropriately.
 * @param req - The `req` parameter in the `findOne` function is typically an object representing the
 * HTTP request. It contains information about the request made by the client, such as the request
 * headers, parameters, body, and more. In this specific function, `req.params` is used to extract the
 * `id
 * @param res - The `res` parameter in the `findOne` function is typically the response object in
 * Node.js/Express.js. It is used to send a response back to the client making the request. In this
 * function, `res` is used to send JSON responses with status codes and data/messages based on the
 * @returns This function is returning a single educational resource based on the ID provided in the
 * request parameters. If the resource is found, it returns a JSON response with a status of 200 and
 * the resource data. If the resource is not found, it returns a 404 status with a message indicating
 * that the educational resource was not found. If an error occurs during the process, it returns a 500
 * status with
 */
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

  /**
 * This async function updates an educational resource based on the provided data and handles errors
 * accordingly.
 * @param req - The `req` parameter in the `update` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and more. In this specific function, `req` is being used to extract the
 * `id
 * @param res - The `res` parameter in the `update` function is the response object that is used to
 * send a response back to the client who made the request. In this function, the response object is
 * used to send different status codes and messages based on the outcome of the update operation for an
 * educational resource.
 * @returns If the update operation is successful, a response with status code 200 and a message
 * 'Recurso educativo actualizado' is being returned. If the educational resource is not found, a
 * response with status code 404 and a message 'Recurso educativo no encontrado' is being returned. If
 * there are validation errors, a response with status code 400 and the validation errors is being
 * returned.
 */
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

  /**
 * The function deletes an educational resource by its ID and returns appropriate status codes and
 * messages based on the outcome.
 * @param req - The `req` parameter in the `delete` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, parameters, body, and more. In this specific function, `req.params` is used to extract the
 * `id
 * @param res - The `res` parameter in the code snippet refers to the response object in
 * Node.js/Express. It is used to send a response back to the client making the request. In this
 * context, `res` is used to send different HTTP status codes and JSON responses based on the outcome
 * of deleting an
 * @returns If the educational resource with the specified ID is successfully deleted, a 204 status
 * code with an empty JSON response is returned. If the resource is not found, a 404 status code with a
 * message indicating that the resource was not found is returned. If an error occurs during the
 * deletion process, a 500 status code with a message indicating that there was an error deleting the
 * educational resource is returned.
 */
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

  /**
 * The function `uploadFiles` handles the uploading of files, associating them with an educational
 * resource entity in a database, and returns appropriate responses based on the outcome.
 * @param req - The `req` parameter in the `uploadFiles` function is typically an object representing
 * the HTTP request. It contains information sent by the client to the server. This information can
 * include the request body, parameters, headers, and files uploaded through a form.
 * @param res - The `res` parameter in the `uploadFiles` function is the response object that will be
 * used to send back the response to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In the provided code snippet, `
 * @returns If the educational resource with the specified ID is not found, a 404 status with a JSON
 * response { message: 'not found' } will be returned. If there are files to upload, and the upload is
 * successful, a 200 status with a JSON response { message: 'uploaded successfully' } will be returned.
 * If there is an error saving the files, a 500 status with a
 */
  async uploadFiles (req, res) {
    try {
      console.log(req.body)
      const id = req.params.id
      const files = req.files
      const ilr = await EducationalResource.findByPk(id)
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

export default new EducationalResourceController()
