const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const suggestSchema = require("../../schemas/suggestSchema"); // Changed to use the new schema
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestionsystem")
    .setDescription("Configure the suggestion system")
    .addSubcommand((s) =>
      s
        .setName("channel")
        .setDescription("Set the suggestion channel.")
        .addChannelOption((o) =>
          o
            .setName("suggestion_channel")
            .setDescription(
              "Setup the suggestion channel where all suggestions go to."
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild } = interaction;
    const subcmd = options.getSubcommand();
    if (!["channel"].includes(subcmd)) return;

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - Carbon`,
    });

    switch (subcmd) {
      case "channel": {
        const suggestionChannel = options.getChannel("suggestion_channel");

        let dataGD = await suggestSchema.findOne({ GuildID: guildId });
        if (!dataGD) {
          rEmbed
            .setColor(mConfig.embedColorWarning)
            .setDescription(
              "`⏳` New server detected: Configuring the suggestion system..."
            );

          await interaction.reply({
            embeds: [rEmbed],
            fetchReply: true,
            ephemeral: true,
          });

          dataGD = new suggestSchema({
            GuildID: guildId,
            ChannelID: suggestionChannel.id,
          });
          await dataGD.save();

          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription(
              "`✅` Successfully configured the suggestion system!"
            )
            .addFields(
              {
                name: "Guild ID",
                value: `${guildId}`,
                inline: true,
              },
              {
                name: "Channel ID",
                value: `${suggestionChannel.id}`,
                inline: true,
              }
            );
          setTimeout(() => {
            interaction.editReply({ embeds: [rEmbed], ephemeral: true });
          }, 4000);
        } else {
          await suggestSchema.findOneAndUpdate(
            { GuildID: guildId },
            {
              ChannelID: suggestionChannel.id,
            }
          );

          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription(
              "`✅` Successfully configured the suggestion system!"
            )
            .addFields(
              {
                name: "Guild ID",
                value: `${guildId}`,
                inline: true,
              },
              {
                name: "Channel ID",
                value: `${suggestionChannel.id}`,
                inline: true,
              }
            );
          interaction.reply({ embeds: [rEmbed], ephemeral: true });
        }
        break;
      }
    }
  },
};
