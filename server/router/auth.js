require("dotenv").config();
const express = require("express");
const to = require("await-to-js");
const { verifyPassword, hashPassword } = require("../auth/utils");
const { login } = require("../auth/strategies/jwt");
const { createUser, getUserByEmail } = require("../database/user");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const [err, user] = await to(getUserByEmail(email));

  const authenticationError = () => {
    return res
      .status(500)
      .json({ success: false, data: "Authentication error!" });
  };

  if (!(await verifyPassword(password, user.password))) {
    console.error("Passwords do not match");
    return authenticationError();
  }

  const [loginErr, token] = await to(login(req, user));

  if (loginErr) {
    console.error("Log in error", loginErr);
    return authenticationError();
  }

  return res
    .status(200)
    .cookie("jwt", token, {
      httpOnly: true,
    })
    .json({
      success: true,
      data: "/",
    });
});

router.post("/register", async (req, res, next) => {
  const { firstName, lastName, ni, telp, email, address, password } = req.body;

  if (!/\b\w+\@\w+\.\w+(?:\.\w+)?\b/.test(email)) {
    return res
      .status(500)
      .json({ success: false, data: "Enter a valid email address." });
  } else if (password.length < 5 || password.length > 20) {
    return res.status(500).json({
      success: false,
      data: "Password must be between 5 and 20 characters.",
    });
  }

  // try {
  // let [err, user] = await createUser({
  const userData = {
    firstName,
    lastName,
    ni,
    telp,
    email,
    address,
    password: await hashPassword(password),
  };

  await createUser(userData);

  if (Error) {
    return res
      .status(500)
      .json({ success: false, data: "Email is already taken" });
  }

  // const [loginErr, token] = await login(req, user);
  const token = await login(req, userData);

  // if (loginErr) {
  //   console.error(loginErr);
  //   return res
  //     .status(500)
  //     .json({ success: false, data: "Authentication error!" });
  // }

  return (
    res
      .status(200)
      .cookie("jwt", token)
      // .cookie("jwt", token, {
      //   httpOnly: true,
      // })
      .json({
        success: true,
        data: "/",
      })
  );
  // } catch (err) {
  //   console.log(err);
  // }

  // if (err) {
  //   return res
  //     .status(500)
  //     .json({ success: false, data: "Email is already taken" });
  // }

  // const [loginErr, token] = await to(login(req, user));

  // if (loginErr) {
  //   console.error(loginErr);
  //   return res
  //     .status(500)
  //     .json({ success: false, data: "Authentication error!" });
  // }

  // return res
  //   .status(200)
  //   .cookie("jwt", token, {
  //     httpOnly: true,
  //   })
  //   .json({
  //     success: true,
  //     data: "/",
  //   });
});

module.exports = router;
