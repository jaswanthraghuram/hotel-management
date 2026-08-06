const { Sequelize } = require('sequelize')
require('dotenv').config()

const useSqlite = process.env.USE_SQLITE === 'true'

let sequelize

if (useSqlite) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './database.sqlite',
    logging: false
  })
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'hotelmanagement_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    }
  )
}

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log(`[Database] Connected successfully via ${sequelize.getDialect()}!`)
  } catch (error) {
    console.warn(`[Database] MySQL connection error (${error.message}). To use SQLite set USE_SQLITE=true in .env.`)
  }
}

module.exports = { sequelize, initializeDatabase }
