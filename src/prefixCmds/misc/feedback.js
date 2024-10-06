const { EmbedBuilder, Client, Message } = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "feedback",
  description: "Send feedback to the developers.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const feedback = args[0]; // Assuming the first argument is the feedback
    const rating = parseInt(args[1], 10); // Assuming the second argument is the rating
    if (!feedback || !rating) {
      return message.reply("Please provide both feedback and a rating.");
    }

    const feedbackChannel = client.channels.cache.get("1290033222700240987"); // Channel id of the feedback channel
    const feedbackEmbed = new EmbedBuilder()
      .setTitle("New Feedback")
      .setDescription(`${feedback}`)
      .addFields(
        { name: "Rating", value: `${rating}/5`, inline: false },
        { name: "From", value: `${message.author.tag}`, inline: false }
      )
      .setColor("#0099ff");

    feedbackChannel.send({ embeds: [feedbackEmbed] });
    message.reply("Feedback sent!");
  },
};
