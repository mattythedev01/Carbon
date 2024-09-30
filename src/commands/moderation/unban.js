const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Revoke a server ban.")
    .addStringOption((o) =>
      o
        .setName("user_id")
        .setDescription("The ID of the user you want to unban.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: async (client, interaction) => {
    const { options, guildId, guild, member } = interaction;

    const userId = options.getString("user_id");

    let data = await moderationSchema.findOne({ GuildID: guildId });
    if (!data) {
      console.log("Unknown ban");
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(
          "`❌` The server is not configured yet.\n\n`💡` Use `/modsystem configure` to configure the moderation system."
        );
      return interaction.reply({ embeds: [rEmbed], ephermal: true });
    }

    if (userId.id === member.id) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.unableToInteractionWithYourself}`);
      return interaction.reply({ embeds: [rEmbed], ephermal: true });
    }
    guild.members.unban(userId);

    const rEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSuccess)
      .setFooter({ text: `${client.user.username} - User unbanned. ` })
      .setDescription(`\`✅\` Successfully unbanned \`${userId}\`.`);
    interaction.reply({ embeds: [rEmbed], ephermal: true });
  },
};
