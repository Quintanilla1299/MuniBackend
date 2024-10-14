import { Router } from 'express'
import { userRouter } from './user.routes.js'
import { attractionRouter } from './attraction.routes.js'
import { accessibilityRouter } from './accessibility.routes.js'
import { contactRouter } from './contact.routes.js'
import { transportRouter } from './transport.routes.js'
import { multimediaRouter } from './multimedia.routes.js'
import { educationalRouter } from './educational_resources.routes.js'
import { infoLegalRegualatoriaRouter } from './info_legal_regulatoria.routes.js'

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
