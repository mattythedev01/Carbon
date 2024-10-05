const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Send feedback to the developers.")
    .addStringOption((option) =>
      option
        .setName("feedback")
        .setDescription("Your feedback.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("rating")
        .setDescription("Your rating out of 5.")
        .setRequired(true)
        .addChoices(
          { name: "1", value: 1 },
          { name: "2", value: 2 },
          { name: "3", value: 3 },
          { name: "4", value: 4 },
          { name: "5", value: 5 }
        )
    ),
  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    const feedbackChannel = client.channels.cache.get("1290033222700240987"); // Channel id of the feedback channel
    const feedback = interaction.options.getString("feedback");
    const rating = interaction.options.getInteger("rating");
    const feedbackEmbed = new EmbedBuilder()
      .setTitle("New Feedback")
      .setDescription(`${feedback}`)
      .addFields(
        { name: "Rating", value: `${rating}/5`, inline: false },
        { name: "From", value: `${interaction.user.tag}`, inline: false }
      )
      .setColor("#0099ff");

    feedbackChannel.send({ embeds: [feedbackEmbed] });
    interaction.reply("Feedback sent!");
  },
};
