import { Contact } from '../models/contact.model.js'
import { contactSchema } from './schema/contact.schema.js'
import { z } from 'zod'

class ContactController {
/**
 * The function creates contacts using data from the request body within a transaction, handling errors
 * and returning appropriate responses.
 * @param req - The `req` parameter in the `create` function is typically an object representing the
 * HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and other metadata. In this specific code snippet, `req` is being used to
 * access the
 * @param res - The `res` parameter in the `create` function is an object representing the HTTP
 * response that will be sent back to the client. It is typically used to send a response back to the
 * client with the appropriate status code and data. In the provided code snippet, `res` is used to
 * send
 * @returns The `create` function is returning a JSON response with status code 201 if the contact
 * creation is successful. The response includes a message indicating that the contact was created
 * successfully and the details of the created contact. If there is an error during the creation
 * process, it will return a JSON response with status code 400 for validation errors (if the error is
 * an instance of `z.ZodError`)
 */
  async create (req, res) {
    const transaction = await Contact.sequelize.transaction()
    let contact
    try {
      const data = contactSchema.parse(req.body)
      for (const contactData of data.contacts) {
        contact = await Contact.create({ entity_id: data.entity_id, entity_type: 'attraction', ...contactData }, { transaction })
      }

      console.log(data)
      console.log(contact)
      await transaction.commit()
      res.status(201).json({ message: 'Contact created successfully', contact })
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The `findAll` function asynchronously retrieves all contacts and sends them as a JSON response,
 * handling errors with a 500 status code if necessary.
 * @param req - The `req` parameter in the `findAll` function typically represents the request object,
 * which contains information about the HTTP request that was made. This object includes details such
 * as the request method, headers, parameters, and body data. It is commonly used to extract data sent
 * by the client to the server
 * @param res - The `res` parameter in the `findAll` function is typically used to send a response back
 * to the client making the request. In this case, it is an object representing the HTTP response that
 * will be sent back to the client. The `res` object has methods like `status()` to set
 */
  async findAll (req, res) {
    try {
      const contacts = await Contact.findAll()
      res.status(200).json(contacts)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function findOne asynchronously retrieves a contact by its primary key and returns it in a JSON
 * response, handling errors appropriately.
 * @param req - The `req` parameter in the `findOne` function typically represents the request object,
 * which contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, parameters, body, and other details of the incoming request. In this
 * specific function, `req.params.id` is
 * @param res - The `res` parameter in the `findOne` function is the response object that is used to
 * send a response back to the client making the request. It is typically used to set the HTTP status
 * code and send data back in the response body.
 * @returns If the contact is found, it will be returned with a status code of 200. If the contact is
 * not found, a message 'Contact not found' will be returned with a status code of 404. If there is an
 * internal server error, a message 'Internal server error' will be returned with a status code of 500.
 */
  async findOne (req, res) {
    try {
      const contact = await Contact.findByPk(req.params.id)
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' })
      }
      res.status(200).json(contact)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * The function updates a contact record in a database transaction and handles errors appropriately.
 * @param req - The `req` parameter in the `update` function typically represents the HTTP request
 * object, which contains information about the incoming request such as headers, parameters, body,
 * etc. In this context, it is likely an Express.js request object that is being passed to this
 * function when a client sends a request
 * @param res - The `res` parameter in the `update` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object that represents the HTTP response
 * that will be sent back to the client. The response object (`res`) has methods like `res
 * @returns If everything goes smoothly, a successful response with status code 200 and a JSON object
 * containing the message 'Contact updated successfully' along with the updated contact details will be
 * returned.
 */
  async update (req, res) {
    const transaction = await Contact.sequelize.transaction()
    try {
      const data = contactSchema.parse(req.body)
      const contact = await Contact.findByPk(req.params.id)

      if (!contact) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Contact not found' })
      }

      await contact.update(data, { transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Contact updated successfully', contact })
    } catch (error) {
      await transaction.rollback()
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
 * This asynchronous function deletes a contact by its ID using Sequelize transactions in JavaScript.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, such as request headers,
 * parameters, body, and more. In this context, `req` is likely an Express.js request object that is
 * being used to extract the
 * @param res - The `res` parameter in the `delete` function is typically used to send a response back
 * to the client who made the request. In this case, it is an object representing the HTTP response
 * that will be sent back to the client after the contact deletion operation is completed. The response
 * may include status
 * @returns If the contact is not found, a response with status 404 and a JSON object containing the
 * message 'Contact not found' will be returned. If there is an internal server error during the
 * deletion process, a response with status 500 and a JSON object containing the message 'Internal
 * server error' will be returned. If the contact is successfully deleted, a response with status 200
 * and a JSON object
 */
  async delete (req, res) {
    const transaction = await Contact.sequelize.transaction()
    try {
      const contact = await Contact.findByPk(req.params.id)
      if (!contact) {
        await transaction.rollback()
        return res.status(404).json({ message: 'Contact not found' })
      }

      await contact.destroy({ transaction })
      await transaction.commit()
      res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
      await transaction.rollback()
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new ContactController()
