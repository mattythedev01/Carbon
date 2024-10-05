const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hotlines")
    .setDescription("Get a list of mental health hotlines by country!")
    .setDMPermission(false),
  /**
   * @param {Discord.ChatInputApplicationCommandData} interaction
   */
  run: async (client, interaction) => {
    const hotlineEmbed = new EmbedBuilder()
      .setTitle("Mental Health Hotlines")
      .setDescription("Here are some mental health hotlines by country:")
      .setColor("#0099ff")
      .addFields(
        { name: "USA", value: "1-800-273-TALK (8255)", inline: false },
        { name: "Canada", value: "1-833-456-4566", inline: false },
        { name: "UK", value: "116 123", inline: false },
        { name: "Australia", value: "13 11 14", inline: false },
        { name: "India", value: "1-860-266-0111", inline: false },
        { name: "Germany", value: "0800 181 0777", inline: false },
        { name: "France", value: "01 46 21 46 46", inline: false },
        { name: "Japan", value: "03-5774-0992", inline: false },
        { name: "China", value: "400-821-1215", inline: false },
        { name: "Brazil", value: "188", inline: false },
        { name: "Russia", value: "8-800-555-73-33", inline: false },
        { name: "South Africa", value: "0800 205 026", inline: false },
        { name: "Spain", value: "902 500 002", inline: false },
        { name: "Italy", value: "114", inline: false },
        { name: "Mexico", value: "5250-1230", inline: false },
        { name: "Sweden", value: "020-22 00 60", inline: false },
        { name: "Switzerland", value: "143", inline: false },
        { name: "Netherlands", value: "0900-0113", inline: false },
        { name: "New Zealand", value: "0800 543 354", inline: false },
        { name: "Poland", value: "116 123", inline: false },
        { name: "Portugal", value: "21 854 07 07", inline: false },
        { name: "South Korea", value: "1393", inline: false },
        { name: "Turkey", value: "183", inline: false }
      );

    await interaction.reply({ embeds: [hotlineEmbed] });
  },
};
