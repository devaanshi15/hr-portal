// backend/routes/dashboard.js
const express = require("express");
const Job = require("../models/Job");
const Resume = require("../models/Resume");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const resumes = await Resume.countDocuments();

    // If "candidates" = number of resumes (heads)
    const candidates = resumes;

    const jobcodeWise = await Resume.aggregate([
      { $group: { _id: "$jobcode", count: { $sum: 1 } } }
    ]);

    res.json({
      jobs,
      resumes,
      candidates,
      jobcodeWise: jobcodeWise.length
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
