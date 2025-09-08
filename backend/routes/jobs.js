const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// Create
router.post('/', async (req, res) => 
{
    try {
        const job = new Job(req.body);
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

// Update
router.put('/:id', async (req, res) => {
try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
} catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
