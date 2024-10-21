import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class RiskZone extends Model {}

RiskZone.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'risk_zone',
  timestamps: true
})
