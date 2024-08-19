import express, { json } from 'express'
import cors from 'cors'
import path from 'path'
import { router } from './router/all.routes.js'
import { sequelize } from './db/database.js'
import './relationships.js'
import { authMiddleware } from './auth.js'
import userController from './controllers/user.controller.js'

export const PORT = process.env.PORT ?? 9000
export const app = express()
app.disable('x-powered-by')
app.use(cors(), json())

app.use('/images', express.static(path.join('images')))
app.post('/sit/login', userController.login)
app.post('/sit/register', userController.create)

app.use('/sit', authMiddleware, router)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}/sit`)
  })
})
