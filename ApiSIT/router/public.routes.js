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

const publicRouter = Router()

publicRouter.post('/sit/login', userController.login)
publicRouter.post('/sit/register', userController.create)
publicRouter.post('/sit/send-email', PasswordResetTokenController.sendResetEmail)
publicRouter.post('/sit/reset/:token', PasswordResetTokenController.resetPassword)
publicRouter.post('/sit/session/refresh-token', refreshAuthMiddleware, userController.refreshAccessToken)
publicRouter.post('/sit/session/logout', refreshAuthMiddleware, userController.logout)
publicRouter.post('/sit/atraccion/listar', attractionController.findAll)
publicRouter.post('/sit/transporte/listar', TransportController.findAll)
publicRouter.post('/sit/multimedia/listar', MultimediaController.findAll)
publicRouter.post('/sit/educacion-turistica/listar', EducationalResourceController.findAll)
publicRouter.post('/sit/info-legal-regulatoria/listar', LegalInfoController.findAll)
publicRouter.post('/sit/zona-riesgo/listar', RiskZoneController.findAll)
publicRouter.post('/sit/sitio-arqueologico/listar', ArchaeologicalSiteController.findAll)
publicRouter.post('/sit/guia-viaje/listar', TravelDestinationController.findAll)

export default publicRouter
