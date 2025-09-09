const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { chatCompletion, embedTexts } = require('../lib/mmcOpenAI');

const router = express.Router();

// Storage config & PDF-only filter
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const fileFilter = (_, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB

// POST /api/resume/upload?jdId=...&candidateName=...
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const { jdId, candidateName } = req.query;
    if (!jdId) return res.status(400).json({ error: 'jdId is required' });

    const doc = new Resume({
      jdId,
      candidateName: candidateName || '',
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path
    });
    await doc.save();
    res.json({ message: 'Uploaded', resumeId: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// Helper: parse PDF
async function parsePdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(buffer);
  return parsed.text || '';
}

// Helper: cosine similarity
function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// POST /api/resume/analyse/:id
router.post('/analyse/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const jd = await Job.findById(resume.jdId);
    if (!jd) return res.status(404).json({ error: 'Job description not found' });

    // 1) Parse resume PDF (cache parsedText)
    let resumeText = resume.parsedText;
    if (!resumeText) {
      resumeText = await parsePdf(resume.filePath);
      resume.parsedText = resumeText;
    }

    const jdText = `${jd.title}\n\n${jd.description}`;

    // 2) Embedding-based similarity
    const [jdEmb, resumeEmb] = await embedTexts({
      deployment: process.env.MMC_EMBED_DEPLOYMENT,
      inputs: [jdText, resumeText]
    });
    const similarityScore = cosineSim(jdEmb, resumeEmb); // 0..1

    // 3) Chat completion for structured insights
    const system = {
      role: 'system',
      content: 'You are a strict JSON generator for HR screening. Respond ONLY valid JSON. No markdown, no prose.'
    };
    const user = {
      role: 'user',
      content:
        `Given the following job description and resume text, return a JSON object with:
{
  "category": "e.g., Software Engineer, Data Analyst, PM",
  "technologies": ["top, deduplicated skills/tech terms"],
  "counts": { "totalSkills": number },
  "relevanceScore": number (0-100),
  "comments": "1-2 lines on fit"
}

Job Description:
${jdText}

Resume:
${resumeText}`
    };

    const raw = await chatCompletion({
      deployment: process.env.MMC_CHAT_DEPLOYMENT,
      messages: [system, user],
      temperature: 0
    });

    let ai;
    try {
      ai = JSON.parse(raw);
    } catch (e) {
      // Fallback sanitize if model added code-fence or text
      const firstBrace = raw.indexOf('{');
      const lastBrace = raw.lastIndexOf('}');
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        ai = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } else {
        throw new Error('AI did not return valid JSON');
      }
    }

    // 4) Save
    resume.analysis = {
      category: ai.category || '',
      technologies: ai.technologies || [],
      counts: ai.counts || {},
      relevanceScore: Number(ai.relevanceScore ?? 0),
      comments: ai.comments || '',
      similarityScore: Number(similarityScore.toFixed(4))
    };
    await resume.save();

    res.json({ message: 'Analysis complete', analysis: resume.analysis, resumeId: resume._id });
  } catch (err) {
    console.error('analyse error', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// GET /api/resume?jdId=...
router.get('/', async (req, res) => {
  const { jdId } = req.query;
  const q = jdId ? { jdId } : {};
  const items = await Resume.find(q).sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/resume/export.csv?jdId=...
router.get('/export.csv', async (req, res) => {
  const { jdId } = req.query;
  const q = jdId ? { jdId } : {};
  const items = await Resume.find(q).populate('jdId', 'title');
  const rows = [
    ['CandidateName', 'ResumeFile', 'JD Title', 'Similarity(0..1)', 'Relevance(0..100)', 'Category', 'Tech', 'Comments']
  ];
  for (const r of items) {
    rows.push([
      r.candidateName || '',
      r.filename || '',
      r.jdId?.title || '',
      r.analysis?.similarityScore ?? '',
      r.analysis?.relevanceScore ?? '',
      r.analysis?.category || '',
      (r.analysis?.technologies || []).join('; '),
      (r.analysis?.comments || '').replace(/\n/g, ' ')
    ]);
  }
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  res.setHeader('Content-Disposition', 'attachment; filename=resume_report.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

module.exports = router;







// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse");
// const fs = require("fs");
// const OpenAI = require("openai");
// const Resume = require("../models/Resume");
// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// // Upload Resume
// router.post("/upload", upload.single("resume"), async (req, res) => {
//     try {
//         const resume = new Resume({
//         filename: req.file.originalname,
//         fileType: req.file.mimetype,
//         filePath: req.file.path
//         });
//         await resume.save();

//         res.json({ message: "File uploaded successfully", resumeId: resume._id });
//     } catch (err) {
//         res.status(500).json({ error: "Upload failed" });
//     }
//     });

// // Analyse Resume (AI Score)
// router.post("/analyse/:id", async (req, res) => {
//   try {
//     const resume = await Resume.findById(req.params.id);
//     if (!resume) return res.status(404).json({ error: "Resume not found" });

//     // Extract text (PDF only for now)
//     let text = "";
//     if (resume.fileType.includes("pdf")) {
//       const dataBuffer = fs.readFileSync(resume.filePath);
//       const pdfData = await pdfParse(dataBuffer);
//       text = pdfData.text;
//     } else {
//       text = "Image parsing not yet implemented"; // OCR can be added
//     }

//     // Ask OpenAI
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an AI resume analyser. Extract key info and provide category, technologies, counts, relevance score (0-100), and comments."
//         },
//         { role: "user", content: text }
//       ]
//     });

//     const analysis = completion.choices[0].message.content;

//     resume.analysis = JSON.parse(analysis); // Expect structured JSON
//     await resume.save();

//     res.json({ message: "Analysis done", analysis: resume.analysis });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// module.exports = router;


