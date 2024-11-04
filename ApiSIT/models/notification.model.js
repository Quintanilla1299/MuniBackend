import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255), // Título de la notificación
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT, // Mensaje de la notificación
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER, // Identificador del usuario
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN, // Estado de lectura de la notificación
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true, // Esto añade createdAt y updatedAt automáticamente
  tableName: 'notification' // Nombre de la tabla en la base de datos
})
