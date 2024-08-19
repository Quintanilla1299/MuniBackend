import { Router } from 'express'
import { userRouter } from './user.route.js'
import { attractionRouter } from './attraction.route.js'

export const router = Router()

router.get('/', (req, res) => {
  res.send('Welcome to router')
})

router.use('/', userRouter)
router.use('/atraccion', attractionRouter)
router.use('/admin', userRouter)
