// models/ArchaeologicalSite.js
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class ArchaeologicalSite extends Model {}

ArchaeologicalSite.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'archaeological_site',
  timestamps: true
})
