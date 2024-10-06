const { EmbedBuilder, Client, Message } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "support",
  description: "Sends an invite to the support server",

  run: async (client, message, args) => {
    const dataGD = await moderationSchema.findOne({
      GuildID: message.guild.id,
    });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    const guildID = message.guild.id;

    const embed = new EmbedBuilder()
      .setTitle("Support Server Invite")
      .setDescription(
        `[Click me for the support server invite!](https://discord.gg/4zaaRkTPZE)`
      )
      .setColor(0x0099ff);

    await message.channel.send({ embeds: [embed] });
  },
};
