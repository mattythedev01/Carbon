const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "nickBtn",
  userPermissions: [PermissionFlagsBits.ManageNicknames],
  botPermissions: [PermissionFlagsBits.ManageNicknames],

  run: async (client, interaction) => {
    const { message, channel, guildId, guild, user } = interaction;

    const embedAuthor = message.embeds[0].author;
    const targetMember = await guild.members
      .fetch({
        query: embedAuthor.name,
        limit: 1,
      })
      .then((members) => members.first());

    if (!targetMember) {
      return interaction.reply({
        content: "Unable to find the target member.",
        ephemeral: true,
      });
    }

    const tagline = Math.floor(Math.random() * 1000) + 1;

    const rEmbed = new EmbedBuilder()
      .setColor("White")
      .setFooter({ text: client.user.username })
      .setAuthor({
        name: targetMember.user.username,
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `\`❔\` What is the reason to moderate the nickname of ${targetMember.user.username}?
        \`❕\` You have 15 seconds to reply or the actions will be cancelled automatically.
        \`💡\` To continue without a reason, answer with \`-\`
        \`💡\` To cancel the actions, answer with \`cancel\``
      );

    await message.edit({ embeds: [rEmbed], components: [] });

    const filter = (m) => m.author.id === user.id;
    try {
      const collected = await channel.awaitMessages({
        filter,
        max: 1,
        time: 15000,
        errors: ["time"],
      });
      const response = collected.first();

      if (response.content.toLowerCase() === "cancel") {
        await response.delete();
        rEmbed
          .setColor(mConfig.embedColorError)
          .setDescription(`\`❌\` Moderation action cancelled.`);
        await message.edit({ embeds: [rEmbed] });
        setTimeout(() => message.delete(), 2000);
        return;
      }

      let reason =
        response.content === "-" ? "No reason provided." : response.content;

      const dataGD = await moderationSchema.findOne({ GuildID: guildId });
      if (!dataGD) {
        return interaction.reply({
          content: "Moderation settings not found for this guild.",
          ephemeral: true,
        });
      }

      await targetMember.setNickname(`Moderated Nickname ${tagline}`);

      const { LogChannelID } = dataGD;
      const loggingChannel = guild.channels.cache.get(LogChannelID);

      if (loggingChannel) {
        const lEmbed = new EmbedBuilder()
          .setColor("White")
          .setTitle("`⛔` Moderated Nickname")
          .setAuthor({
            name: targetMember.user.username,
            iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `\`💡\` I have changed the user's nickname to - Moderated Nickname ${tagline}`
          )
          .addFields(
            { name: "Moderator:", value: `<@${user.id}>`, inline: true },
            { name: "Reason:", value: reason, inline: true }
          )
          .setFooter({
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
            text: client.user.username,
          });

        await loggingChannel.send({ embeds: [lEmbed] });
      }

      rEmbed
        .setColor(mConfig.embedColorSuccess)
        .setDescription(
          `\`✅\` Successfully changed the user's nickname to Moderated Nickname ${tagline}`
        );

      await message.edit({ embeds: [rEmbed] });
      setTimeout(() => message.delete(), 2000);
    } catch (error) {
      console.error(error);
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`\`❌\` Moderation action expired.`);
      await message.edit({ embeds: [rEmbed] });
      setTimeout(() => message.delete(), 2000);
    }
  },
};
