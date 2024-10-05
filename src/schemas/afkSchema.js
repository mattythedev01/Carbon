const mongoose = require("mongoose");

const afkSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AFK", afkSchema);
