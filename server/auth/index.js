const {
  setup,
  signToken,
  hashPassword,
  verifyPassword,
  checkIsInRole,
  ROLES,
  getRedirectUrl,
} = require("./utils");

const { JWTStrategy, GoogleStrategy } = require("./strategies");

const pipe = (...functions) => (args) =>
  functions.reduce((arg, fn) => fn(arg), args);

const initialiseAuthentication = (app) => {
  setup();

  pipe(GoogleStrategy, JWTStrategy)(app);
};

module.exports = {
  setup,
  signToken,
  hashPassword,
  verifyPassword,
  initialiseAuthentication,
  checkIsInRole,
  ROLES,
  getRedirectUrl,
};
