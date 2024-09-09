import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Route extends Model {}

Route.init({
  route_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'route'
})
