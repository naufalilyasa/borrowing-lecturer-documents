const Sequelize = require("sequelize");
const { dbConnectionString, dbPort } = require("../config/env");

const db = new Sequelize(dbConnectionString, {
  dialect: "postgres",
  port: dbPort,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { db };
