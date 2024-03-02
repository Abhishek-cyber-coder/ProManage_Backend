const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyJwtToken = require("../middlewares/authMiddleware");

// This endpoint is created to register the user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = await userData.save();

    const token = jwt.sign(
      { userId: userResponse._id },
      process.env.SECRET_KEY
    );

    res.json({
      message: "User successfully registered",
      token: token,
      username: name,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong, please! try again later",
      success: false,
    });
  }
});

// This endpoint is created to login the user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Bad Request! Invalid Credentials",
      });
    }

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "invalid Credentials",
        success: false,
      });
    }

    const token = jwt.sign({ userId: userDetails._id }, process.env.SECRET_KEY);

    res.json({
      message: "User loggedin successfully",
      token: token,
      username: userDetails.name,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong, please! try again later",
      success: false,
    });
  }
});

// This endpoint is created to update the user password or name
router.put("/settings/update", verifyJwtToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(401).json({
        message: "Bad Request",
        success: false,
      });
    }

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (name) {
      userDetails.name = name;
    }

    if (password && password.oldPassword && password.newPassword) {
      const isMatch = await bcrypt.compare(
        password.oldPassword,
        userDetails.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password.newPassword, 10);

      userDetails.password = hashedPassword;
    }

    await userDetails.save();
    res.json({
      message: "User information updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

module.exports = router;
