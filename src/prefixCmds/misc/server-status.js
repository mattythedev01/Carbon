const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");
module.exports = {
  name: "status-members",
  description: "Let's see what the status of the members are in this guild",
  async run(client, message, args) {
    const { guild } = message;
    let status = args[0];

    let dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    if (!status) {
      return message.reply(
        "Please specify the status you want to check. `Online or Offline`"
      );
    }

    status = status.toLowerCase();

    if (status !== "online" && status !== "offline") {
      return message.reply(
        "Invalid status. Please choose 'Online' or 'Offline'."
      );
    }

    guild.members.fetch({ withPresences: true }).then((fetchedMembers) => {
      const totalOnline = fetchedMembers.filter(
        (member) => member.presence?.status === "online"
      );
      const totalOffline = fetchedMembers.filter(
        (member) => member.presence?.status === "offline"
      );

      if (status === `online`) {
        message.reply(`${totalOnline.size} are online in this guild!`, {
          ephemeral: true,
        });
        console.log(
          `There are currently ${totalOnline.size} members online in this guild!`
        );
      }

      if (status === `offline`) {
        message.reply(`${totalOffline.size} are offline in this guild!`, {
          ephemeral: true,
        });
        console.log(
          `There are currently ${totalOffline.size} members offline in this guild!`
        );
      }
    });
  },
};
