const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const giveawaySystemSchema = require("../../schemas/giveawaysystem"); // Changed to use the new schema
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveawaysystem")
    .setDescription("Configure the giveaway system")
    .addSubcommand((s) =>
      s
        .setName("channel")
        .setDescription("Set the giveaway channel.")
        .addChannelOption((o) =>
          o
            .setName("giveaway_channel")
            .setDescription(
              "Setup the giveaway channel where all giveaways go to."
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((o) =>
          o
            .setName("ping_role")
            .setDescription("The role to ping when a giveaway is won.")
            .setRequired(false)
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
        const giveawayChannel = options.getChannel("giveaway_channel");
        const pingRole = options.getRole("ping_role");

        let dataGD = await giveawaySystemSchema.findOne({ GuildID: guildId });
        if (!dataGD) {
          rEmbed
            .setColor(mConfig.embedColorWarning)
            .setDescription(
              "`⏳` New server detected: Configuring the giveaway system..."
            );

          await interaction.reply({
            embeds: [rEmbed],
            fetchReply: true,
            ephemeral: true,
          });

          dataGD = new giveawaySystemSchema({
            GuildID: guildId,
            ChannelID: giveawayChannel.id,
            RoleID: pingRole ? pingRole.id : null, // Added RoleID field
          });
          await dataGD.save();

          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription("`✅` Successfully configured the giveaway system!")
            .addFields(
              {
                name: "Guild ID",
                value: `${guildId}`,
                inline: true,
              },
              {
                name: "Channel ID",
                value: `${giveawayChannel.id}`,
                inline: true,
              },
              {
                name: "Ping Role ID",
                value: `${pingRole ? pingRole.id : "None"}`,
                inline: true,
              }
            );
          setTimeout(() => {
            interaction.editReply({ embeds: [rEmbed], ephemeral: true });
          }, 4000);
        } else {
          rEmbed
            .setColor(mConfig.embedColorWarning)
            .setDescription(
              "`⚠️` A giveaway channel is already set up. Please use the `remove` subcommand to change it."
            );
          interaction.reply({ embeds: [rEmbed], ephemeral: true });
        }
        break;
      }
    }
  },
};
