// models/legalInfo.js
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class InfoLegalRegulatoria extends Model {}

InfoLegalRegulatoria.init({
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
  website: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'info_legal_regulatoria'
})
