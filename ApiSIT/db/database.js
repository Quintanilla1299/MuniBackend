import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = process.env

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  timezone: '-06:00',
  define: {
    freezeTableName: true
  }
  // Este codigo documentado es para cuando se hostee la bd
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false
  //     }
  //   }
})
