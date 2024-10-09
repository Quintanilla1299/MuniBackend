import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class EducationalResource extends Model { }

EducationalResource.init({
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
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  authors: {
    type: DataTypes.JSON, // Para almacenar un array de autores
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'educational_resource'
})
