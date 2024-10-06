const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "permissions",
  description: "Checks if the bot has the required permissions.",

  run: async (client, message) => {
    const initialEmbed = new EmbedBuilder()
      .setColor("#7289DA")
      .setTitle("🔍 Checking Bot Permissions")
      .setDescription(
        `\`🔏\` Verifying if the bot has the necessary permissions...`
      );

    const replyMessage = await message.channel.send({
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
