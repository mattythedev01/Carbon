const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const WarningModel = require("../../schemas/warningSchema");
const ModerationSystem = require("../../schemas/moderation");
const ButtonPagination = require("../../utils/buttonPagination");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Add, check, delete warns.")
    .addSubcommand((s) =>
      s
        .setName("add")
        .setDescription("Add a warning to a user.")
        .addUserOption((o) =>
          o
            .setName("user")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o.setName("reason").setDescription("The reason for the warn.")
        )
        .addIntegerOption((o) =>
          o
            .setName("duration")
            .setDescription("The duration for the warn (in minutes).")
        )
    )
    .addSubcommand((s) =>
      s
        .setName("check")
        .setDescription("Check a warning from a user.")
        .addUserOption((o) =>
          o.setName("user").setDescription("The user to warn.")
        )
    )
    .addSubcommand((s) =>
      s
        .setName("delete")
        .setDescription("Deletes a warning from a user.")
        .addUserOption((o) =>
          o
            .setName("user")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addIntegerOption((o) =>
          o
            .setName("index")
            .setDescription(
              "The index of the warning to delete (/warn check to find the index)."
            )
        )
    )
    .toJSON(),
  userPermissions: [],
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

      if (subcommand === "add") {
        const user = options.getUser("user");
        const reason = options.getString("reason") || "No reason provided.";
        const duration = options.getInteger("duration") || 0;

        if (user.bot || user.id === interaction.user.id)
          return interaction.reply({
            content: "`❌` You cannot add a warning to a bot or yourself.",
            ephemeral: true,
          });

        const member = interaction.guild.members.cache.get(user.id);
        if (
          member &&
          member.roles.highest.comparePositionTo(
            interaction.member.roles.highest
          ) >= 0
        )
          return interaction.reply({
            content:
              "`❌` You cannot add a warning to someone with equal or higher roles.",
            ephemeral: true,
          });

        const durationMilliseconds = duration * 60 * 1000;
        const newWarning = new WarningModel({
          GuildID: guildId,
          UserID: user.id,
          Reason: reason,
          ModeratorID: interaction.user.id,
        });
        await newWarning.save();

        if (durationMilliseconds > 0) {
          setTimeout(async () => {
            await WarningModel.deleteOne({ _id: newWarning._id });

            const targetUser = await client.users.fetch(user.id);
            const durationEndEmbed = new EmbedBuilder()
              .setColor(mConfig.embedColorSuccess)
              .setTitle("Warning Duration Ended")
              .setDescription(
                `\`⚠️\` Your warning duration has ended for the following reason:\n**Reason:** ${reason}`
              );

            targetUser
              .send({ embeds: [durationEndEmbed] })
              .catgch(console.error);
          }, durationMilliseconds);
        }
        try {
          const userDM = await user.createDM();
          userDM.send(
            `\`⚠️\` You have been warned in ${interaction.guild.name}.\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}\n**Duration:** ${duration} minutes.`
          );
        } catch (error) {
          console.error(
            `\`❌\` Failed to DM user ${user.tag}: ${error.message}`
          );
        }
        interaction.reply({
          content: `\`✅\` Warning added for ${user.tag}: ${reason} ${
            duration > 0 ? `(Duration ${duration} minutes.)` : ""
          }`,
          ephemeral: true,
        });

        const logEmbed = new EmbedBuilder()
          .setColor(mConfig.embedColorSuccess)
          .setTitle("`⚠️` Used Warned")
          .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dyanmic: true }),
          })
          .setDescription(
            `**Moderator:** ${interaction.user}\n**Reason:** ${reason}\n**Duration:** ${duration} minutes.`
          )
          .setTimestamp();

        const logChannel = client.channels.cache.get(
          moderationDocument.LogChannelID
        );
        if (logChannel) logChannel.send({ embeds: [logEmbed] });
      } else if (subcommand === "check") {
        const user = options.getUser("user") || interaction.user;
        const warnings = await WarningModel.find({
          GuildID: guildId,
          UserID: user.id,
        });
        const warningCount = warnings.length;

        if (warningCount === 0) {
          const noWarnsEmbed = new EmbedBuilder()
            .setColor(mConfig.embedColorSuccess)
            .setDescription(`\`❌\` ${user} has no warnings.`);

          await interaction.reply({ embeds: [noWarnsEmbed], ephemeral: true });
        } else {
          const warningPages = await Promise.all(
            warnings.map(async (warning, index) => {
              const warningIndex = index + 1;
              const moderator = await interaction.guild.members.fetch(
                warning.ModeratorID
              );
              const embed = new EmbedBuilder()
                .setColor(mConfig.embedColorSuccess)
                .setTitle(`\`⚠️\` ${user}'s Warnings - Warning ${warningIndex}`)
                .addFields(
                  {
                    name: "Moderator",
                    value: moderator
                      ? moderator.user.tag
                      : "`Unknown Moderator`",
                  },
                  {
                    name: "Reason",
                    value: warning.Reason,
                  }
                )
                .setFooter({
                  text: `Warning ID: ${warningIndex}`,
                  timestamp: warning.Timestamp,
                })
                .setTimestamp(warning.Timestamp);
              return embed;
            })
          );

          await ButtonPagination(interaction, warningPages);
        }
      } else if (subcommand === "delete") {
        try {
          const user = options.getUser("user");
          const index = options.getInteger("index") - 1;

          if (user.bot || user.id === interaction.user.id)
            return interaction.reply({
              content: "`❌` You cannot add a warning to a bot or yourself.",
              ephemeral: true,
            });

          const member = interaction.guild.members.cache.get(user.id);
          if (
            member &&
            member.roles.highest.comparePositionTo(
              interaction.member.roles.highest
            ) >= 0
          )
            return interaction.reply({
              content:
                "`❌` You cannot add a warning to someone with equal or higher roles.",
              ephemeral: true,
            });

          const warnings = await WarningModel.find({
            GuildID: guildId,
            UserID: user.id,
          });
          if (index >= 0 && index < warnings.length) {
            const deletedWarning = warnings[index];
            await WarningModel.deleteOne({
              GuildID: guildId,
              UserID: user.id,
              _id: deletedWarning._id,
            });
            interaction.reply({
              content: `\`✅\` Warning ${index + 1} deleted for ${user.tag}.`,
              ephemeral: true,
            });

            const logEmbed = new EmbedBuilder()
              .setColor(mConfig.embedColorSuccess)
              .setTitle("`✅` Warning Removed")
              .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ dyanmic: true }),
              })
              .setDescription(
                `**Moderator:** ${interaction.user.tag}
              }\n**Reason:** ${deletedWarning.Reason}\n**Duration:** ${
                  deletedWarning.Duration / (60 * 1000)
                } minutes.`
              )
              .setTimestamp();

            const logChannel = client.channels.cache.get(
              moderationDocument.LogChannelID
            );
            if (logChannel) logChannel.send({ embeds: [logEmbed] });

            if (deletedWarning.Duration > 0) {
              const endTimestamp = new Date(
                deletedWarning.Timestamp.getTime() + deletedWarning.Duration
              );

              const dmEmbed = new EmbedBuilder()
                .setColor(mConfig.embedColorSuccess)
                .setTitle("`✅` Warning Removed")
                .setAuthor({
                  name: user.tag,
                  iconURL: user.displayAvatarURL({ dyanmic: true }),
                })
                .setDescription(
                  `\`✅\` Your warning has been removed by a moderator.\n**Reason:** ${deletedWarning.REason}\n**Duration:** until ${endTimestamp.toISOString}`
                )
                .setTimestamp();

              const targetUser = await client.users.fetch(user.id);
              targetUser.send({ embeds: [dmEmbed] }).catch(console.error);
            }
          } else {
            return interaction.reply({
              content: `\`❌\` Invalid warning index. Please provide a value index.`,
              ephemeral: true,
            });
          }
        } catch (error) {
          console.log(error);
          return interaction.reply({
            content: `\`❌\` An error occured while proccessing the command,`,
            ephemeral: true,
          });
        }
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
