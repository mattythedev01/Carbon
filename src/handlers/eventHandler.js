const path = require("path");
const getAllFiles = require("../utils/getAllFiles");
const { Collection } = require("discord.js");
const moderationSchema = require("../schemas/moderation");

module.exports = async (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);
  const prefixCommands = getAllFiles(
    path.join(__dirname, "..", "prefixCmds"),
    true
  );

  client.commands = new Collection();

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    let eventName;
    eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    eventName === "validations" ? (eventName = "interactionCreate") : eventName;

    client.on(eventName, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, ...args);
      }
    });
  }

  for (const prefixCommand of prefixCommands) {
    const commandFiles = getAllFiles(prefixCommand);
    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);
      client.commands.set(commandObject.name, commandObject);
    }
  }

  client.on("messageCreate", async (message) => {
    const { guildId, content } = message;
    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    if (!content.startsWith(guildPrefix) || message.author.bot) return;
    const args = content.slice(guildPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
      command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply({ content: "There was an error executing that command." });
    }
  });
};
