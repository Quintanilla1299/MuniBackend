// routes/weatherRoutes.js
import { Router } from 'express';
import WeatherController from '../controllers/weather.controller.js';

const weatherRouter = Router();

// Rutas para datos del clima
weatherRouter.post('/actualizar-clima', WeatherController.upsert); // Insertar o actualizar datos del clima
weatherRouter.get('/clima/:id', WeatherController.findOne); // Obtener un registro de clima por ID
weatherRouter.delete('/clima/:id', WeatherController.delete); // Eliminar un registro de clima por ID

export default weatherRouter;
