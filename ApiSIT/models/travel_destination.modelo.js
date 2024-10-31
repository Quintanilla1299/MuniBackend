import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class TravelDestination extends Model {}

TravelDestination.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  bestTimeToVisit: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  travelTips: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6), // Para manejar coordenadas
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6), // Para manejar coordenadas
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'travel_destination' // Cambia este nombre según tus convenciones
})
