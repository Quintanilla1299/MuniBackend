import { sequelize } from '../db/database.js'

const testConnection = async () => {
  try {
    // Prueba de la conexión a la base de datos
    await sequelize.authenticate()
    console.log('Conexión a la base de datos establecida con éxito.')
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
  } finally {
    // Cierra la conexión después de la prueba
    await sequelize.close()
  }
}

testConnection()
