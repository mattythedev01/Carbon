const { EmbedBuilder, time } = require("discord.js"); // Imports necessary modules from the discord.js package
const moderationSchema = require("../../schemas/moderation"); // Imports the moderation schema

module.exports = {
  // Exporting the module to be used elsewhere

  name: "bot-stats", // Sets the command name
  description: "Get the bot status", // Sets the command description

  async run(client, message, args) {
    // Defines the function to be executed when the command is used
    try {
      const guildId = message.guild.id; // Gets the guild ID
      const guildPrefix = await moderationSchema
        .findOne({ GuildID: guildId })
        .then((doc) => (doc ? doc.GuildPrefix : null));
      if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Checks if the message starts with the guild prefix

      const startTime = Date.now(); // Gets the current timestamp to calculate REST latency

      const placeEmbed = new EmbedBuilder() // Creates a placeholder embed to notify the user
        .setTitle("Fetching...") // Set's the embed title
        .setColor("Fuchsia"); // Set's the embed color

      await message.channel.send({ embeds: [placeEmbed] }); // Sends a placeholder embed as a reply to the message

      const latency = await client.ws.ping; // Websocket latency
      const restLatency = Date.now() - startTime; // REST latency
      const uptime = new Date(Date.now() - client.uptime); // Calculate uptime of the bot

      const embed = new EmbedBuilder() // Constructs a new embed
        .setAuthor({
          name: "Bot Status",
          iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
        })
        .addFields(
          {
            name: `\`🔌\`** | WebSocket:**`,
            value: `> *\`${latency} m/s\`*`,
            inline: true,
          },
          {
            name: `\`🌍\`** | REST:**`,
            value: `> *\`${restLatency} m/s\`*`,
            inline: true,
          },
          {
            name: `\`📈\`** | UpTime:**`,
            value: `> ${time(uptime, "R")}`,
            inline: true,
          },
          {
            name: `\`💻\`** | CPU:**`,
            value: `> *\`${(process.cpuUsage().system / 1024 / 1024).toFixed(
              2
            )}%\`*`,
            inline: true,
          },
          {
            name: `\`💽\`** | RAM:**`,
            value: `> *\`${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)}MB\`*`,
            inline: true,
          }
        )
        .setColor("Fuchsia") // Set's the embed color
        .setTimestamp() // Set's the embed timestamp
        .setFooter({
          text: `Requested by ${message.author.username}`,
          iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
        }); // Set's the embed footer

      await message.channel.send({ embeds: [embed] }); // Sends the main embed with websocket and REST latencies as a reply to the message
    } catch (error) {
      console.log(`An error occured in the bot-status command:\n\n${error}`); // Catches any error's and log's it
    }
  },
};
