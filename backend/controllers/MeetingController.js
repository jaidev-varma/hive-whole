const Meeting = require("../models/Meeting");
const User = require("../models/User");
const { sendPushNotifications } = require("../utils/pushNotifications");

/* =========================================
   CREATE MEETING
========================================= */

const createMeeting = async (req, res) => {
  try {
    const {
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      attendees,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          "Title, date, start time and end time are required",
      });
    }

    /* =========================
       VALIDATE DATE
    ========================= */

    const meetingDate = new Date(date);

    if (isNaN(meetingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid meeting date",
      });
    }

    /* =========================
       VALIDATE TIME
    ========================= */

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting end time must be later than start time",
      });
    }

    /* =========================
       ATTENDEES
    ========================= */

    let attendeeIds = [];

    if (Array.isArray(attendees) && attendees.length > 0) {
      const validUsers = await User.find({
        _id: { $in: attendees },
      }).select("_id");

      attendeeIds = validUsers.map((user) => user._id);
    }

    /* =========================
       CREATE MEETING
    ========================= */

    const meeting = await Meeting.create({
      title,
      date: meetingDate,
      startTime,
      endTime,
      location: location || "",
      description: description || "",
      createdBy: req.user._id,
      attendees: attendeeIds,
    });

    /* =========================
       GET COMPLETE MEETING
    ========================= */

    const completeMeeting = await Meeting.findById(
      meeting._id
    )
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    // Send push notifications to all users with a registered notificationToken
    User.find({
      notificationToken: { $ne: null }
    }).select("notificationToken").then(users => {
      const tokens = users.map(u => u.notificationToken);
      if (tokens.length > 0) {
        sendPushNotifications(tokens, {
          title: "New Meeting Scheduled",
          body: `${req.user.name} scheduled: "${title}"`,
          data: { meetingId: meeting._id.toString() }
        });
      }
    }).catch(err => {
      console.error("Error sending push notifications:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting: completeMeeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating meeting",
    });
  }
};

/* =========================================
   GET ALL MEETINGS
========================================= */

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({
        date: 1,
        startTime: 1,
      });

    return res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("Get meetings error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching meetings",
    });
  }
};

/* =========================================
   GET SINGLE MEETING
========================================= */

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Get meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching meeting",
    });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
};