const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  time,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "channelinfo",
  description: "Receive information about the current channel",
  async run(client, message, args) {
    try {
      const guildId = message.guild.id; // Get the guild ID
      const guildPrefix = await moderationSchema
        .findOne({ GuildID: guildId })
        .then((doc) => (doc ? doc.GuildPrefix : null));
      if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

      const channel = message.channel;

      const replyEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({
          name: `${channel.name}`,
          iconURL: message.guild.iconURL(),
        })
        .addFields(
          { name: `Name`, value: `${channel.name}`, inline: true },
          {
            name: `Type`,
            value: `${ChannelType[channel.type]}`,
            inline: true,
          },
          {
            name: `ID`,
            value: `${channel.id}`,
            inline: true,
          },
          {
            name: `Created at`,
            value: `${time(Math.round(channel.createdTimestamp / 1000), "D")}`,
            inline: true,
          },
          {
            name: `Position`,
            value: `${channel.position}`,
            inline: true,
          }
        )
        .setTimestamp();

      message.channel.send({
        embeds: [replyEmbed],
      });
    } catch (error) {
      console.log(`An error occurred in the channelinfo command:\n\n${error}`);
    }
  },
};
