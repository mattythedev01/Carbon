const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4 for generating unique ticketId

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    default: () => uuidv4(), // Generates a unique ticketId
    required: true,
    unique: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "open",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ticketChannel: {
    type: String,
    required: true,
  },
  ticketCategory: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
