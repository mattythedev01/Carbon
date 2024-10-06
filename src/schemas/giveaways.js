const { model, Schema } = require("mongoose");

const giveaways = new Schema(
  {
    GiveawayID: { type: String, required: true, length: 12 },
    CreatorID: { type: String, required: false },
    Prize: { type: String, required: false },
    StartDate: { type: Date, required: false },
    EndDate: { type: Date, required: false },
    Participants: { type: Array, required: false },
    WinnerID: { type: String, required: false },
    IsActive: { type: Boolean, required: false },
    GuildID: { type: String, required: false },
    ChannelID: { type: String, required: false },
  },
  {
    strict: false,
  }
);

module.exports = model("giveaways", giveaways);
