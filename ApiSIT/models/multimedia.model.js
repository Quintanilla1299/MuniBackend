import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js' // Asegúrate de tener la configuración de la base de datos

export class MultimediaModel extends Model {}

MultimediaModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  file: {
    type: DataTypes.STRING(255), // Ruta o identificador del archivo
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255), // URL pública del archivo
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255), // Nombre del archivo
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255), // Título del archivo
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500), // Descripción del archivo
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50), // Tipo de archivo (por ejemplo, imagen, documento, etc.)
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'multimedia'
})
