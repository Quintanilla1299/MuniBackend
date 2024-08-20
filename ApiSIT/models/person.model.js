import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'
import { User } from './user.model.js'

export class Person extends Model {}

Person.init({
  person_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      // Validación de cédula costarricense y extranjera
      isValidCedula (value) {
        const regex = /^[A-Z0-9\-.]{1,20}$/
        if (!regex.test(value)) {
          throw new Error('Invalid cedula format. Allowed characters are letters, numbers, hyphens, and dots.')
        }
      }
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    },
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'person'
})
