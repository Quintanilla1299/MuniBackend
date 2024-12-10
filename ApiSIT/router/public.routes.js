import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import PasswordResetTokenController from '../controllers/password_reset_token.controller.js'
import { refreshAuthMiddleware } from '../auth.js'
import attractionController from '../controllers/attraction.controller.js'
import TransportController from '../controllers/transport.controller.js'
import MultimediaController from '../controllers/multimedia.controller.js'
import EducationalResourceController from '../controllers/educational.controller.js'
import LegalInfoController from '../controllers/info_legal_regulatoria.controller.js'
import RiskZoneController from '../controllers/risk_zone.controller.js'
import ArchaeologicalSiteController from '../controllers/archaeological_site.controller.js'
import TravelDestinationController from '../controllers/travel_destination.controller.js'
import SecurityServiceController from '../controllers/security_service.controller.js'
import EstablishmentController from '../controllers/establishment.controller.js'
import BasicServiceController from '../controllers/basic_service.controller.js'
import TourEventController from '../controllers/tour_event.controller.js'
import WeatherController from '../controllers/weather.controller.js'
const publicRouter = Router()

publicRouter.post('/sit/login', userController.login)
publicRouter.post('/sit/register', userController.create)
publicRouter.post('/sit/send-email', PasswordResetTokenController.sendResetEmail)
publicRouter.post('/sit/reset/:token', PasswordResetTokenController.resetPassword)
publicRouter.post('/sit/session/refresh-token', refreshAuthMiddleware, userController.refreshAccessToken)
publicRouter.post('/sit/session/logout', refreshAuthMiddleware, userController.logout)
publicRouter.get('/sit/public/atraccion/listar', attractionController.findAll)
publicRouter.get('/sit/public/transporte/listar', TransportController.findAll)
publicRouter.get('/sit/public/multimedia/listar', MultimediaController.findAll)
publicRouter.get('/sit/public/educacion-turistica/listar', EducationalResourceController.findAll)
publicRouter.get('/sit/public/info-legal-regulatoria/listar', LegalInfoController.findAll)
publicRouter.get('/sit/public/zona-riesgo/listar', RiskZoneController.findAll)
publicRouter.get('/sit/public/sitio-arqueologico/listar', ArchaeologicalSiteController.findAll)
publicRouter.get('/sit/public/guia-viaje/listar', TravelDestinationController.findAll)
publicRouter.get('/sit/servicios-seguridad/listar', SecurityServiceController.findAll); // Obtener todos los servicios de seguridad
publicRouter.get('/sit/establecimientos/listar', EstablishmentController.findAll);
publicRouter.get('/sit/servicios-basicos/listar', BasicServiceController.findAll); // Obtener todos los servicios básicos
publicRouter.get('/sit/eventos-tours/listar', TourEventController.findAll); // Obtener todos los eventos
publicRouter.get('/sit/obtener-datos-clima', WeatherController.findAll); // Obtener todos los datos del clima

//agrega las rutas despus de aca, es para probar


export default publicRouter
