const { Schema, model } = require("mongoose");

const slowmodeSchema = new Schema({
  GuildID: String,
  ChannelID: String,
  Duration: String,
});

module.exports = model("slowmode", slowmodeSchema);
