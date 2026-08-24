const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   CREATE JWT TOKEN
========================= */

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* =========================
   REGISTER USER
========================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Validate input */

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    /* Check password length */

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    /* Check existing user */

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    /* Hash password */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* Create user */

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    /* Generate token */

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* =========================
   LOGIN USER
========================= */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* Validate input */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* Find user */

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* Compare password */

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* Generate token */

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =========================================
   UPDATE NOTIFICATION TOKEN
========================================= */

const updateNotificationToken = async (req, res) => {
  try {
    const { notificationToken } = req.body;

    if (!notificationToken) {
      return res.status(400).json({
        success: false,
        message: "Notification token is required",
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      notificationToken,
    });

    return res.status(200).json({
      success: true,
      message: "Notification token updated successfully",
    });
  } catch (error) {
    console.error("Update notification token error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during token update",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateNotificationToken,
};