const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "Displays information about a user's account account.",

  run: async (client, message, args) => {
    const { guild } = message;
    const dataGD = await moderationSchema.findOne({
      GuildID: guild.id,
    });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    const guildID = guild.id;

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send("Please mention a user to get their info.");
    }

    const roles =
      "```" + member.roles.cache.map((role) => role.name).join(`, `) + "```";
    const perms = "```" + member.permissions.toArray().join(`\n`) + "```";
    let badges = "```" + member.user.flags.toArray().join(", ") + "```";
    if (badges === "``````") badges = "```None```";

    const userInfoEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${member.user.username}'s User Information`)
      .addFields(
        { name: "Username: ", value: `${member.user.tag}` },
        { name: "User ID: ", value: `${member.user.id}` },
        {
          name: "Account Since:",
          value: `${moment(member.user.createdTimestamp).format("LT")} ${moment(
            member.user.createdTimestamp
          ).format("LL")} (${moment(member.user.createdTimestamp).fromNow()})`,
        },
        { name: "Badges", value: `${badges}` },
        {
          name: "Joined At:",
          value: `${moment(member.joinedTimestamp).format("LT")} ${moment(
            member.joinedTimestamp
          ).format("LL")} (${moment(member.joinedTimestamp).fromNow()})`,
        },
        { name: "Roles:", value: `${roles}` },
        { name: "Permissions", value: `${perms}` }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    message.channel.send({ embeds: [userInfoEmbed] });
  },
};
