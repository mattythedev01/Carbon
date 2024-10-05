const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    noteId: {
      type: Number,
      min: 1,
      max: 100,
      required: true,
      unique: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    targetId: {
      // Added field as per instruction to log targetId
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Note", notesSchema);
