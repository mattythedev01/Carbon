const { EmbedBuilder } = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "mc-info",
  description: "Shows some information on specified Minecraft server.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const serverAddress = args[0]; // Assuming the server address is the first argument

    try {
      const response = await fetch(
        `https://api.mcsrvstat.us/2/${serverAddress}`
      );
      const data = await response.json();

      if (data.online === true) {
        const serverStatus = "Online";
        const playerCount = data.players ? data.players.online : 0;

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({ name: `⛏ Minecraft Toolbox` })
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png"
          )
          .setFooter({ text: `⛏ Server Online` })
          .setTitle(`> Minecraft Server \n> Information: ${serverAddress}`)
          .addFields({ name: "• Status", value: `> ${serverStatus}` })
          .addFields({ name: "• Players Online", value: `> ${playerCount}` })
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        const serverStatus = "Offline";

        const embed = new EmbedBuilder()
          .setColor("DarkRed")
          .setAuthor({ name: `⛏ Minecraft Toolbox` })
          .setFooter({ text: `⛏ Server Offline` })
          .setThumbnail(
            "https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024"
          )
          .setTitle(`> Minecraft Server \n> Information: ${serverAddress}`)
          .addFields({ name: "• Status", value: `> ${serverStatus}` })
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      message.channel.send({
        content: `An error occurred while retrieving information for server: **${serverAddress}**.`,
        ephemeral: true,
      });
    }
  },
};
