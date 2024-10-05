const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDMPermission(false)
    .setDescription("Sends an invite to the support server"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("Support Server Invite")
      .setDescription(
        "[Click me for the support server invite!](https://discord.gg/4zaaRkTPZE)"
      )
      .setColor(0x0099ff);

    await interaction.reply({ embeds: [embed] });
  },
};
