const { model, Schema } = require("mongoose");

let moderationSchema = new Schema(
  {
    GuildID: String,
    GuildPrefix: String, // Added GuildPrefix field
    MultiGuilded: Boolean,
    MuteRoleID: String,
    LogChannelID: String,
  },
  { strict: false }
);

module.exports = model("moderation", moderationSchema);
