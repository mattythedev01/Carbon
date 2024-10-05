const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const suggestSchema = require("../../schemas/suggestSchema");

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
    let dataSuggest = await suggestSchema.findOne({ GuildID: guildId });

    const setupEmbed = new EmbedBuilder()
      .setColor("#FFD700") // A more vibrant yellow color
      .setTitle(`🚨 Moderation System Setup Status for ${guild.name} 🚨`)
      .setDescription(
        "Below is the current setup status for the moderation system in your server."
      )
      .setThumbnail(guild.iconURL()) // Adds the server icon as the thumbnail
      .setTimestamp() // Adds the current timestamp
      .setFooter({
        text: "Moderation System Setup",
        iconURL: client.user.displayAvatarURL(),
      });

    if (!dataGD) {
      setupEmbed.addFields({
        name: "🚫 Moderation System",
        value: "Not setup",
        inline: false,
      });
    } else {
      setupEmbed.addFields(
        {
          name: "🚫 Moderation System",
          value: "Correctly Setup",
          inline: false,
        },
        {
          name: "🔄 Multi-guilded",
          value: `${dataGD.MultiGuilded ? "Yes" : "No"}`,
          inline: true,
        },
        {
          name: "🚪 Logging Channel",
          value: `<#${dataGD.LogChannelID}>`,
          inline: true,
        }
      );
    }

    if (!dataSuggest) {
      setupEmbed.addFields({
        name: "🚫 Suggestion Channel",
        value: "Not setup",
        inline: true,
      });
    } else {
      setupEmbed.addFields({
        name: "🚫 Suggestion Channel",
        value: `<#${dataSuggest.ChannelID}>`,
        inline: true,
      });
    }

    interaction.reply({ embeds: [setupEmbed], ephemeral: true });
  },
};
