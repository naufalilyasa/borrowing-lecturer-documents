const { db } = require("../config");

const connectToDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { connectToDatabase };
