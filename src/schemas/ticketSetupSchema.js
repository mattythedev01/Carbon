const { model, Schema } = require("mongoose");

let ticketSetupSchema = new Schema(
  {
    GuildID: String,
    feedbackChannelID: String,
    ticketChannelID: String,
    staffRoleID: String,
    ticketType: String,
  },
  {
    strict: false,
  }
);

module.exports = model("ticket-setup", ticketSetupSchema);
