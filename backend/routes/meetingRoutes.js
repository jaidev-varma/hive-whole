const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createMeeting,
  getMeetings,
  getMeetingById,
} = require("../controllers/MeetingController");

const router = express.Router();

/* =========================================
   CREATE MEETING
========================================= */

router.post(
  "/",
  authMiddleware,
  createMeeting
);

/* =========================================
   GET ALL MEETINGS
========================================= */

router.get(
  "/",
  authMiddleware,
  getMeetings
);

/* =========================================
   GET SINGLE MEETING
========================================= */

router.get(
  "/:id",
  authMiddleware,
  getMeetingById
);

module.exports = router;