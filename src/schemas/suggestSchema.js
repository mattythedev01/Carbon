const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const suggestionSchema = new Schema(
  {
    UserID: String,
    GuildID: String,
    ChannelID: String,
    SuggestionID: {
      type: String,
      default: () => uuidv4().substring(1, 6), // Generates a random string of length 5
      unique: true,
    },
  },
  {
    strict: false,
  }
);

module.exports = model("suggestion", suggestionSchema);
