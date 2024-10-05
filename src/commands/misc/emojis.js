const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  time,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojis")
    .setDescription(
      "Lists the number of animated and non-animated emojis in the server."
    )
    .setDMPermission(false),
  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    const emojis = interaction.guild.emojis.cache;
    const animatedEmojis = emojis.filter((emoji) => emoji.animated);
    const nonAnimatedEmojis = emojis.filter((emoji) => !emoji.animated);

    const message = `Emoji Stats for ${interaction.guild.name}:\nTotal Emojis: ${emojis.size}\nAnimated Emojis: ${animatedEmojis.size}\nNon-Animated Emojis: ${nonAnimatedEmojis.size}`;

    await interaction.reply(message);
  },
};
