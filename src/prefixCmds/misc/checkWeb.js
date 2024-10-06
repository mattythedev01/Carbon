const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require(`discord.js`);
const https = require(`https`);
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "checkwebsite",
  description: "Checks if a website is up.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const url = args[0];
    const verbose = args[1] === "verbose" || false;
    try {
      https
        .get(url, (response) => {
          if (response.statusCode === 200) {
            if (verbose) {
              message.channel.send(
                `${url} is up! Response code: ${response.statusCode}`
              );
            } else {
              message.channel.send(`${url} is up!`);
            }
          } else {
            if (verbose) {
              message.channel.send(
                ` ${url} is down! Response code: ${response.statusCode}`
              );
            } else {
              message.channel.send(`${url} is down!`);
            }
          }
        })
        .on("error", (error) => {
          console.error(error);
          message.channel.send(`There was an error checking ${url}`);
        });
    } catch (error) {
      console.error(error);
      message.channel.send(`There was an error checking ${url}`);
    }
  },
};
