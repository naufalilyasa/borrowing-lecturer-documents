const { dbName, dbUsername, dbPassword, dbPort } = require("./env");

module.exports = {
  development: {
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    host: "127.0.0.1",
    dialect: "postgres",
    port: dbPort,
  },
  test: {
    username: "database_test",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "database_test",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
