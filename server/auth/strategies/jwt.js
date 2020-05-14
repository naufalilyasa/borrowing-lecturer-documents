const passport = require("passport");
const passportJWT = require("passport-jwt");
const to = require("await-to-js");

const { getUserByEmail } = require("../../database/user");
const { signToken } = require("../utils");
const { jwtSecret } = require("../../config/env");

const JWTStrategy = passportJWT.Strategy;

const strategy = () => {
  const strategyOptions = {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: jwtSecret,
    passReqToCallback: true,
  };

  const verifyCallback = async (req, jwtPayload, cb) => {
    const [err, user] = await to(getUserByEmail(jwtPayload.data.email));

    if (err) {
      return cb(err);
    }
    req.user = user;
    return cb(null, user);
  };

  passport.use(new JWTStrategy(strategyOptions, verifyCallback));
};

const login = (req, user) => {
  return new Promise((resolve, reject) => {
    req.login(user, { session: false }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(signToken(user));
    });
  });
};

module.exports = { strategy, login };
