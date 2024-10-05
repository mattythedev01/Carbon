const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require(`discord.js`);
const AFK = require("../../schemas/afkSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set yourself as AFK")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for being AFK")
        .setRequired(true)
    ),
  userPermissions: [],
  botPermissions: [PermissionFlagsBits.ManageNicknames],
  run: async (client, interaction) => {
    const user = interaction.user;
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    const afkEntry = new AFK({
      guildId: interaction.guildId,
      userId: user.id,
      reason: reason,
    });

    await afkEntry.save();

    await interaction.reply(`You have been set as AFK. Reason: ${reason}`);

    // Change the user's nickname to "Afk <reason>"
    await user.setNickname(`Afk ${reason}`);

    const messageListener = async (message) => {
      if (message.author.bot || !message.mentions.users.has(user.id)) return;

      const afkStatus = await AFK.findOne({ userId: user.id });
      if (!afkStatus) return;

      await message.channel.send(
        `${user} is currently AFK. Reason: ${afkStatus.reason}`
      );
    };

    const activityListener = async (message) => {
      if (message.author.bot || message.author.id !== user.id) return;

      const afkStatus = await AFK.findOne({ userId: user.id });
      if (!afkStatus) return;

      await AFK.deleteOne({ userId: user.id });
      client.removeListener("messageCreate", messageListener);
      client.removeListener("messageCreate", activityListener);

      // Reset the user's nickname after becoming active again
      await user.setNickname(user.username);

      await message.reply(
        `Welcome back ${user}! You have been removed from the AFK list.`
      );
    };

    client.on("messageCreate", messageListener);
    client.on("messageCreate", activityListener);
  },
};
