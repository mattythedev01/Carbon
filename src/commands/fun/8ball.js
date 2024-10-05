const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8ball a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true)
    ),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const responses = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
    ];
    const randomNum = Math.floor(Math.random() * responses.length);

    interaction.reply({
      content: `\`${interaction.options.getString("question")}\`\n:8ball: ${
        responses[randomNum]
      }`,
      ephemeral: true,
    });
  },
};
