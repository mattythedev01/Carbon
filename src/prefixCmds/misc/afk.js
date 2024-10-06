const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require(`discord.js`);
const AFK = require("../../schemas/afkSchema");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "afk",
  description: "Set yourself as AFK",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    const reason = args.join(" ") || "No reason provided";

    const afkEntry = new AFK({
      guildId: guildId,
      userId: message.author.id,
      reason: reason,
    });

    await afkEntry.save();

    await message.channel.send(`You have been set as AFK. Reason: ${reason}`);

    const messageListener = async (message) => {
      if (message.author.bot || !message.mentions.users.has(message.author.id))
        return;

      const afkStatus = await AFK.findOne({ userId: message.author.id });
      if (!afkStatus) return;

      await message.channel.send(
        `${message.author} is currently AFK. Reason: ${afkStatus.reason}`
      );
    };

    const activityListener = async (message) => {
      if (message.author.bot || message.author.id !== message.author.id) return;

      const afkStatus = await AFK.findOne({ userId: message.author.id });
      if (!afkStatus) return;

      await AFK.deleteOne({ userId: message.author.id });
      client.removeListener("messageCreate", messageListener);
      client.removeListener("messageCreate", activityListener);

      await message.reply(
        `Welcome back ${message.author}! You have been removed from the AFK list.`
      );
    };

    client.on("messageCreate", messageListener);
    client.on("messageCreate", activityListener);
  },
};
