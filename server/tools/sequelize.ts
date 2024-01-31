const { Sequelize } = require('sequelize');

const database = process.env.DB_NAME
const user = process.env.DB_USER
const password = process.env.DB_PASS
const port = process.env.DB_PORT
const host = process.env.DB_HOST

export const sq = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`)

export const defaultInsertOptions = {
  createdAt: "created_at",
  updatedAt: false
}

export const defaultUpdateOptions = {
  updatedAt: "updated_at",
  createdAt: false
}