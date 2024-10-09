import { Router } from 'express'
import MultimediaController from '../controllers/multimedia.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { MultimediaModel } from '../models/multimedia.model.js'

export const multimediaRouter = Router()

const uploadTransportImages = uploadFiles('multimedia').array('images', 10)

// Crear un nuevo archivo multimedia
multimediaRouter.post('/agregar', uploadTransportImages, checkEntityExists(MultimediaModel), MultimediaController.create)

// Obtener todos los archivos multimedia
multimediaRouter.get('/listar', MultimediaController.findAll)

// Obtener un archivo multimedia por ID
multimediaRouter.get('/buscar/:id', MultimediaController.findOne)

// Actualizar un archivo multimedia
multimediaRouter.put('/actualizar/:id', MultimediaController.update)

// Eliminar un archivo multimedia
multimediaRouter.delete('/eliminar/:id', MultimediaController.delete)
