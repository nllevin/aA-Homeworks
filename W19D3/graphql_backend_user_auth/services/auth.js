const validateInputs = require("../validation/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("user");

const register = async data => {
  try {
    // step 1: Validate Inputs
    const { message, isValid } = validateInputs(data);
    if (!isValid) {
      throw new Error(message);
    }
    // step 2: Hash Password
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // step 3: Constructing and saving a new user
    const user = new User(
      {
        name,
        email,
        password: hashedPassword
      },
      err => {
        if (err) throw err;
      }
    );

    user.save();
    const id = user._doc._id;
    // step 4: create an Auth token
    const token = jwt.sign({ id: user.id }, keys.secretOrKey);

    // step 5: returning all of our user's information and
    // setting `loggedIn` to true
    return { token, loggedIn: true, ...user._doc, id, password: null };
  } catch (err) {
    throw err;
  }
};

module.exports = { register };