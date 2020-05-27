require("dotenv").config();

module.exports = {
  serverPort: process.env.SERVER_PORT,
  dbConnectionString: process.env.DATABASE_CONNECTION_STRING,
  dbName: process.env.DATABASE_NAME,
  dbUsername: process.env.DATABASE_USERNAME,
  dbPassword: process.env.DATABASE_PASSWORD,
  dbPort: process.env.DATABASE_PORT,
  baseApiUrl: process.env.BASE_API_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  serverApiUrl: process.env.SERVER_API_URL,
};
