require("dotenv").config();

module.exports = {
  serverPort: process.env.SERVER_PORT,
  dbConnectionString: process.env.DATABASE_CONNECTION_STRING,
  dbPort: process.env.DATABASE_PORT,
  baseApiUrl: process.env.BASE_API_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
};
