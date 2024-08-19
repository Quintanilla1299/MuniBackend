import express, { json } from 'express'
import cors from 'cors'
import path from 'path'
import { router } from './router/all.routes.js'
import { sequelize } from './db/database.js'
import './relationships.js'

export const PORT = process.env.PORT ?? 9000
export const app = express()
app.disable('x-powered-by')
app.use(cors(), json())

app.use('/images', express.static(path.join('images')))
app.use('/sit', router)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}/sit`)
  })
})
