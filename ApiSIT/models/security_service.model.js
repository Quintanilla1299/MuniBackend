import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class SecurityService extends Model {}

SecurityService.init({
  securityServiceId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wazeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleMapsUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'SecurityServices',
  timestamps: false,
  freezeTableName: true,
})