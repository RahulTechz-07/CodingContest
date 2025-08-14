// models/User.js
import mongoose from 'mongoose';
import { SubmissionSchema } from './Submission.js'; // ✅ CORRECT


const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true }, // This is the name from the frontend
  email: String,
  phone: String,
  college: String,
  teamName: String, // ✅ Added teamName
  problems: [SubmissionSchema], // array of problem submissions
  startTime: { type: Date, default: Date.now },
  endTime: Date
});

export default mongoose.model("User", UserSchema);
