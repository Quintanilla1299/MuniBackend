import express from 'express'
import EducationalResourceController from '../controllers/educational.controller.js'

export const educationalRouter = express.Router()

educationalRouter.post('/agregar', EducationalResourceController.create)
educationalRouter.get('/listar', EducationalResourceController.findAll)
educationalRouter.get('/buscar/:id', EducationalResourceController.findOne)
educationalRouter.put('/actualizar/:id', EducationalResourceController.update)
educationalRouter.delete('/eliminar/:id', EducationalResourceController.delete)
