import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'
import { PORT } from '../server.js'

// Función para obtener la URL base de forma dinámica
const getBaseUrl = () => {
  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || PORT
  return `http://${host}:${port}`
}

export class Image extends Model {}

Image.init({
  image_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  entity_type: {
    type: DataTypes.ENUM('attraction', 'transport'),
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // Propiedad virtual para la URL de la imagen
  url: {
    type: DataTypes.VIRTUAL,
    get () {
      return `${getBaseUrl()}/images/${this.entity_type}/${this.filename}`
    }
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'image'
})
