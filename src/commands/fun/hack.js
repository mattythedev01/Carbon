const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hack")
    .setDescription("Simulate a hacking process for fun!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The target to simulate hacking")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("method")
        .setDescription("The method to simulate hacking")
        .setRequired(true)
        .addChoices(
          { name: "Brute Force", value: "brute_force" },
          { name: "SQL Injection", value: "sql_injection" },
          { name: "Phishing", value: "phishing" },
          { name: "Social Engineering", value: "social_engineering" },
          { name: "Exploit", value: "exploit" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("The level of simulated hacking")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(8)
    ),
  /**
   * @param {Discord.ChatInputApplicationCommandData} interaction
   */
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const target = interaction.options.getUser("target");
    const method = interaction.options.getString("method");
    const level = interaction.options.getInteger("level");
    await interaction.reply(
      `Simulating hacking into ${target} using ${method} at level ${level}...`
    );
    // Simulate a fake hacking process
    const hackEmbed = new EmbedBuilder()
      .setTitle("Hacking Simulation Initiated")
      .setDescription(`Target: ${target}\nMethod: ${method}\nLevel: ${level}`)
      .setColor("#0099ff")
      .setTimestamp();
    await interaction.followUp({ embeds: [hackEmbed] });
  },
};
