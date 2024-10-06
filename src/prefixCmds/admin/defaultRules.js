const { EmbedBuilder, Colors } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "default-rules",
  description: "Gives the server basic rules.",

  run: async (client, message, args) => {
    const { guild } = message;
    let dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    if (!message.content.startsWith(guildPrefix)) return;

    const rulesEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🚫 Server Rules 🚫")
      .setDescription(
        "👉 These are the rules for the server. Please read them carefully to ensure a positive and respectful environment for everyone."
      )
      .addFields(
        {
          name: "🔄 Rule 1",
          value:
            "> Be respectful to others. Treat others the way you want to be treated.",
        },
        {
          name: "🚫 Rule 2",
          value:
            "> No spamming or flooding the chat with messages. Keep the conversation flowing smoothly.",
        },
        {
          name: "🔞 Rule 3",
          value:
            "> No adult content or NSFW content. Keep the server family-friendly.",
        },
        {
          name: "🚫 Rule 4",
          value:
            "> No hate speech or discriminatory remarks. We're all equal here.",
        },
        {
          name: "🚫 Rule 5",
          value:
            "> No hacking, exploiting, or cheating. Play fair and have fun.",
        },
        {
          name: "🔒 Rule 6",
          value:
            "> No sharing of personal information. Keep your personal life private.",
        },
        {
          name: "🚫 Rule 7",
          value:
            "> No advertising or self-promotion. This is not a marketplace.",
        },
        {
          name: "🚫 Rule 8",
          value:
            "> No sharing of pirated or illegal content. Respect creators' rights.",
        },
        {
          name: "🚫 Rule 9",
          value:
            "> No excessive swearing or offensive language. Keep it clean and respectful.",
        },
        {
          name: "🚫 Rule 10",
          value:
            "> Follow Discord's Terms of Service and Community Guidelines. We're all part of the Discord community.",
        }
      )
      .setTimestamp();
    //.setFooter('Server Rules');

    await message.channel.send({ embeds: [rulesEmbed] });
  },
};
