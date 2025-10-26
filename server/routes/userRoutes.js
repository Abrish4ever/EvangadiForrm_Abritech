const express = require("express");
const router = express.Router();
// user controllers
const {
  register,
  login,
  checkUser,
  forgetPassword,
} = require("../controller/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// register route
router.post("/register", register);

// login user
router.post("/login", login);

// check user route
router.get("/check", authMiddleware, checkUser);

router.post("/forget-password", forgetPassword);

module.exports = router;
