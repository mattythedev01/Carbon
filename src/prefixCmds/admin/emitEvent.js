const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "emit-event",
  description: "Emit an event to the client",

  run: async (client, message, args) => {
    const { guild } = message;
    let dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    if (!message.content.startsWith(guildPrefix)) return;

    const event = args[0];

    switch (event) {
      case "guildMemberUpdate":
        client.emit("guildMemberUpdate", message.member, message.member);
        break;
      default:
        message.reply({
          content: "Try again! Valid events to emit are: `guildMemberUpdate`",
          ephemeral: true,
        });
        break;
    }

    message.reply({
      content: `Emitted event \`${event}\``,
      ephemeral: true,
    });
  },
};
