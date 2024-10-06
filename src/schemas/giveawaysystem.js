const { model, Schema } = require("mongoose");

const giveawaySystemSchema = new Schema(
  {
    GuildID: String,
    ChannelID: String,
    RoleID: String, // Added RoleID field
  },
  {
    strict: false,
  }
);

module.exports = model("giveawaySystem", giveawaySystemSchema);
