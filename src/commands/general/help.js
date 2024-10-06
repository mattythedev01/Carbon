const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Help command is taken out temporarily! Will be back in a few days-weeks."
    ),
  run: async (client, interaction) => {
    await interaction.reply({
      content:
        "Help command is taken out temporarily! Will be back in a few days-weeks.",
      ephemeral: true,
    });
  },
};
