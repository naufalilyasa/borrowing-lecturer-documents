const passport = require("passport");
const passportGoogle = require("passport-google-oauth");
const to = require("await-to-js").default;

const { getUserByProviderId, createUser } = require("../../database/user");
const { signToken, ROLES, getRedirectUrl } = require("../utils");

const {
  googleClientID,
  googleClientSecret,
  serverApiUrl,
  baseApiUrl,
} = require("../../config/env");

const GoogleStrategy = passportGoogle.OAuth2Strategy;

const googleStrategy = (app) => {
  const strategyOptions = {
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: `${serverApiUrl}/auth/google/callback`,
  };

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    // try {
    //   let user = await getUserByProviderId(profile.id);
    //   // return done(user);
    // } catch (err) {
    //   return done(err);
    // }
    let [err, user] = await to(getUserByProviderId(profile.id));
    if (err || user) {
      return done(err, user);
    }

    const verifiedEmail =
      profile.emails.find((email) => email.verified) || profile.emails[0];

    const [createdError, createdUser] = await to(
      createUser({
        provider: profile.provider,
        providerId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: verifiedEmail.value,
        password: null,
        role: ROLES.Student,
      })
    );

    return done(createdError, createdUser);
  };

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback));

  app.get(
    `${baseApiUrl}/auth/google`,
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    })
  );

  app.get(
    `${baseApiUrl}/auth/google/callback`,
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      return res
        .status(200)
        .cookie("jwt", signToken(req.user))
        .redirect(getRedirectUrl(req.user.role));
    }
  );
  return app;
};

module.exports = { googleStrategy };
