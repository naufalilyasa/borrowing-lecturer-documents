const model = require("../../models");

const getUserByEmail = async (email) => {
  try {
    return await model.User.findOne({ where: { email: email } });
  } catch (err) {
    console.error(`Something wrong: ${err}`);
  }
};

const getUserByProviderId = async (providerId) => {
  return await model.User.findOne({ where: { providerId: providerId } });
};

module.exports = { getUserByEmail, getUserByProviderId };
