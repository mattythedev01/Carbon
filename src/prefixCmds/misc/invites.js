const { EmbedBuilder } = require("discord.js");
const moderationSchema = require("../../schemas/moderation"); // Import the moderation schema

module.exports = {
  name: "invites",
  description: "Displays the number of invites of specified user.",
  async run(client, message, args) {
    const guildId = message.guild.id; // Get the guild ID
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return; // Check if the message starts with the guild prefix

    const inviter = message.mentions.users.first() ?? message.author;

    const invites = await message.guild.invites.fetch();

    const userInvites = invites.filter(
      (invite) => invite.inviter.id === inviter.id
    );

    let remainingInvites = 0;
    let fakeInvites = 0;
    let bonusInvites = 0;

    userInvites.forEach((invite) => {
      const uses = invite.uses;
      const maxUses = invite.maxUses;

      if (uses === 0) {
        remainingInvites++;
      } else if (uses > maxUses) {
        fakeInvites++;
      } else if (uses <= maxUses) {
        bonusInvites += maxUses - uses;
      }
    });

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setFooter({ text: `${inviter.username}'s Invites` })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png"
      )
      .setTimestamp()
      .setTitle(`> Fetched ${inviter.tag}'s Invites`)
      .setAuthor({ name: `🔗 Invites Tool` })
      .addFields(
        { name: "• Total Invites", value: `> ${userInvites.size}` },
        { name: "• Remaining Invites", value: `> ${remainingInvites}` },
        { name: "• Fake Invites", value: `> ${fakeInvites}` },
        { name: "• Bonus Invites", value: `> ${bonusInvites}` }
      );

    return message.channel.send({ embeds: [embed] });
  },
};
