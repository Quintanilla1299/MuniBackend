// routes/archaeologicalSiteRoutes.js
import { Router } from 'express'
import ArchaeologicalSiteController from '../controllers/archaeological_site.controller.js'
import uploadFiles, { checkEntityExists } from '../images/upload.js'
import { ArchaeologicalSite } from '../models/archaeological_site.model.js'

export const archaeologicalRouter = Router()
const uploadImages = uploadFiles('archaeological_site').array('images', 10)

// Rutas CRUD para el sitio arqueológico
archaeologicalRouter.post('/agregar-imagenes/:id', checkEntityExists(ArchaeologicalSite), uploadImages, ArchaeologicalSiteController.uploadImages)
archaeologicalRouter.get('/listar', ArchaeologicalSiteController.findAll) // Obtener todos los sitios
archaeologicalRouter.get('buscar/:id', ArchaeologicalSiteController.findOne) // Obtener un sitio por ID
archaeologicalRouter.post('/agregar', ArchaeologicalSiteController.create) // Crear un nuevo sitio
archaeologicalRouter.put('actualizar/:id', ArchaeologicalSiteController.update) // Actualizar un sitio existente
archaeologicalRouter.delete('/eliminar/:id', ArchaeologicalSiteController.delete) // Eliminar un sitio por ID
