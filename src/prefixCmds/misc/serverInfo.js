const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "serverinfo",
  description: "Receive information about the current guild",

  run: async (client, message, args) => {
    let serverIcon = message.guild.iconURL();
    let boostCount = message.guild.premiumSubscriptionCount;
    let boostTier = 0;

    if (boostCount >= 2) {
      boostTier = 1;
    } else if (boostCount >= 7) {
      boostTier = 2;
    } else if (boostCount >= 14) {
      boostTier = 3;
    }

    const fetchedOwner = await Promise.resolve(message.guild.fetchOwner());
    const dataGD = await moderationSchema.findOne({
      GuildID: message.guild.id,
    });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    const replyEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: `${message.guild.name}`, iconURL: serverIcon })
      .setThumbnail(serverIcon)
      .addFields(
        {
          name: "General information",
          value: `
            *Owner:* \`${fetchedOwner.user.tag}\`
                  *Member count:* \`${message.guild.memberCount}\`
                  *Boosts:* \`${boostCount}\``,
          inline: true,
        },
        {
          name: "Other",
          value: `
            *Roles:* \`${message.guild.roles.cache.size - 1}\`
                  *Boost tier:* \`${boostTier}\`
                  *Channels:* \`${
                    message.guild.channels.channelCountWithoutThreads
                  }\``,
          inline: true,
        }
      )
      .setFooter({ text: `${message.guild.id}` })
      .setTimestamp();

    message.channel.send({
      embeds: [replyEmbed],
    });
  },
};
