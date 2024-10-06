const { EmbedBuilder } = require(`discord.js`);
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "id",
  description: "Get the ID of a user or yourself.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    let person = message.mentions.users.first();
    if (!person) person = message.author;

    const id = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`${person} **${person.id}**`)
      .setFooter({ text: `The ID of the user pinged.` });
    message.channel.send({ embeds: [id] });
  },
};
