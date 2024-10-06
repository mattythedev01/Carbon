const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "time",
  description: "the current time and date",

  run: async (client, message, args) => {
    const { guild } = message;
    const dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    const guildID = guild.id;

    if (!args[0] || args[0].toLowerCase() !== `${guildPrefix}time`) {
      return message.channel.send("Invalid command usage.");
    }

    const embed = new EmbedBuilder()
      .setTimestamp()
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png"
      )
      .setColor("Purple")
      .setAuthor({ name: `⌚ Time Tool` })
      .setFooter({ text: `⌚ Fetched Date & Time` })
      .setTitle("> Current Date/Time")
      .addFields(
        {
          name: "• Time:",
          value: `> <t:${Math.floor(Date.now() / 1000)}:T>`,
          inline: true,
        },
        {
          name: "• Date:",
          value: `> <t:${Math.floor(Date.now() / 1000)}:D>`,
          inline: true,
        }
      );

    await message.channel.send({
      embeds: [embed],
    });
  },
};
