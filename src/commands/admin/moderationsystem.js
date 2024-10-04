const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");
const suspiciousUsers = require("../../suspiciousUsers.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modsystem")
    .setDescription("Configure the moderation system")
    .addSubcommand((s) =>
      s
        .setName("configure")
        .setDescription("Advanced moderation system configuration.")
        .addChannelOption((o) =>
          o
            .setName("logging_channel")
            .setDescription(
              "Setup the logging channel where all moderation actions go to."
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addBooleanOption((o) =>
          o
            .setName("multi_guilded")
            .setDescription(
              "Adds your server on the list of allowing multi-guilded moderation."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("reset")
        .setDescription("Reset the moderation system to default settings.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild } = interaction;
    const subcmd = options.getSubcommand();
    if (!["configure", "reset"].includes(subcmd)) return;

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - Carbon`,
    });

    switch (subcmd) {
      case "configure": {
        const multiGuilded = options.getBoolean("multi_guilded");
        const loggingChannel = options.getChannel("logging_channel");

        let dataGD = await moderationSchema.findOne({ GuildID: guildId });
        if (!dataGD) {
          rEmbed
            .setColor(mConfig.embedColorWarning)
            .setDescription(
              "`⏳` New server detected: Configuring the moderation system..."
            );

          await interaction.reply({
            embeds: [rEmbed],
            fetchReply: true,
            ephemeral: true,
          });

          dataGD = new moderationSchema({
            GuildID: guildId,
            MultiGuilded: multiGuilded,
            LogChannelID: loggingChannel.id,
          });
          await dataGD.save();

          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription(
              "`✅` Successfully configured the moderation system!"
            )
            .addFields(
              {
                name: "Multi-guilded",
                value: `\`${multiGuilded ? "Yes" : "No"}\``,
                inline: true,
              },
              {
                name: "Logging Channel",
                value: `${loggingChannel}`,
                inline: true,
              }
            );
          setTimeout(() => {
            interaction.editReply({ embeds: [rEmbed], ephemeral: true });
          }, 4000);

          let i;
          for (i = 0; i < suspiciousUsers.ids.length; i++) {
            try {
              const suspiciousUsers = await guild.members.fetch(
                suspiciousUsers.ids[i]
              );

              await guild.bans.create(suspiciousUser, {
                deleteMessageSeconds: 60 * 60 * 24 * 7,
                reason: "Suspicious user listed by the devs.",
              });

              const lEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle("`⛔` User banned")
                .setAuthor({
                  name: suspiciousUser.user.username,
                  iconURL: suspiciousUser.user.displayAvatarURL({
                    dynamic: true,
                  }),
                })
                .addFields(
                  {
                    name: "Moderator:",
                    value: ` <@${client.user.id}>`,
                    inline: true,
                  },
                  {
                    name: "Reason:",
                    value: `\`Suspicious useer listed by developer. Please contact the developer if this happens to be a mistake.\``,
                    inline: true,
                  }
                )
                .setFooter({
                  iconURL: `${client.user.displayAvatarURL({ dyanmic: true })}`,
                  text: `${client.user.username} - Carbon`,
                });

              loggingChannel.send({ embeds: [lEmbed] });
            } catch (error) {
              continue;
            }
          }
        } else {
          await moderationSchema.findOneAndUpdate(
            { GuildID: guildId },
            {
              MultiGuilded: multiGuilded,
              LogChannelID: loggingChannel.id,
            }
          );

          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription(
              "`✅` Successfully configured the moderation system!"
            )
            .addFields(
              {
                name: "Multi-guilded",
                value: `\`${multiGuilded ? "Yes" : "No"}\``,
                inline: true,
              },
              {
                name: "Logging Channel",
                value: `${loggingChannel}`,
                inline: true,
              }
            );
          interaction.reply({ embeds: [rEmbed], ephemeral: true });
        }
        break;
      }
      case "reset": {
        const removed = await moderationSchema.findOneAndDelete({
          GuildID: guildId,
        });
        if (removed) {
          rEmbed
            .setColor(mConfig.embedColorSuccess)
            .setDescription("`✅` Successfully removed the moderation system!");
        } else {
          rEmbed
            .setColor(mConfig.embedColorError)
            .setDescription(
              "`❌` The server is not configured yet.\n\n`💡` Use `/modsystem configure` to configure the moderation system."
            );
        }
        interaction.reply({ embeds: [rEmbed], ephemeral: true });
        break;
      }
    }
  },
};
