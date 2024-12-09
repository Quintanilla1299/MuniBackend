import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

export class Category extends Model {}

Category.init({
  categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: 'Category',
  timestamps: false,
  freezeTableName: true
})