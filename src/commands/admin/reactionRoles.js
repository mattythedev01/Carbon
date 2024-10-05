const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Create a reaction role message.")
    .setDMPermission(false),

  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.Client} client
   * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
   */
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    await interaction.reply("Coming soon!");
  },
};
