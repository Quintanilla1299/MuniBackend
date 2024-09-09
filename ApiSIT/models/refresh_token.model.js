import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/database.js'
import { User } from './user.model.js'

export class RefreshToken extends Model {}

RefreshToken.init({
  refresh_token_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  tableName: 'refresh_token'
})
