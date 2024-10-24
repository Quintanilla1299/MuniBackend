import express from 'express'
import EducationalResourceController from '../controllers/educational.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { EducationalResource } from '../models/educational_resource.model.js'

export const educationalRouter = express.Router()
const uploadTransportImages = uploadFiles('educational_resources').array('file', 10)

educationalRouter.post('/agregar-archivo/:id', checkEntityExists(EducationalResource), uploadTransportImages, EducationalResourceController.uploadFiles)
educationalRouter.post('/agregar', EducationalResourceController.create)
educationalRouter.get('/listar', EducationalResourceController.findAll)
educationalRouter.get('/buscar/:id', EducationalResourceController.findOne)
educationalRouter.put('/actualizar/:id', EducationalResourceController.update)
educationalRouter.delete('/eliminar/:id', EducationalResourceController.delete)
