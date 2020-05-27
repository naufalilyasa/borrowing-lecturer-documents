const { jwtStrategy } = require("./jwt");
const { googleStrategy } = require("./google");
const JWTStrategy = jwtStrategy;
const GoogleStrategy = googleStrategy;

module.exports = { JWTStrategy, GoogleStrategy };
