// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     messages: [
//         {
//             role: { type: String, required: true },
//             content: { type: String, required: true },
//             timestamp: { type: Number, required: true },
//         }
//     ],
//     userId: {
//         type: String,
//         required: true
//     },
//     likes: {
//         type: [String],
//         default: []
//     },
//     dislikes: {
//         type: [String],
//         default: []
//     }
// }, { timestamps: true });

// const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

// export default chatModel;

import mongoose from "mongoose";

// Define subdocument schema for messages
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  likes: {
    type: [String], // userIds who liked this message
    default: []
  },
  dislikes: {
    type: [String], // userIds who disliked this message
    default: []
  }
}, { _id: true }); // enable _id for each message

// Main chat schema
const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true }); // includes createdAt and updatedAt automatically

// Export model
const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);
export default chatModel;
