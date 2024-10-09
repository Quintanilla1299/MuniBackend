import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Transport extends Model {}

Transport.init({
  transport_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'transport'
})
