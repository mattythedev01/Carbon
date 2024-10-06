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

    if (!args[0] || args[0].toLowerCase() !== `${guildPrefix}userinfo`) {
      return message.channel.send("Invalid command usage.");
    }

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);
    let userInfoEmbed;
    if (!member) {
      const roles =
        "```" +
        message.member.roles.cache.map((role) => role.name).join(`, `) +
        "```";
      const perms =
        "```" + message.member.permissions.toArray().join(`\n`) + "```";
      let badges =
        "```" + message.member.user.flags.toArray().join(", ") + "```";
      if (badges === "``````") badges = "```None```";
      userInfoEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("User Information")
        .addFields(
          { name: "Username:", value: `${message.member.user.tag}` },
          { name: "User ID:", value: `${message.member.user.id}` },
          {
            name: "Account Since:",
            value: `${moment(message.member.user.createdTimestamp).format(
              "LT"
            )} ${moment(message.member.user.createdTimestamp).format(
              "LL"
            )} (${moment(message.member.user.createdTimestamp).fromNow()})`,
          },
          { name: "Badges:", value: `${badges}` },
          {
            name: "Joined At:",
            value: `${moment(message.member.joinedTimestamp).format(
              "LT"
            )} ${moment(message.member.joinedTimestamp).format("LL")} (${moment(
              message.member.joinedTimestamp
            ).fromNow()})`,
          },
          { name: "Roles", value: `${roles}` },
          { name: "Permissions", value: `${perms}` }
        )
        .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    } else {
      const roles =
        "```" + member.roles.cache.map((role) => role.name).join(`, `) + "```";
      const perms = "```" + member.permissions.toArray().join(`\n`) + "```";
      let badges = "```" + member.user.flags.toArray().join(", ") + "```";
      if (badges === "``````") badges = "```None```";
      userInfoEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle(`${member.user.username}'s User Information`)
        .addFields(
          { name: "Username: ", value: `${member.user.tag}` },
          { name: "User ID: ", value: `${member.user.id}` },
          {
            name: "Account Since:",
            value: `${moment(member.user.createdTimestamp).format(
              "LT"
            )} ${moment(member.user.createdTimestamp).format("LL")} (${moment(
              member.user.createdTimestamp
            ).fromNow()})`,
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
    }
    message.channel.send({ embeds: [userInfoEmbed] });
  },
};
