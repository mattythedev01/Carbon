const { model, Schema } = require("mongoose");

let ticketSchema = new Schema(
  {
    GuildID: String,
    ticketMemberID: String,
    ticketChannelID: String,
    parentTicketChannelID: String,
    rating: Number,
    feedback: String,
    closed: Boolean,
    membersAdded: Array,
  },
  {
    strict: false,
  }
);

module.exports = model("ticket", ticketSchema);
