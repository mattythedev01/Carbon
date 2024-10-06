const Discord = require(`discord.js`);
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "docs",
  description: "Search the Discord.js documentation.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const query = args[0];
    const searchUrl = `https://discord.js.org/#/docs/main/stable/search?q=${encodeURIComponent(
      query
    )}`;
    message.channel.send(
      `Here is the search result for "${query}": ${searchUrl}`
    );
  },
};
