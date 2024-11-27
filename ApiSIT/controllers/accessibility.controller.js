/* The `import` statements at the beginning of the code snippet are used to import various modules and
dependencies required for the `AccessibilityController` class to function properly. Here is a
breakdown of what each import statement is doing: */
import { Accessibility } from '../models/accessibility.model.js'
import { accessibilitySchema } from './schema/accessibility.schema.js'
import { sequelize } from '../db/database.js'
import { z } from 'zod'

/* The `class AccessibilityController {` is defining a JavaScript class named
`AccessibilityController`. This class contains methods for handling CRUD (Create, Read, Update,
Delete) operations related to accessibility records in a database. The class encapsulates functions
like creating a new accessibility record, updating an existing record, finding all records, finding
a specific record by ID, and deleting a record. */
class AccessibilityController {
/**
 * The function creates a new accessibility record using data from the request body, handling errors
 * and transactions in the process.
 * @param req - The `req` parameter in the `create` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client, such as the request
 * headers, parameters, body, and more. In this specific context, it seems like `req` is being used to
 * extract the request
 * @param res - The `res` parameter in the `create` function is an object representing the HTTP
 * response that will be sent back to the client. It allows you to send data, set status codes, and
 * perform other actions related to responding to the client's request. In the provided code snippet,
 * `res`
 * @returns The `create` function is returning a response based on the outcome of creating a new
 * accessibility record in the database. Here is the breakdown of the possible return scenarios:
 */
  async create (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const data = accessibilitySchema.parse(req.body)
      const newAccessibility = await Accessibility.create(data, { transaction })

      await transaction.commit()
      res.status(201).json({ message: 'Accessibility created successfully', newAccessibility })
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        console(res.status(400).json({ errors: error.errors }))
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * This JavaScript function updates accessibility information in a database transaction and handles
 * errors appropriately.
 * @param req - The `req` parameter in the `update` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and other details. In this specific function, `req` is used to parse the
 * request body
 * @param res - The `res` parameter in the `update` function is an object representing the HTTP
 * response that the server sends back to the client. It allows you to send data, set status codes, and
 * control the response that the client receives after a request is made to the server. In the provided
 * code snippet
 * @returns If the `update` function is successful, it will return a JSON response with a status of 200
 * and a message stating "Accessibility updated successfully", along with the updated accessibility
 * data.
 */
  async update (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const data = accessibilitySchema.parse(req.body)
      const id = req.params.id

      const accessibility = await Accessibility.findByPk(id, { transaction })

      if (!accessibility) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Accessibility information not found' })
      }
      await accessibility.update(data, { transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Accessibility updated successfully', accessibility })
    } catch (error) {
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The `findAll` function asynchronously retrieves a list of accessibility items and sends it as a JSON
 * response, handling errors with a 500 status code if necessary.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that was made, such as the request headers, parameters,
 * body, and more. In this context, it is likely being used to handle incoming requests to the
 * `findAll` function.
 * @param res - The `res` parameter in the `findAll` function is typically used to send a response back
 * to the client making the request. In this case, it is being used to send a JSON response with the
 * accessibility list data when the data is successfully retrieved, or an error message with status
 * code 500
 */
  async findAll (req, res) {
    try {
      const accessibilityList = await Accessibility.findAll()
      res.status(200).json(accessibilityList)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function `findOne` retrieves accessibility information by ID and returns it in a JSON response,
 * handling errors appropriately.
 * @param req - The `req` parameter in the `findOne` function typically represents the request object,
 * which contains information about the HTTP request that was made. This object includes properties
 * such as the request headers, parameters, body, and other relevant data sent by the client to the
 * server. In this specific function, `
 * @param res - The `res` parameter in the `findOne` function is the response object that is used to
 * send a response back to the client making the request. It is typically used to set the HTTP status
 * code and send data back in the response body. In the provided code snippet, `res` is used
 */
  async findOne (req, res) {
    try {
      const { id } = req.params
      const accessibility = await Accessibility.findByPk(id)

      if (accessibility) {
        res.status(200).json(accessibility)
      } else {
        res.status(404).json({ message: 'Accessibility information not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * This function deletes accessibility information based on the provided ID and handles transactional
 * operations in case of success or failure.
 * @param req - The `req` parameter in the `delete` function is an object representing the HTTP
 * request. It contains information about the request made to the server, such as the request headers,
 * body, parameters, and other details. In this specific function, `req.params` is used to extract the
 * `id
 * @param res - The `res` parameter in the `delete` function is an object representing the HTTP
 * response that the server sends back to the client. It allows you to send data, set status codes, and
 * more in response to a client's request. In the provided code snippet, `res` is used to
 */
  async delete (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const { id } = req.params
      const deleted = await Accessibility.destroy({ where: { id }, transaction })

      if (deleted) {
        await transaction.commit()
        res.status(200).json({ message: 'Accessibility information deleted successfully' })
      } else {
        await transaction.rollback()
        res.status(404).json({ message: 'Accessibility information not found' })
      }
    } catch (error) {
      await transaction.rollback()
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

/* The statement `export default new AccessibilityController()` is exporting an instance of the
`AccessibilityController` class as the default export of the module. This means that when another
module imports this module, it will receive this specific instance of the `AccessibilityController`
class as the default export. */
export default new AccessibilityController()
