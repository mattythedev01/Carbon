const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("🔒 Shows our privacy policy"),

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🚫 Privacy Policy")
      .setDescription(
        "👍 We respect your privacy. Here's what you need to know:"
      )
      .addFields(
        { name: "🔍 Data", value: "🚫 We only collect what's necessary." },
        {
          name: "💻 Usage",
          value: "🔄 We use your data to improve our service.",
        },
        { name: "🔒 Protection", value: "🔑 We keep your data safe." },
        { name: "🚫 Sharing", value: "🚫 We don't share your data." },
        {
          name: "👥 Your Rights",
          value: "🚫 You can ask us to delete your data.",
        },
        {
          name: "🔄 Updates",
          value: "🔄 This policy may change. Check back often.",
        }
      )
      .setFooter({ text: `🔄 Updated: ${new Date().toLocaleDateString()}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
