const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js"); // Imports necessary modules from the discord.js package

module.exports = {
  // Exporting the module to be used elsewhere

  data: new SlashCommandBuilder() // Defines the command data using SlashCommandBuilder
    .setName("bot-stats") // Sets the command name
    .setDescription("Get the bot status") // Sets the command description
    .toJSON(), // Converts the data to JSON format

  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    // Defines the function to be executed when the command is used
    try {
      const startTime = Date.now(); // Gets the current timestamp to calculate REST latency

      const placeEmbed = new EmbedBuilder() // Creates a placeholder embed to notify the user
        .setTitle("Fetching...") // Set's the embed title
        .setColor("Fuchsia"); // Set's the embed color

      await interaction.reply({ embeds: [placeEmbed] }); // Sends a placeholder embed as a reply to the interaction

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
          text: `Requested by ${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
        }); // Set's the embed footer

      await interaction.editReply({ embeds: [embed] }); // Sends the main embed with websocket and REST latencies as a reply to the interaction
    } catch (error) {
      console.log(`An error occured in the bot-status command:\n\n${error}`); // Catches any error's and log's it
    }
  },
};
