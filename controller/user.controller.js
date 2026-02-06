const User = require("../model/User");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const emailNorm =
      email && typeof email === "string" ? email.trim().toLowerCase() : "";
    const nameTrimmed = name && typeof name === "string" ? name.trim() : "";
    if (
      !emailNorm ||
      !nameTrimmed ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        status: "Failed to create a new account",
        error: "Email, name, and password are required.",
      });
    }
    const emailRegex = /^(?!\.)(?!.*\.@)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      return res.status(400).json({
        status: "Failed to create a new account",
        error: "Invalid email format.",
      });
    }
    if (password.trim().length < 4) {
      return res.status(400).json({
        status: "Failed to create a new account",
        error: "Password must be at least 4 characters.",
      });
    }
    const user = await User.findOne({ email: emailNorm });
    if (user) {
      throw new Error("This account already exists.");
    }

    const salt = bcryptjs.genSaltSync(saltRounds);
    const hash = bcryptjs.hashSync(password, salt);
    const newUser = new User({
      email: emailNorm,
      name: nameTrimmed,
      password: hash,
    });
    await newUser.save();
    res.status(200).json({ status: "Successfully created a new account" });
  } catch (error) {
    res.status(400).json({
      status: "Failed to create a new account",
      error: error.message || "Something went wrong",
    });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNorm =
      email && typeof email === "string" ? email.trim().toLowerCase() : "";
    const user = await User.findOne(
      { email: emailNorm },
      "-createdAt -updatedAt -__v",
    );
    if (user) {
      const isMatch = bcryptjs.compareSync(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "Success", user, token });
      }
    }
    throw new Error("Invalid email or password");
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      error: error.message || "Something went wrong",
    });
  }
};

module.exports = userController;
