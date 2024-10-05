const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-flip")
    .setDescription("Flip a coin to see if it lands on heads or tails"),
  run: async (client, interaction) => {
    const embedFlip = new EmbedBuilder()
      .setAuthor({ name: `Coin Flip Command` })
      .setTitle(`${client.user.username} Coin Flip Tool `)
      .setDescription(`Flipping a coin...`)
      .setColor("Blue")
      .setImage(
        "https://media.discordapp.net/attachments/1083650198850523156/1084439687495700551/img_7541.gif?width=1600&height=1200"
      );
    await interaction.reply({ embeds: [embedFlip], fetchReply: true });

    setTimeout(() => {
      const choices = ["Heads", "Tails"];
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: `Coin Flip Command ` })
        .setTitle(`${client.user.username} Coin Flip Tool`)
        .setDescription(`Its a **${randomChoice}**`)
        .setThumbnail(client.user.avatarURL())
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    }, 1000);
  },
};
