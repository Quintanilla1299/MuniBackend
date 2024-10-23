// models/PDFFile.js
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

class DocumentFile extends Model { }

DocumentFile.init({
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  modelName: 'document_file'
})

export default DocumentFile
