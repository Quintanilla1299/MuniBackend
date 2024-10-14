import express from 'express'
import LegalInfoController from '../controllers/info_legal_regulatoria.controller.js'

export const infoLegalRegualatoriaRouter = express.Router()

infoLegalRegualatoriaRouter.post('/agregar', LegalInfoController.create)
infoLegalRegualatoriaRouter.get('/listar', LegalInfoController.findAll)
infoLegalRegualatoriaRouter.get('/buscar/:id', LegalInfoController.findOne)
infoLegalRegualatoriaRouter.put('/actualizar/:id', LegalInfoController.update)
infoLegalRegualatoriaRouter.delete('/eliminar/:id', LegalInfoController.delete)
