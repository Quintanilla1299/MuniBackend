import { Router } from 'express'
import attractionController from '../controllers/attraction.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { Attraction } from '../models/attraction.model.js'

export const attractionRouter = Router()

const uploadAttractionImages = uploadFiles('attraction').array('images', 10)

attractionRouter.post('/agregar', attractionController.create)
attractionRouter.post('/agregar-imagenes/:id', checkEntityExists(Attraction), uploadAttractionImages, attractionController.uploadImages)
attractionRouter.get('/listar', attractionController.findAll)
attractionRouter.delete('/eliminar/:id', attractionController.delete)
attractionRouter.put('/actualizar/:id', attractionController.update)
attractionRouter.get('/buscar/:id', attractionController.findOne)
