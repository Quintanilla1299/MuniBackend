/* The `import` statements at the beginning of the code snippet are used to import various modules and
classes that are required for the functionality of the `AttractionController` class. Here is a
breakdown of what each import statement is doing: */
import { Attraction } from '../models/attraction.model.js'
import { attractionSchema } from './schema/attraction.schema .js'
import { Contact } from '../models/contact.model.js'
import { Image } from '../models/image.model.js'
import { z } from 'zod'
import path from 'path'
import fs from 'fs'

class AttractionController {
/**
 * The function creates a new attraction by parsing the request body, handling any validation errors,
 * and returning a success or error response accordingly.
 * @param req - The `req` parameter in the `create` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client, such as the request
 * headers, parameters, body, and more. In this specific context, it seems like `req` is being used to
 * access the request
 * @param res - The `res` parameter in the `create` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object representing the HTTP response
 * that will be sent back to the client. The response object (`res`) has methods like `status`
 * @returns If the error is an instance of z.ZodError, the function will return a JSON response with
 * status code 400 and an object containing the validation errors. If the error is not an instance of
 * z.ZodError, the function will log the error and return a JSON response with status code 500 and a
 * message indicating an internal server error.
 */
  async create (req, res) {
    try {
      const data = attractionSchema.parse(req.body)
      const attraction = await Attraction.create(data)
      res.status(201).json({ message: 'Attraction created successfully', attraction })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ errors: error.errors })
      }
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function `uploadImages` handles the uploading of images for a specific attraction, storing them
 * in the database and returning appropriate responses based on the outcome.
 * @param req - The `req` parameter in the `uploadImages` function is the request object, which
 * contains information about the HTTP request made to the server. It includes details such as request
 * headers, parameters, body, files (in this case for image uploads), and more. The `req` object is
 * typically
 * @param res - The `res` parameter in the `uploadImages` function is the response object that will be
 * used to send back the response to the client making the request. It is typically used to set the
 * status code, send data, or handle errors in the response.
 * @returns The `uploadImages` function returns different responses based on the scenario:
 */
  async uploadImages (req, res) {
    try {
      const attractionId = req.params.id
      const files = req.files
      const attraction = await Attraction.findByPk(attractionId)
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      if (files) {
        try {
          for (const file of files) {
            await Image.create({ entity_id: attractionId, entity_type: 'attraction', filename: file.filename })
          }
          res.status(200).json({ message: 'Images uploaded successfully' })
        } catch (imageError) {
          console.error('Error saving images:', imageError)
          return res.status(500).json({ message: 'Failed to save images', error: imageError.message })
        }
      } else {
        console.log('No images uploaded')
        res.status(400).json({ message: 'No images uploaded' })
      }
    } catch (error) {
      console.log('error')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The `findAll` function asynchronously retrieves all attractions with their associated contact and
 * image data and sends a JSON response, handling errors by logging them and sending a 500 status code
 * with a message.
 * @param req - The `req` parameter in the `findAll` function typically represents the request object,
 * which contains information about the incoming HTTP request such as headers, parameters, body, and
 * more. It is commonly used to access data sent by the client to the server.
 * @param res - The `res` parameter in the `findAll` function is typically used to send a response back
 * to the client making the request. In this case, it is an object representing the HTTP response that
 * will be sent back to the client. The response object (`res`) has methods like `status()` to
 */
  async findAll (req, res) {
    try {
      const attractions = await Attraction.findAll({
        include: [Contact, Image]
      })
      res.status(200).json(attractions)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function findOne asynchronously retrieves an attraction by its ID and includes related contact
 * and image information, returning the attraction if found or an error message if not.
 * @param req - The `req` parameter in the `findOne` function typically represents the request object,
 * which contains information about the HTTP request that triggered the function. This object includes
 * properties such as request headers, parameters, query strings, and the request body. In this
 * specific function, `req.params.id` is used
 * @param res - The `res` parameter in the `findOne` function is the response object that is used to
 * send a response back to the client making the request. It is typically provided by the Express
 * framework in Node.js and contains methods like `res.status()` and `res.json()` to set the HTTP
 * status code
 * @returns If the attraction is found, it will be returned with a status code of 200. If the
 * attraction is not found, a message 'Attraction not found' will be returned with a status code of
 * 404. If there is an internal server error, a message 'Internal server error' will be returned with a
 * status code of 500.
 */
  async findOne (req, res) {
    try {
      const attraction = await Attraction.findByPk(req.params.id, {
        include: [Contact, Image]
      })
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }
      res.status(200).json(attraction)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function `update` in this JavaScript code updates an attraction entity with new data including
 * contacts and images, handling errors and providing appropriate responses.
 * @param req - The `req` parameter in the provided code snippet is typically an object representing
 * the HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and more. In this context, it is used to extract the data from the
 * request body and parameters
 * @param res - The `res` parameter in the `update` function is the response object that will be used
 * to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In the provided code snippet,
 * `res
 * @returns The `update` function is returning a JSON response based on the outcome of the update
 * operation. Here are the possible return scenarios:
 */
  async update (req, res) {
    try {
      const data = attractionSchema.parse(req.body)
      const id = req.params.id
      const attraction = await Attraction.findByPk(id)

      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      if (data.contacts) {
        await Contact.destroy({ where: { entity_id: id, entity_type: 'attraction' } })
        for (const contactData of data.contacts) {
          await Contact.create({ entity_type: 'attraction', entity_id: id, ...contactData })
        }
      }

      if (data.images) {
        // Elimina las imágenes viejas y sus archivos
        const oldImages = await Image.findAll({ where: { entity_id: id, entity_type: 'attraction' } })
        for (const image of oldImages) {
          const filePath = path.join('images', image.entity_type, image.filename)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
          await image.destroy()
        }

        // Agrega nuevas imágenes
        for (const image of data.images) {
          await Image.create({ entity_id: id, entity_type: 'attraction', filename: image.filename })
        }
      }

      await attraction.update(data)
      res.status(200).json({ message: 'Attraction updated successfully', attraction })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function asynchronously deletes an attraction by its ID and returns a success message or an
 * error message if the attraction is not found or if there is a server error.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This information includes
 * request headers, parameters, body, URL, and more. In the provided code snippet, `req` is used to
 * extract the `id` parameter
 * @param res - The `res` parameter in the `delete` function is typically the response object in
 * Node.js/Express.js. It is used to send a response back to the client making the request. In this
 * function, `res` is used to send JSON responses with status codes such as 404 for "
 * @returns If the attraction is not found, the function will return a response with status 404 and a
 * JSON object containing the message 'Attraction not found'. If the attraction is found and
 * successfully deleted, the function will return a response with status 200 and a JSON object
 * containing the message 'Attraction deleted successfully'. If an error occurs during the process, the
 * function will log the error and return a response
 */
  async delete (req, res) {
    try {
      const attraction = await Attraction.findByPk(req.params.id)
      if (!attraction) {
        return res.status(404).json({ message: 'Attraction not found' })
      }

      await attraction.destroy()
      res.status(200).json({ message: 'Attraction deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
/* The line `export default new AttractionController()` is exporting an instance of the
`AttractionController` class as the default export of the module. This means that when another
module imports this module, they will receive this specific instance of the `AttractionController`
class as the default export. */

export default new AttractionController()
