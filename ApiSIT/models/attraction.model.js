import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Attraction extends Model { }

Attraction.init({
  attraction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  type_attraction: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50)
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  opening_hours: {
    type: DataTypes.STRING(100)
  }

},
{
  sequelize,
  timestamps: true,
  tableName: 'attraction'
})
