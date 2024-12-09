import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class TourEvent extends Model {}

TourEvent.init({
  tourEventId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  activityType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specialRequirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimatedDuration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meetingPoint: {
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
  tableName: 'TourEvent',
  timestamps: false,
  freezeTableName: true,
})