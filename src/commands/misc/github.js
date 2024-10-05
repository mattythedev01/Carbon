const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require(`discord.js`);
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Check GitHub stats of a user.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The GitHub username to check")
        .setRequired(true)
    ),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const username = interaction.options.getString("username");
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const data = response.data;
    const embed = new EmbedBuilder()
      .setColor(0x2f3136) // A more subtle, professional color
      .setTitle(`${username}'s GitHub Profile`)
      .setDescription(
        `Explore the GitHub activities and repositories of ${username}.`
      )
      .addFields(
        {
          name: "Public Repositories",
          value: String(data.public_repos),
          inline: true,
        },
        { name: "Followers", value: String(data.followers), inline: true },
        { name: "Following", value: String(data.following), inline: true }
      )
      .setThumbnail(data.avatar_url) // Adds user's GitHub profile picture
      .setURL(`https://github.com/${username}`)
      .setTimestamp() // Adds a timestamp to the embed
      .setFooter({
        text: "GitHub Data",
        iconURL:
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Visit GitHub Profile")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://github.com/${username}`)
        .setEmoji("🔗") // Adds an emoji to the button for visual appeal
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
