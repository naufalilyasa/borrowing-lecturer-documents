const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const AccessControl = require("accesscontrol");
const { serverPort, jwtSecret } = require("./config/env");
const { Router } = require("./router");
const { initialiseAuthentication } = require("./auth");
const { connectToDatabase } = require("./database/connection");
const { ROLES, checkIsInRole } = require("./auth");
const { getUserByEmail } = require("./database/user/");

const port = serverPort || 5000;
const app = express();
// const ac = new AccessControl();

// ac.grant("Admin")
//   .createAny("profile")
// .readAny("profile", ["*", "!password"])
// .readAny("profile")
// .deleteAny("profile");

const corsOptions = {
  origin: "bld.id",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

Router(app);

initialiseAuthentication(app);

// app.use(async (req, res, next) => {
//   if (req.headers["x-access-token"]) {
//     const accessToken = req.headers["x-access-token"];
//     const { email } = await jwt.verify(
//       accessToken,
//       process.env.JWT_SECRET,
//       (err, decoded) => {
//         if (err) {
//           err = {
//             name: "JsonWebTokenError",
//             message: "JWT token has expired, please login to obtain a new one.",
//           };
//           res.status(401).json(err);
//         }
//       }
//     );
// Check if token has expired
// if (exp < Date.now().valueOf() / 1000) {
//   return res.status(401).json({
//     error: "JWT token has expired, please login to obtain a new one",
//   });
// }
//     res.locals.loggedInUser = await getUserByEmail(email);
//     next();
//   } else {
//     next();
//   }
// });

const allowIfLoggedin = async (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;
    const decoded = jwt.verify(accessToken, jwtSecret, (err, decoded) => {
      if (err) {
        err = {
          name: "TokenExpiredError",
          message: "JWT token has expired, please login to obtain a new one.",
        };
        res.status(401).json(err);
      } else {
        return decoded;
      }
    });
    // Check if token has expired
    // if (exp < Date.now().valueOf() / 1000) {
    //   return res.status(401).json({
    //     error: "JWT token has expired, please login to obtain a new one",
    //   });
    // }
    res.locals.loggedInUser = await getUserByEmail(decoded.data.email);
    const user = res.locals.loggedInUser;
    if (!user) {
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    } else {
      req.user = user;
    }
    next();
  } catch (err) {
    // next(error);
    console.error(err);
  }
};

// app.get(
//   "/",
//   passport.authenticate("jwt", { failureRedirect: "/login" }),
//   allowIfLoggedin(),
//   (req, res) => {
// passport.authenticate("jwt", { failureRedirect: "/login" });
// res.send("as");
//   }
// );

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     req.flash("danger", "Please login");
//     res.redirect("/login");
//   }
// }

app.get(
  "/admin-dashboard",
  allowIfLoggedin,
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  checkIsInRole(ROLES.Admin)
);

app.get(
  "/student-dashboard",
  allowIfLoggedin,
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  checkIsInRole(ROLES.Customer)
);

// Connect to database
connectToDatabase();

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on localhost:${port}`);
});
