const authController = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Invalid token");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("Invalid token");
      }
      req.userId = payload._id;
      // res.status(200).json({ status: "Success", userId: payload._id });
    });
    next();
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};

module.exports = authController;
