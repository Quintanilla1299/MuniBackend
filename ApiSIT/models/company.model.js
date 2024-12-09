import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Company extends Model {}

Company.init({
  companyId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  companyName: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  geographicLocation: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  serviceCharacteristics: {
    type: DataTypes.TEXT,  
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Company',
  timestamps: false
})