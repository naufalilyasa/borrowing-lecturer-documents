const { setup, signToken, hashPassword, verifyPassword } = require("./utils");
const { JWTStrategy } = require("./strategies");

const pipe = (...functions) => (args) =>
  functions.reduce((arg, fn) => fn(arg), args);

const initialiseAuthentication = (app) => {
  setup();

  pipe(JWTStrategy)(app);
};

module.exports = {
  setup,
  signToken,
  hashPassword,
  verifyPassword,
  initialiseAuthentication /*, strategies*/,
};
