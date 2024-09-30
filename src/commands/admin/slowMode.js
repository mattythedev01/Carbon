const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const SlowModeModel = require("../../schemas/slowModeSchema");
const ModerationSystem = require("../../schemas/moderation");
const ButtonPagination = require("../../utils/buttonPagination");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription(
      "Manage slow mode settings for channels with advanced features."
    )
    .addSubcommand((s) =>
      s
        .setName("set")
        .setDescription("Set slow mode for a channel with advanced options.")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("The channel to set slow mode for.")
            .setRequired(true)
        )
        .addIntegerOption((o) =>
          o
            .setName("duration")
            .setDescription("The duration for slow mode (in seconds).")
            .setRequired(true)
        )
        .addBooleanOption((o) =>
          o
            .setName("silent")
            .setDescription(
              "Silently apply slow mode without notifying the channel."
            )
            .setRequired(false)
        )
        .addRoleOption((o) =>
          o
            .setName("exempt-role")
            .setDescription("The role to exempt from slow mode.")
            .setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("check")
        .setDescription(
          "Check the slow mode settings for a channel with advanced details."
        )
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("The channel to check slow mode for.")
            .setRequired(true)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("remove")
        .setDescription(
          "Remove slow mode from a channel with advanced options."
        )
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("The channel to remove slow mode from.")
            .setRequired(true)
        )
        .addBooleanOption((o) =>
          o
            .setName("silent")
            .setDescription(
              "Silently remove slow mode without notifying the channel."
            )
            .setRequired(false)
        )
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  run: async (client, interaction) => {
    try {
      const { options, guildId } = interaction;
      const subcommand = options.getSubcommand();

      /// OPTIONAL
      let moderationDocument = await ModerationSystem.findOne({
        GuildID: guildId,
      });
      if (!moderationDocument)
        return interaction.reply({
          content: "`⚠️` Please setup the moderation system before continuing.",
          ephemeral: true,
        });
      /// OPTIONAL

      if (subcommand === "set") {
        const channel = options.getChannel("channel");
        const duration = options.getInteger("duration");
        const silent = options.getBoolean("silent");
        const exemptRole = options.getRole("exempt-role");

        if (duration < 0) {
          return interaction.reply({
            content: "`❌` Duration must be a positive number.",
            ephemeral: true,
          });
        }

        const slowMode = await SlowModeModel.findOne({
          ChannelID: channel.id,
          GuildID: guildId,
        });

        if (slowMode) {
          await SlowModeModel.updateOne(
            { _id: slowMode._id },
            {
              $set: {
                Duration: duration,
                Silent: silent,
                ExemptRole: exemptRole ? exemptRole.id : null,
              },
            }
          );
          await channel.setRateLimitPerUser(duration);
          if (!silent) {
            interaction.reply({
              content: `\`✅\` Slow mode duration updated for ${channel.name} to ${duration} seconds.`,
              ephemeral: true,
            });
            // Log the action in the moderation log channel
            const logChannel = await client.channels.fetch(
              moderationDocument.LogChannelID
            );
            const logEmbed = new EmbedBuilder()
              .setColor(mConfig.embedColorSuccess)
              .setTitle(`\`✅\` Slow Mode Duration Updated`)
              .setDescription(
                `Channel: ${channel.name}\nDuration: ${duration} seconds`
              )
              .setTimestamp();
            logChannel.send({ embeds: [logEmbed] });
          }
        } else {
          const newSlowMode = new SlowModeModel({
            GuildID: guildId,
            ChannelID: channel.id,
            Duration: duration,
            Silent: silent,
            ExemptRole: exemptRole ? exemptRole.id : null,
          });
          await newSlowMode.save();
          await channel.setRateLimitPerUser(duration);
          if (!silent) {
            interaction.reply({
              content: `\`✅\` Slow mode set for ${channel.name} with a duration of ${duration} seconds.`,
              ephemeral: true,
            });
            // Log the action in the moderation log channel
            const logChannel = await client.channels.fetch(
              moderationDocument.LogChannelID
            );
            const logEmbed = new EmbedBuilder()
              .setColor(mConfig.embedColorSuccess)
              .setTitle(`\`✅\` Slow Mode Set`)
              .setDescription(
                `Channel: ${channel.name}\nDuration: ${duration} seconds`
              )
              .setTimestamp();
            logChannel.send({ embeds: [logEmbed] });
          }
        }
      } else if (subcommand === "check") {
        const channel = options.getChannel("channel");
        const slowMode = await SlowModeModel.findOne({
          ChannelID: channel.id,
          GuildID: guildId,
        });

        if (slowMode) {
          const checkEmbed = new EmbedBuilder()
            .setColor(mConfig.embedColorSuccess)
            .setTitle(`\`🔄\` Slow Mode Settings for ${channel.name}`)
            .setDescription(
              `**Duration:** ${slowMode.Duration} seconds\n**Silent:** ${
                slowMode.Silent ? "Yes" : "No"
              }\n**Exempt Role:** ${
                slowMode.ExemptRole ? `<@&${slowMode.ExemptRole}>` : "None"
              }`
            )
            .setTimestamp();

          interaction.reply({ embeds: [checkEmbed], ephemeral: true });
        } else {
          interaction.reply({
            content: `\`❌\` Slow mode is not enabled for ${channel.name}.`,
            ephemeral: true,
          });
        }
      } else if (subcommand === "remove") {
        const channel = options.getChannel("channel");
        const silent = options.getBoolean("silent");

        await SlowModeModel.deleteOne({
          ChannelID: channel.id,
          GuildID: guildId,
        });
        await channel.setRateLimitPerUser(0);
        if (!silent) {
          interaction.reply({
            content: `\`✅\` Slow mode removed for ${channel.name}.`,
            ephemeral: true,
          });
          // Log the action in the moderation log channel
          const logChannel = await client.channels.fetch(
            moderationDocument.LogChannelID
          );
          const logEmbed = new EmbedBuilder()
            .setColor(mConfig.embedColorSuccess)
            .setTitle(`\`✅\` Slow Mode Removed`)
            .setDescription(`Channel: ${channel.name}`)
            .setTimestamp();
          logChannel.send({ embeds: [logEmbed] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
