const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("oldest")
    .setDescription("Locate the oldest member in the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.Client} client
   * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
   */
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const oldestMember = interaction.guild.members.cache
      .sort((a, b) => a.user.createdAt - b.user.createdAt)
      .first();
    await interaction.reply(
      `The oldest member in the server is ${oldestMember.user.tag}.`
    );
  },
};
