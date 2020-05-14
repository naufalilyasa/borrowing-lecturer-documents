const model = require("../../models");

const createUser = async ({
  firstName,
  lastName,
  ni,
  telp,
  address,
  email,
  password,
  providerId = "",
  provider = "",
}) => {
  try {
    const user = await model.User.findOne({ where: { email: email } });

    if (user) {
      throw new Error("Email is already in use");
    }

    return await model.User.create({
      providerId,
      provider,
      firstName,
      lastName,
      ni,
      telp,
      address,
      email,
      password,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createUser };
