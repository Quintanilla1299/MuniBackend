import { Router } from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';
import uploadFiles from '../images/upload.js';

const establishmentRouter = Router();
const uploadImages = uploadFiles('establishment').array('images', 10);
establishmentRouter.post('/agregar', uploadImages, EstablishmentController.createOrUpdate);
establishmentRouter.put('/actualizar/:id', uploadImages, EstablishmentController.createOrUpdate);
establishmentRouter.delete('/eliminar/:id', EstablishmentController.delete);

export default establishmentRouter;
