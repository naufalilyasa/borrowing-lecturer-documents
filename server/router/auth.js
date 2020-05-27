require("dotenv").config();
const express = require("express");
const { verifyPassword, hashPassword } = require("../auth/utils");
const { login } = require("../auth/strategies/jwt");
const { createUser, getUserByEmail } = require("../database/user");
const { check, validationResult } = require("express-validator");
const { ROLES, getRedirectUrl } = require("../auth");

const router = express.Router();

router.post(
  "/login",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address.")
      .notEmpty()
      .withMessage("Enter your email address."),
    // .custom((value) => {
    //   return getUserByEmail(value).then((user) => {
    //     if (user) {
    //       throw new Error("Authentication error!");
    //     }
    //   });
    // }),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Enter your password.")
      .custom(async (value, { req }) => {
        const userData = await getUserByEmail(req.body.email);
        if (!(await verifyPassword(value, userData.password))) {
          throw new Error("Incorrect password.");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ success: false, data: errors.array() });
    } else {
      const { email } = req.body;
      try {
        const userData = await getUserByEmail(email);

        const token = await login(req, userData);
        if (token) {
          return (
            res
              .status(200)
              .cookie("jwt", token)
              // .cookie("jwt", token, {
              //   httpOnly: true,
              // })
              .json({
                success: true,
                data: getRedirectUrl(userData.role),
              })
          );
        } else {
          throw new Error("Authentication Error");
        }
      } catch (err) {
        return res.status(500).json({ success: false, data: err.message });
      }
    }
    // const [err, user] = await to(getUserByEmail(email));
    // const authenticationError = () => {
    //   return res
    //     .status(500)
    //     .json({ success: false, data: "Authentication error!" });
    // };
    // if (!(await verifyPassword(password, user.password))) {
    //   console.error("Passwords do not match");
    //   return authenticationError();
    // }
    // const [loginErr, token] = await to(login(req, user));
    // if (loginErr) {
    //   console.error("Log in error", loginErr);
    // return authenticationError();
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
  }
);

router.post(
  "/register",
  [
    // check("firstName")
    //   .trim()
    //   .isAlpha()
    //   .withMessage("Enter a valid first name.")
    //   .notEmpty()
    //   .withMessage("Enter your first name."),
    // check("lastName")
    //   .trim()
    //   .isAlpha()
    //   .withMessage("Enter a valid last name.")
    //   .notEmpty()
    //   .withMessage("Enter your last name."),
    // check("ni")
    //   .trim()
    //   .isNumeric()
    //   .withMessage("Enter a valid register number.")
    //   .notEmpty()
    //   .withMessage("Enter your register number."),
    // check("telp")
    //   .trim()
    //   .isMobilePhone(["id-ID"])
    //   .withMessage("Enter a valid phone number.")
    //   .notEmpty()
    //   .withMessage("Enter your phone number."),
    check("email")
      .trim()
      .notEmpty()
      .withMessage("Enter your email address.")
      .isEmail()
      .withMessage("Enter a valid email address.")
      .custom(async (value) => {
        const userData = await getUserByEmail(value);
        if (userData) {
          throw new Error("Email is already taken.");
        } else {
          return true;
        }
      }),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Enter your password.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long.")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Password don't match.");
        } else {
          return true;
        }
      }),
    check("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Enter your password confirmation."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ success: false, data: errors.array() });
    } else {
      const {
        firstName,
        lastName,
        ni,
        telp,
        email,
        address,
        password,
      } = req.body;

      // if (!/\b\w+\@\w+\.\w+(?:\.\w+)?\b/.test(email)) {
      //   return res
      //     .status(500)
      //     .json({ success: false, data: "Enter a valid email address." });
      // } else if (password.length < 5 || password.length > 20) {
      //   return res.status(500).json({
      //     success: false,
      //     data: "Password must be between 5 and 20 characters.",
      //   });
      // }

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
        role: ROLES.Student,
      };

      try {
        await createUser(userData);

        const token = await login(req, userData);

        return (
          res
            .status(200)
            .cookie("jwt", token)
            // .cookie("jwt", token, {
            //   httpOnly: true,
            // })
            .json({
              success: true,
              data: getRedirectUrl(ROLES.Student),
            })
        );
      } catch (err) {
        return res.status(500).json({ success: false, data: err.message });
      }
    }

    // if (Error) {
    //   return res
    //     .status(500)
    //     .json({ success: false, data: "Email is already taken" });
    // }

    // const [loginErr, token] = await login(req, user);
    // const token = await login(req, userData);

    // if (loginErr) {
    //   console.error(loginErr);
    //   return res
    //     .status(500)
    //     .json({ success: false, data: "Authentication error!" });
    // }

    // return (
    //   res
    //     .status(200)
    //     .cookie("jwt", token)
    //     // .cookie("jwt", token, {
    //     //   httpOnly: true,
    //     // })
    //     .json({
    //       success: true,
    //       data: "/",
    //     })
    // );
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
  }
);

module.exports = router;
