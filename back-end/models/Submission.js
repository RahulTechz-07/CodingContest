// models/Submission.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  problemId: { type: String, required: true },
  language_id: Number,
  source_code: String,
  testCaseResults: [
    {
      input: String,
      output: String,
      expected: String,
      passed: Boolean
    }
  ],
  score: Number,
  description: String,
}, { _id: false }); // prevents extra _id in subdocuments

export { SubmissionSchema };
const Submission = mongoose.model('Submission', SubmissionSchema);
export default Submission;
