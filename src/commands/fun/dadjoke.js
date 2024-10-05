const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dad-joke")
    .setDMPermission(false)
    .setDescription("Get a random dad joke."),
  run: async (client, interaction) => {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      interaction.reply({
        content: `An **error occurred** while attempting to fetch a dad joke. Please try again later.`,
        ephemeral: true,
      });
    }

    const data = await response.json();

    const jokeEmbed = new EmbedBuilder()
      .setAuthor({ name: `Dad Joke` })
      .setTitle(`${client.user.username} Dad Joke `)
      .setDescription(`> ${data.joke}`)
      .setColor("Blue")
      .setFooter({ text: `Joke ID: ${data.id}` })
      .setThumbnail(client.user.avatarURL())
      .setTimestamp();

    interaction.reply({ embeds: [jokeEmbed] });
  },
};
