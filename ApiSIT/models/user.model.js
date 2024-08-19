import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'
import bcrypt from 'bcrypt'

export class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 50], // Debe tener entre 3 y 50 caracteres
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [10, 100] // La contraseña debe tener al menos 10 caracteres
    }
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'user',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeUpdate: async (user) => {
      if (user.password && user.changed('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})
