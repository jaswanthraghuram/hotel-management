const { Sequelize } = require('sequelize')
require('dotenv').config()

const dialect = process.env.DB_DIALECT || 'mysql'
const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USER || 'root'
const pass = process.env.DB_PASS || ''
const name = process.env.DB_NAME || 'hotelmanagement_db'
const port = process.env.DB_PORT || 3306

let sequelize

if (process.env.USE_SQLITE === 'true') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './database.sqlite',
    logging: false
  })
} else {
  // MySQL connection with automatic SQLite fallback for smooth dev startup
  sequelize = new Sequelize(name, user, pass, {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
}

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log(`[Database] Connected successfully via ${sequelize.getDialect()}!`)
  } catch (error) {
    console.warn(`[Database] MySQL connection failed (${error.message}). Falling back to SQLite for zero-config execution...`)
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || './database.sqlite',
      logging: false
    })
    await sequelize.authenticate()
    console.log(`[Database] Connected successfully via SQLite fallback!`)
  }
}

module.exports = { sequelize, initializeDatabase }
