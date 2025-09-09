const mongoose = require('mongoose');
const { Schema } = mongoose;

const analysisSchema = new Schema({
  category: String,
  technologies: [String],
  counts: Schema.Types.Mixed,   // e.g., { totalSkills: 12 }
  relevanceScore: Number,       // 0-100 from LLM
  comments: String,
  similarityScore: Number       // 0-1 cosine sim vs JD using embeddings
}, { _id: false });

const resumeSchema = new Schema({
  jdId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateName: String,                 // optional UI field later
  filename: String,
  fileType: String,
  filePath: String,
  uploadDate: { type: Date, default: Date.now },
  parsedText: String,                    // cached resume text
  analysis: analysisSchema
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);


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
