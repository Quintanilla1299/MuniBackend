// routes/categoryRoutes.js
import { Router } from 'express';
import CategoryController from '../controllers/category.controller.js';

const categoryRouter = Router();

// Rutas CRUD para categorías
categoryRouter.post('/agregar', CategoryController.create); // Crear una categoría
categoryRouter.put('/actualizar/:id', CategoryController.update); // Actualizar una categoría existente
categoryRouter.delete('/eliminar/:id', CategoryController.delete); // Eliminar una categoría por ID
categoryRouter.get('/listar', CategoryController.findAll); // Obtener todas las categorías

export default categoryRouter;
