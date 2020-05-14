const model = require("../../models");

const getUserByEmail = async (email) => {
  return await model.User.findOne({ where: { email: email } });
};

module.exports = { getUserByEmail };
