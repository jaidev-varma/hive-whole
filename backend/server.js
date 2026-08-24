const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

/* =========================================
   ROOT ROUTE
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Meeting Scheduler API is running",
  });
});

/* =========================================
   AUTH ROUTES
========================================= */

app.use(
  "/api/auth",
  authRoutes
);

/* =========================================
   MEETING ROUTES
========================================= */

app.use(
  "/api/meetings",
  meetingRoutes
);

/* =========================================
   DATABASE CONNECTION
========================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(error.message);
  });