const express = require('express');
const Resume = require('../models/Resume');
const router = express.Router();

// GET /api/recommendations?jdId=...
router.get('/', async (req, res) => {
    const { jdId } = req.query;
    if (!jdId) return res.status(400).json({ error: 'jdId is required' });

    const items = await Resume.find({ jdId, analysis: { $exists: true } });
    // rank by (similarityScore + relevanceScore/100)/2
    const ranked = items.map(r => {
        const sim = r.analysis?.similarityScore ?? 0;
        const rel = (r.analysis?.relevanceScore ?? 0) / 100;
        const score = (sim + rel) / 2;
        return { ...r.toObject(), matchScore: Number(score.toFixed(4)) };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(ranked);
});

module.exports = router;
