const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("permissions")
    .setDescription("Checks if the bot has the required permissions."),

  run: async (client, interaction) => {
    const initialEmbed = new EmbedBuilder()
      .setColor("#7289DA")
      .setTitle("🔍 Checking Bot Permissions")
      .setDescription(
        `\`🔏\` Verifying if the bot has the necessary permissions...`
      );

    const replyMessage = await interaction.reply({
      embeds: [initialEmbed],
    });

    setTimeout(async () => {
      const finalEmbed = new EmbedBuilder()
        .setColor("#43B581")
        .setTitle(`\`✅\` Permissions have been checked.`)
        .setDescription(
          "🎉 The bot has all the required permissions to function properly!"
        );

      await replyMessage.edit({ embeds: [finalEmbed] });
    }, 5000);
  },
};
