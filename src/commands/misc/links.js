const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("links")
    .setDescription(
      "🔗🌐 Lists essential links related to our bot and community!"
    ),

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🌟🔗 Useful Links 🌟")
      .setDescription("👇 Explore these useful links 👇")
      .addFields(
        {
          name: "🏆 **Top.gg**",
          value:
            "> [Top.gg](https://top.gg/bot/1287935866496356433) - Discover our bot's ranking and reviews!",
        },
        {
          name: "🌍 **Discord.place**",
          value:
            "> [Discord Place](https://discord.place/bots/1287935866496356433) - Find us among the best bots!",
        },
        {
          name: "🤖 **Discordbotlist.com**",
          value:
            "> [DBL](https://discordbotlist.com/bots/carbon-3775) - Check out our profile on DBL!",
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
