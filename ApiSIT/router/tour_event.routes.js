// routes/tourEventRoutes.js
import { Router } from 'express';
import TourEventController from '../controllers/tour_event.controller.js';
import uploadFiles, { checkEntityExists } from '../images/upload.js';

const tourEventRouter = Router();
const uploadImages = uploadFiles('tour_event').array('images', 10);
// Rutas CRUD para eventos turísticos
tourEventRouter.post(
  '/agregar',
  uploadImages,
  TourEventController.createOrUpdate
);

tourEventRouter.put(
  '/actualizar/:id',
  uploadImages,
  TourEventController.createOrUpdate
);
tourEventRouter.delete('/eliminar/:id', TourEventController.delete); // Eliminar un evento por ID

export default tourEventRouter;
