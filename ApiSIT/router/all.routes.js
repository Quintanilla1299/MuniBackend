import { Router } from 'express'
import { userRouter } from './user.routes.js'
import { attractionRouter } from './attraction.routes.js'
import { accessibilityRouter } from './accessibility.routes.js'
import { contactRouter } from './contact.routes.js'
import { transportRouter } from './transport.routes.js'
import { multimediaRouter } from './multimedia.routes.js'
import { educationalRouter } from './educational_resources.routes.js'
import { infoLegalRegualatoriaRouter } from './info_legal_regulatoria.routes.js'
import { RiskZoneRouter } from './risk_zone.routes.js'
import { archaeologicalRouter } from './archaeological_site.controller.routes.js'
import travelRouter from './travel_destination.routes.js'
import { notificationRouter } from './notification.routes.js'

import  ownerRouter  from './owner.routes.js';
import  categoryRouter  from './category.routes.js';
import  weatherRouter  from './weather.routes.js';
import  establishmentRouter  from './establishment.routes.js';
import  tourEventRouter  from './tour_event.routes.js';
import basicServiceRouter from './basic_service.routes.js'; // Importación corregida
import  securityServiceRouter from './security_service.routes.js';


export const router = Router()

router.get('/', (req, res) => {
  res.send('Welcome to router')
})

router.use('/', userRouter)
router.use('/atraccion', attractionRouter)
router.use('/admin', userRouter)
router.use('/atraccion-accesibilidad', accessibilityRouter)
router.use('/atraccion-contacto', contactRouter)
router.use('/transporte', transportRouter)
router.use('/multimedia', multimediaRouter)
router.use('/educacion-turistica', educationalRouter)
router.use('/info-legal-regulatoria', infoLegalRegualatoriaRouter)
router.use('/zona-riesgo', RiskZoneRouter)
router.use('/sitio-arqueologico', archaeologicalRouter)
router.use('/guia-viaje', travelRouter)
router.use('/notificacion', notificationRouter)

// Nuevas rutas
router.use('/propietarios', ownerRouter);
router.use('/categorias', categoryRouter);
router.use('/clima', weatherRouter);
router.use('/establecimientos', establishmentRouter);
router.use('/eventos-tours', tourEventRouter);
router.use('/servicios-basicos', basicServiceRouter); // Ruta corregida
router.use('/servicios-seguridad', securityServiceRouter);
