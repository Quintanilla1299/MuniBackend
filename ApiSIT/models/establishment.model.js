import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Establishment extends Model {}

Establishment.init({
  establishmentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Owner',
      key: 'ownerId',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
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
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Category',
      key: 'categoryId',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'Establishment',
  timestamps: true,
})