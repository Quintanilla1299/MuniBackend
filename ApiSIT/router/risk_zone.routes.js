import { Router } from 'express'
import RiskZoneController from '../controllers/risk_zone.controller.js'

export const RiskZoneRouter = Router()

RiskZoneRouter.post('/agregar', RiskZoneController.create) // Crear
RiskZoneRouter.get('/listar', RiskZoneController.findAll) // Obtener todas
RiskZoneRouter.get('/buscar/:id', RiskZoneController.findOne) // Obtener una por ID
RiskZoneRouter.put('/actualizar/:id', RiskZoneController.update) // Actualizar
RiskZoneRouter.delete('/eliminar/:id', RiskZoneController.delete) // Eliminar
