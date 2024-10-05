const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverlists")
    .setDescription("Lists all servers the bot is in."),
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.Client} client
   * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
   */
  userPermissions: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  devOnly: true,

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */

  run: async (client, interaction) => {
    const guilds = client.guilds.cache
      .map((guild, index) => `${index + 1}- ${guild.name}`)
      .join("\n");
    const embed = new EmbedBuilder()
      .setTitle("List of Servers")
      .setDescription(guilds)
      .setColor("#0099ff")
      .setFooter({
        text: `Total Servers: ${client.guilds.cache.size}`,
        iconURL: client.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
};
