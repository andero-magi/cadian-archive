import { Sequelize } from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';

let sequelize;

async function authenticateDbConnection() {
  try {
    await sequelize.authenticate()
    console.log("Connected to DB")
  } catch (error) {
    console.error(`Database connection failed: ${error.original.code}`)
    console.error(error)
  }
}

/**
 * Initialize the database and connect to it.
 */
export async function initDatabase() {
  let dataName = process.env.DB_DATANAME
  let userName = process.env.DB_USERNAME
  let password = process.env.DB_PASSWORD
  let host = process.env.DB_HOSTNAME

  sequelize = new Sequelize({
    dialect: MariaDbDialect,
    database: dataName,
    user: userName,
    password: password,
    host: host,
    showWarnings: true,
    connectTimeout: 1000,
    logging: console.log,
    define: {
      timestamps: false
    }
  })

  authenticateDbConnection()
}

/**
 * Get the current database instance
 * @returns {Sequelize} The current database instance
 */
export function getSequelize() {
  return sequelize
}

/**
 * Sync the database
 */
export async function sync() {
  await sequelize.sync()
}