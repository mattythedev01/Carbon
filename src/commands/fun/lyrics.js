const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  time,
  SlashCommandBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get lyrics for specified song.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription(`Specified song's lyrics will be displayed.`)
        .setRequired(true)
        .setMaxLength(200)
    ),
  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    const title = interaction.options.getString("song");

    const embed = new EmbedBuilder();

    await axios
      .get(`https://some-random-api.ml/lyrics?title=${title}`)
      .then(async (data) => {
        embed
          .setColor("White")
          .setTitle(`• ${data.data.title}`)
          .setAuthor({ name: "📃 Lyrics Fetched" })

          .setThumbnail(data.data.thumbnail.genius)
          .setFooter({ text: `📃 Song by ${data.data.author}` })
          .setTimestamp()
          .setDescription(`${data.data.lyrics.slice(0, 4096)}`);

        await interaction.reply({ embeds: [embed] });
      })
      .catch(() => {
        return interaction.reply({
          content: `Couldn't find a **song** with that name!`,
          ephemeral: true,
        });
      });
  },
};
