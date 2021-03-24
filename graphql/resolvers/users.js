const User = require("../../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validator");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
};
module.exports = {
  Mutation: {
    async login(parent, args, context, info) {
      const { username, password } = args;
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) throw new UserInputError("Errors", { errors });
      // find user in database
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      // password checked in database
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credential";
        throw new UserInputError("Wrong credential", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(parent, args, context, info) {
      let {
        registerInput: { username, email, password, confirmPassword },
      } = args;
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) throw new UserInputError("Error", { errors });
      // Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // hash password and create an auth token

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
