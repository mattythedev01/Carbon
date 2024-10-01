const { model, Schema } = require("mongoose");

const botPresenceSchema = new Schema(
  {
    ClientID: String,
    Presences: Array,
  },
  {
    strict: false,
  }
);

module.exports = model("botPresence", botPresenceSchema);
