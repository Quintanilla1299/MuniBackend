import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Contact extends Model { }

Contact.init({
  contact_id: {
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
    type: DataTypes.STRING(50),
    allowNull: false
  },
  contact_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['phone', 'email']]
    }
  },
  contact_value: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      isValidContactValue (value) {
        if (this.contact_type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
          throw new Error('Invalid email format')
        }
        if (this.contact_type === 'phone' && !/^[0-9\-()+ ]+$/.test(value)) {
          throw new Error('Invalid phone number format')
        }
      }
    }
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'contact'
})
