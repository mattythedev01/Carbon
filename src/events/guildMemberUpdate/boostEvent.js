const { EmbedBuilder, Client, GuildMember } = require("discord.js");
const boostSchema = require("../../schemas/boostSchema");

module.exports = async (client, oldMember, newMember) => {
  if (!oldMember || !newMember) return;
  if (!oldMember.premiumSince && newMember.premiumSince) {
    const boostData = await boostSchema.findOne({
      GuildID: newMember.guild.id,
    });
    if (!boostData) return;

    const boostChannel = newMember.guild.channels.cache.get(
      boostData.boostingChannelID
    );
    if (!boostChannel) return;

    const boostEmbed = new EmbedBuilder()
      .setTitle(boostData.boostEmbedTitle)
      .setColor(boostData.boostEmbedColor)
      .setDescription(
        boostData.boostEmbedMsg.replace("[m]", newMember.toString())
      )
      .setFooter({
        text: `We now have ${newMember.guild.premiumSubscriptionCount} boosts!`,
      });

    boostChannel.send({
      content: boostData.boostMsg.replace("[m]", newMember.toString()),
      embeds: [boostEmbed],
    });
  }
};
