const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate your message to a different language.")
    .addStringOption((option) =>
      option.setName("text").setDescription("message input").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("choose a language to translate from")
        .setRequired(true)
        .setChoices(
          { name: "Automatic", value: "auto" },
          { name: "Arabic", value: "ar" },
          { name: "Bengali", value: "bn" },
          { name: "Chinese Simplified", value: "zh-cn" },
          { name: "Danish", value: "da" },
          { name: "Dutch", value: "nl" },
          { name: "English", value: "en" },
          { name: "Filipino", value: "tl" },
          { name: "French", value: "fr" },
          { name: "German", value: "de" },
          { name: "Greek", value: "el" },
          { name: "Hindi", value: "hi" },
          { name: "Italian", value: "it" },
          { name: "Japanese", value: "ja" },
          { name: "Polish", value: "pl" },
          { name: "Russian", value: "ru" },
          { name: "Spanish", value: "es" },
          { name: "Swedish", value: "sv" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("choose a language to translate to")
        .setRequired(true)
        .setChoices(
          { name: "Automatic", value: "auto" },
          { name: "Arabic", value: "ar" },
          { name: "Bengali", value: "bn" },
          { name: "Chinese Simplified", value: "zh-cn" },
          { name: "Danish", value: "da" },
          { name: "Dutch", value: "nl" },
          { name: "English", value: "en" },
          { name: "Filipino", value: "tl" },
          { name: "French", value: "fr" },
          { name: "German", value: "de" },
          { name: "Greek", value: "el" },
          { name: "Hindi", value: "hi" },
          { name: "Italian", value: "it" },
          { name: "Japanese", value: "ja" },
          { name: "Polish", value: "pl" },
          { name: "Russian", value: "ru" },
          { name: "Spanish", value: "es" },
          { name: "Swedish", value: "sv" }
        )
    ),

  category: "Text",
  cooldown: 5000,

  run: async (client, interaction) => {
    const msg = interaction.options.getString("text");
    const from = interaction.options.getString("from");
    const to = interaction.options.getString("to");

    const translated = await translate(msg, { from: from, to: to });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: `Google Translate` })
      .setTitle(`${client.user.username} has translated a message`)
      .setDescription(`> **From:** ${from} **to:** ${to}`)
      .setFields(
        { name: "Inputted Text", value: `> ${msg}` },
        { name: "Translated Text", value: `> ${translated.text}` }
      )
      .setFooter({ text: `Google Translate` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
