const { EmbedBuilder } = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "oldest",
  description: "Locate the oldest member in the server.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const oldestMember = message.guild.members.cache
      .sort((a, b) => a.user.createdAt - b.user.createdAt)
      .first();
    await message.channel.send(
      `The oldest member in the server is ${oldestMember.user.tag}.`
    );
  },
};
