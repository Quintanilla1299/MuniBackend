import { Router } from 'express'
import TravelDestinationController from '../controllers/travel_destination.controller.js'

const travelRouter = Router()

// Crear un nuevo destino de viaje
travelRouter.post('/agregar', TravelDestinationController.create)

// Obtener todos los destinos de viaje
travelRouter.get('/listar', TravelDestinationController.findAll)

// Obtener un destino de viaje por ID
travelRouter.get('/buscar/:id', TravelDestinationController.findOne)

// Actualizar un destino de viaje
travelRouter.put('/actualizar/:id', TravelDestinationController.update)

// Eliminar un destino de viaje
travelRouter.delete('/eliminar/:id', TravelDestinationController.delete)

export default travelRouter
