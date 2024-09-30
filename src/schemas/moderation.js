const { model, Schema } = require("mongoose");

let moderationSchema = new Schema(
  {
    GuildID: String,
    MultiGuilded: Boolean,
    MuteRoleID: String,
    LogChannelID: String,
  },
  { strict: false }
);

module.exports = model("moderation", moderationSchema);
