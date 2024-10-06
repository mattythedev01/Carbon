const { EmbedBuilder } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "help",
  description:
    "Help command is taken out temporarily! Will be back in a few days-weeks.",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    await message.channel.send({
      content:
        "Help command is taken out temporarily! Will be back in a few days-weeks.",
      ephemeral: true,
    });
  },
};
