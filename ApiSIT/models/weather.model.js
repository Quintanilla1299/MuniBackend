import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Weather extends Model {}

Weather.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  feelsLike: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  humidity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  windSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  rain: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Weather',
  timestamps: false
})