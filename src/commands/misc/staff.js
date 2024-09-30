const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("👥🔗 Lists essential links for the bot staff!"),

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🌟🔗 Carbon's Staff 🌟")
      .setDescription("👇 Explore these useful links for the bot staff 👇")
      .addFields(
        {
          name: "👤 **Matty<3**",
          value:
            "> ID: 1258970427141914727\n> Description: Responsible for maintaining the Discord server and Discord bot and all of the projects.",
        },
        {
          name: "👤 **Staff Member 2 Coming Soon**",
          value:
            "> ID: 0987654321\n> Description: Handles bot support and troubleshooting.",
        },
        {
          name: "👤 **Staff Member 3 Coming Soon**",
          value:
            "> ID: 1357924680\n> Description: Manages community events and engagement.",
        }
      )
      .setFooter({
        text: "🌐 Check out these useful links and get involved! 🌐",
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Discord Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE"),
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://mattythedev01.github.io/carbonbot/")
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });
  },
};
