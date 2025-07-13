import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ["user", "model"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ["en", "ar"],
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    }
  }]
}, { timestamps: true });

export default mongoose.model("ChatHistory", chatHistorySchema);