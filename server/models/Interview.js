const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  type: String,
  question: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InterviewSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
