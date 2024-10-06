const { EmbedBuilder, Colors } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "ping",
  description: "Check the bot's ping and other advanced information",

  run: async (client, message) => {
    const { guildId } = message;
    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setColor(Colors.Green)
      .setDescription(`The bot's ping is ${client.ws.ping}ms`)
      .addFields(
        { name: "WebSocket Ping", value: `${client.ws.ping}ms`, inline: false },
        { name: "Uptime", value: `${client.uptime}ms`, inline: false },
        {
          name: "Memory Usage",
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )} MB`,
          inline: false,
        },
        {
          name: "CPU Usage",
          value: `${(process.cpuUsage().user / 1000).toFixed(2)}%`,
          inline: false,
        }
      )
      .setFooter({ text: `Prefix: ${guildPrefix}` });

    await message.channel.send({ embeds: [embed] });
  },
};
