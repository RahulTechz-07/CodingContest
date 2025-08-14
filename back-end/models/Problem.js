import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  input: { type: String, required: true },         // Input format
  output: { type: String, required: true },        // Output format
  constraints: { type: String, required: true },   // Constraints
  testCases: [TestCaseSchema]
});

export default mongoose.model("Problem", ProblemSchema);
