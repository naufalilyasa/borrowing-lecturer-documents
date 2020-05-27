const model = require("../../models");
// const { ROLES } = require("../../auth");

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
  role,
}) => {
  try {
    // const user = await model.User.findOne({ where: { email: email } });

    // if (user) {
    //   throw new Error("Email is already taken.");
    // }
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
      role,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createUser };
