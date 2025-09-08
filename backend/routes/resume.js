const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const OpenAI = require("openai");
const Resume = require("../models/Resume");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Upload Resume
router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const resume = new Resume({
        filename: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path
        });
        await resume.save();

        res.json({ message: "File uploaded successfully", resumeId: resume._id });
    } catch (err) {
        res.status(500).json({ error: "Upload failed" });
    }
    });

// Analyse Resume (AI Score)
router.post("/analyse/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Extract text (PDF only for now)
    let text = "";
    if (resume.fileType.includes("pdf")) {
      const dataBuffer = fs.readFileSync(resume.filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      text = "Image parsing not yet implemented"; // OCR can be added
    }

    // Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI resume analyser. Extract key info and provide category, technologies, counts, relevance score (0-100), and comments."
        },
        { role: "user", content: text }
      ]
    });

    const analysis = completion.choices[0].message.content;

    resume.analysis = JSON.parse(analysis); // Expect structured JSON
    await resume.save();

    res.json({ message: "Analysis done", analysis: resume.analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;
