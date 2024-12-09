import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Owner extends Model {}

Owner.init({
  ownerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  sequelize,
  tableName: 'Owner',
  timestamps: false,
  freezeTableName: true,
})