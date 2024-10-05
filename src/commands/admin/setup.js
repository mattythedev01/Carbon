const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-setup")
    .setDescription("Check the moderation system setup")
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { guildId, guild } = interaction;
    let dataGD = await moderationSchema.findOne({ GuildID: guildId });

    const setupEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle(`Moderation System Setup Status for ${guild.name}`);

    if (!dataGD) {
      setupEmbed.setDescription("The moderation system is not setup yet.");
    } else {
      setupEmbed.setDescription("The moderation system is setup.");
      setupEmbed.addFields(
        {
          name: "Multi-guilded",
          value: `${dataGD.MultiGuilded ? "Yes" : "No"}`,
          inline: true,
        },
        {
          name: "Logging Channel",
          value: `<#${dataGD.LogChannelID}>`,
          inline: true,
        }
      );
    }

    interaction.reply({ embeds: [setupEmbed], ephemeral: true });
  },
};
