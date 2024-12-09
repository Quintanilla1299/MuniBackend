// routes/ownerRoutes.js
import { Router } from 'express';
import OwnerController from '../controllers/owner.controller.js';

const ownerRouter = Router();

// Rutas CRUD para propietarios
ownerRouter.post('/agregar', OwnerController.create); // Crear un propietario
ownerRouter.put('/actualizar/:id', OwnerController.update); // Actualizar un propietario existente
ownerRouter.delete('/eliminar/:id', OwnerController.delete); // Eliminar un propietario por ID
ownerRouter.get('/listar', OwnerController.findAll); // Obtener todos los propietarios

export default ownerRouter;
