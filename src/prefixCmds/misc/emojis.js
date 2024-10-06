const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  time,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "emojis",
  description:
    "Lists the number of animated and non-animated emojis in the server.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const emojis = message.guild.emojis.cache;
    const animatedEmojis = emojis.filter((emoji) => emoji.animated);
    const nonAnimatedEmojis = emojis.filter((emoji) => !emoji.animated);

    const messageContent = `Emoji Stats for ${message.guild.name}:\nTotal Emojis: ${emojis.size}\nAnimated Emojis: ${animatedEmojis.size}\nNon-Animated Emojis: ${nonAnimatedEmojis.size}`;

    await message.channel.send(messageContent);
  },
};
