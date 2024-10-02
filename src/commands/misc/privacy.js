const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("🔒 Shows our privacy policy"),

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor("#7289DA")
      .setTitle("🚫 Privacy Policy")
      .setDescription(
        "> We respect your privacy and are committed to protecting your data. Here's what you need to know:"
      )
      .addFields(
        {
          name: "🔍 Data Collection",
          value:
            "> We only collect the information that is essential for our services.",
        },
        {
          name: "💻 Data Usage",
          value:
            "> Your data is used to enhance and personalize your experience with us.",
        },
        {
          name: "🔒 Data Protection",
          value:
            "> We prioritize the security and confidentiality of your data.",
        },
        {
          name: "🚫 Data Sharing",
          value: "> We do not share your data with any third parties.",
        },
        {
          name: "👥 Your Rights",
          value:
            "> You have the right to request the deletion of your data at any time.",
        },
        {
          name: "🔄 Policy Updates",
          value:
            "> This policy is subject to periodic updates. Please check back regularly for changes.",
        }
      )
      .setFooter({ text: `Last Updated: ${new Date().toLocaleDateString()}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
