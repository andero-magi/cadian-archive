const ss = require("sequelize")

let dataName = process.env.DB_DATANAME
let userName = process.env.DB_USERNAME
let password = process.env.DB_PASSWORD
let host = process.env.DB_HOSTNAME

const sequelize = new ss.Sequelize(dataName, userName, password, {
  host: host,
  dialect: process.env.DB_DIALECT ?? "mariadb",
  logging: console.log
})

async function authenticateDbConnection() {
  try {
    await sequelize.authenticate()
    console.log("Connected to DB")
  } catch (error) {
    console.error(`Database connection failed: ${error.original.code}`)
    console.error(error)
  }
}

authenticateDbConnection()

const db = {}
db.Sequalize = ss.Sequelize
db.sequelize = sequelize

async function sync() {
  await sequelize.sync({ alter: true })
  console.log("db synced")
}

module.exports = {
  db: db,
  sync: sync
}