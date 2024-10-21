import { Router } from 'express'
import MultimediaController from '../controllers/multimedia.controller.js'
import uploadFiles from '../images/upload.js'

export const multimediaRouter = Router()

const uploadMultiFiles = uploadFiles('multimedia').array('file', 10)

// Crear un nuevo archivo multimedia
multimediaRouter.post('/agregar', uploadMultiFiles, MultimediaController.create)

// Obtener todos los archivos multimedia
multimediaRouter.get('/listar', MultimediaController.findAll)

// Obtener un archivo multimedia por ID
multimediaRouter.get('/buscar/:id', MultimediaController.findOne)

// Actualizar un archivo multimedia
multimediaRouter.put('/actualizar/:id', MultimediaController.update)

// Eliminar un archivo multimedia
multimediaRouter.delete('/eliminar/:id', MultimediaController.delete)
