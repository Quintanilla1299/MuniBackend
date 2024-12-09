// routes/basicServiceRoutes.js
import { Router } from 'express';
import BasicServiceController from '../controllers/basic_service.controller.js';
import uploadFiles, { checkEntityExists } from '../images/upload.js';

const basicServiceRouter = Router();
const uploadImages = uploadFiles('basic_service').array('images', 10);

// Rutas CRUD para servicios básicos
// Rutas CRUD para servicios básicos
basicServiceRouter.post('/agregar', uploadImages, BasicServiceController.createOrUpdate); // Crear un nuevo servicio con imágenes
basicServiceRouter.put('/actualizar/:id', uploadImages, BasicServiceController.createOrUpdate); // Actualizar un servicio existente con imágenes
basicServiceRouter.delete('/eliminar/:id', BasicServiceController.delete); // Eliminar un servicio y sus imágenes

export default basicServiceRouter;
