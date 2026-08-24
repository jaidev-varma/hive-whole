const express = require("express");

const {
  registerUser,
  loginUser,
  updateNotificationToken,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", registerUser);

/* =========================
   LOGIN
========================= */

router.post("/login", loginUser);

/* =========================
   UPDATE NOTIFICATION TOKEN
========================= */

router.put(
  "/notification-token",
  authMiddleware,
  updateNotificationToken
);

module.exports = router;