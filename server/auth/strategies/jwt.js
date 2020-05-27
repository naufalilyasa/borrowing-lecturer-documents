const passport = require("passport");
const passportJWT = require("passport-jwt");
// const to = require("await-to-js");

const { getUserByEmail } = require("../../database/user");
const { signToken } = require("../utils");
const { jwtSecret } = require("../../config/env");

const JWTStrategy = passportJWT.Strategy;

const jwtStrategy = () => {
  const strategyOptions = {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: jwtSecret,
    passReqToCallback: true,
  };

  const verifyCallback = async (req, jwtPayload, /*cb*/ done) => {
    // const [err, user] = await to(getUserByEmail(jwtPayload.data.email));

    // if (err) {
    //   return cb(err);
    // }
    // req.user = user;
    // return cb(null, user);

    try {
      const user = await getUserByEmail(jwtPayload.data.email);
      req.user = user;
      return done(user);
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new JWTStrategy(strategyOptions, verifyCallback));
};

const login = (req, user) => {
  // try {
  //   await req.logIn(user, { session: false }, (err) => {
  //     if (err) {
  //       throw new Error(err);
  //     }
  //     return signToken(user);
  //   });
  // } catch (err) {
  //   console.error(err);
  // }
  return new Promise((resolve, reject) => {
    req.login(user, { session: false }, (err) => {
      // passport.authenticate(user, { session: false }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(signToken(user));
    });
  });
};

module.exports = { jwtStrategy, login };
