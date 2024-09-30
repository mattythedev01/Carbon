const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

let warningSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => uuidv4(),
    },
    GuildID: String,
    UserID: String,
    Reason: String,
    ModeratorID: String,
    Timestamp: { type: Date, default: Date.now },
  },
  { strict: false }
);

module.exports = model("Warning", warningSchema);
