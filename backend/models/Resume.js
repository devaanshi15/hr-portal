const mongoose = require("mongoose");
const ResumeSchema = new mongoose.Schema({
  candidateName: String,
  filePath: String,  
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);



// const mongoose = require('mongoose');

// const resumeSchema = new mongoose.Schema({
//   filename: String,
//   fileType: String,
//   filePath: String, 
//   uploadDate: { type: Date, default: Date.now },

//   analysis: {
//     category: String,
//     technologies: [String],
//     counts: Object,
//     relevanceScore: Number,
//     comments: String
//   }
// });

// module.exports = mongoose.model('Resume', resumeSchema);
