import { Router } from 'express'
import TransportController from '../controllers/transport.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { Transport } from '../models/transport.model.js'

export const transportRouter = Router()

const uploadTransportImages = uploadFiles('transport').array('images', 10)

transportRouter.post('/agregar-imagenes/:id', checkEntityExists(Transport), uploadTransportImages, TransportController.uploadImages)

transportRouter.get('/listar', TransportController.findAll)

transportRouter.post('/agregar', TransportController.create)

transportRouter.get('/buscar/:id', TransportController.findOne)

transportRouter.put('/actualizar/:id', TransportController.update)

transportRouter.delete('/eliminar/:id', TransportController.delete)
