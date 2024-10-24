import express from 'express'
import LegalInfoController from '../controllers/info_legal_regulatoria.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { InfoLegalRegulatoria } from '../models/info_legal_regulatoria.model.js'

export const infoLegalRegualatoriaRouter = express.Router()
const uploadFile = uploadFiles('info_legal_regulatoria').array('file', 10)

infoLegalRegualatoriaRouter.post('/agregar-archivo/:id', checkEntityExists(InfoLegalRegulatoria), uploadFile, LegalInfoController.uploadFiles)
infoLegalRegualatoriaRouter.post('/agregar', LegalInfoController.create)
infoLegalRegualatoriaRouter.get('/listar', LegalInfoController.findAll)
infoLegalRegualatoriaRouter.get('/buscar/:id', LegalInfoController.findOne)
infoLegalRegualatoriaRouter.put('/actualizar/:id', LegalInfoController.update)
infoLegalRegualatoriaRouter.delete('/eliminar/:id', LegalInfoController.delete)
