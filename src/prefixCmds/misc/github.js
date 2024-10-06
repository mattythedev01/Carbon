const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require(`discord.js`);
const axios = require("axios");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "github",
  description: "Check GitHub stats of a user.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const username = args[0]; // Assuming the first argument is the GitHub username
    if (!username) {
      return message.reply("Please provide a GitHub username.");
    }

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

    await message.channel.send({ embeds: [embed], components: [row] });
  },
};
