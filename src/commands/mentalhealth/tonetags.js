const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tonetags")
    .setDescription("Learn about Tone Tags and Indicators!")
    .setDMPermission(false),
  /**
   * @param {Discord.ChatInputApplicationCommandData} interaction
   */
  run: async (client, interaction) => {
    const toneTagsEmbed = new EmbedBuilder()
      .setTitle("🌈 Tone Tags and Indicators 🌈")
      .setDescription(
        "Tone Tags and Indicators are a way to clarify the tone or intent behind a message, helping to avoid misunderstandings and promote clear communication. They can be especially useful in digital communication where tone can be easily misinterpreted.\n\nPeople use Tone Tags and Indicators to ensure their messages are conveyed in the intended way, reducing the risk of misinterpretation and promoting a more harmonious online environment."
      )
      .setColor(0x0099ff);

    const toneTagsButton = new ButtonBuilder()
      .setLabel("🔗 Tone Tags")
      .setStyle(ButtonStyle.Link)
      .setURL("https://tonetags.carrd.co/");

    const toneIndicatorsButton = new ButtonBuilder()
      .setLabel("🔗 Tone Indicators")
      .setStyle(ButtonStyle.Link)
      .setURL("https://toneindicators.carrd.co/");

    const row = new ActionRowBuilder().addComponents(
      toneTagsButton,
      toneIndicatorsButton
    );

    await interaction.reply({ embeds: [toneTagsEmbed], components: [row] });
  },
};
