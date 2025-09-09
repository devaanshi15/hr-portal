const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// ✅ Get all Job Descriptions
router.get('/jds', async (req, res) => {
  try {
    const jobs = await Job.find({}, { _id: 1, title: 1, description: 1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job descriptions' });
  }
});

// ✅ Get candidates analyzed for a JD
router.get('/candidates/:jdId', async (req, res) => {
  try {
    const jdId = req.params.jdId;

    // Find analyses done for this JD
    const analyses = await ResumeAnalysis.find({ jobId: jdId }).sort({ similarityScore: -1 });

    // Enrich with candidate info
    const enriched = await Promise.all(
      analyses.map(async (a) => {
        const resume = await Resume.findById(a.resumeId);
        return {
          name: resume?.candidateName || 'Unknown',
          aiScore: a.similarityScore,
          resumeLink: resume?.filePath || '#'
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch candidates for JD' });
  }
});

// ✅ Get top N best fits
router.get('/top/:jdId', async (req, res) => {
  try {
    const jdId = req.params.jdId;
    const num = parseInt(req.query.num) || 1;

    const analyses = await ResumeAnalysis.find({ jobId: jdId })
      .sort({ similarityScore: -1 })
      .limit(num);

    const enriched = await Promise.all(
      analyses.map(async (a) => {
        const resume = await Resume.findById(a.resumeId);
        return {
          name: resume?.candidateName || 'Unknown',
          aiScore: a.similarityScore,
          resumeLink: resume?.filePath || '#'
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch best fits' });
  }
});

module.exports = router;
