import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'
import { Attraction } from './attraction.model.js'

export class Accessibility extends Model {}

Accessibility.init({
  accessibility_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attraction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Attraction,
      key: 'attraction_id'
    }
  },
  ramp_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  elevator_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wide_doors: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  braille_signage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  accessible_bathrooms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reserved_parking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  trained_staff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  audio_guides: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sign_language_services: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  accessible_rest_areas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  online_accessibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  other_services: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'accessibility',
  timestamps: true
})
