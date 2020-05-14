const router = require("./auth");
const { baseApiUrl } = require("../config/env");

function Router(app) {
  app.use(`${baseApiUrl}/auth`, router);
}

module.exports = { Router };
