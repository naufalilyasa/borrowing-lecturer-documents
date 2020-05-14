const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const { serverPort } = require("./config/env");
const { Router } = require("./router");
const { initialiseAuthentication } = require("./auth");
const { connectToDatabase } = require("./database/connection");

const port = serverPort;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

Router(app);

initialiseAuthentication(app);

app.get("/test", (req, res) =>
  res.status(200).json({ hello: "Hello, from the back-end world!" })
);

// Connect to database
connectToDatabase();

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on localhost:${port}`);
});
