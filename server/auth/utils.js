const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecret } = require("../config/env");

const { model } = require("../models");

const setup = () => {
  passport.serializeUser((user, done) => done(null, user.email));

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await model.User.findOne({ where: { email: email } });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
};

const signToken = (user) => {
  return jwt.sign({ data: user }, jwtSecret, {
    expiresIn: "1h",
  });
};

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password was not provided");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (candidate, actual) => {
  return await bcrypt.compare(candidate, actual);
};

const checkIsInRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const hasRole = roles.find((role) => req.user.role === role);
  if (!hasRole) {
    return res.redirect("/login");
  }

  return next();
};

const ROLES = {
  Admin: "Admin",
  Lecturer: "Lecturer",
  Student: "Student",
};

const getRedirectUrl = (role) => {
  switch (role) {
    case ROLES.Admin:
      return "/admin-dashboard";
    case ROLES.Student:
      return "/student-dashboard";
    default:
      return "/";
  }
};

module.exports = {
  setup,
  signToken,
  hashPassword,
  verifyPassword,
  checkIsInRole,
  ROLES,
  getRedirectUrl,
};
