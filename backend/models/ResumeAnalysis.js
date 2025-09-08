const mongoose = require("mongoose");
const ResumeAnalysisSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    category: String,
    entities: [String],
    relevanceScore: Number,
    comments: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
