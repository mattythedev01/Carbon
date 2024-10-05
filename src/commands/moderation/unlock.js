const {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const LockdownSchema = require("../../schemas/lockdownSchema");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Lift a lockdown from a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [],

  run: async (client, interaction) => {
    const { guild, channel } = interaction;

    const Embed = new EmbedBuilder();

    if (channel.permissionsFor(guild.id).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("Red").setDescription(
            "⛔ | This channel is not locked"
          ),
        ],
      });

    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: null,
    });

    await LockdownSchema.deleteOne({ ChannelID: channel.id });

    interaction.reply({
      embeds: [
        Embed.setColor("Green").setDescription(
          "🔓 | Lockdown has been lifted."
        ),
      ],
    });

    const moderationData = await moderationSchema.findOne({
      GuildID: guild.id,
    });
    const logChannel = guild.channels.cache.get(moderationData.LogChannelID);

    logChannel.send(`🔓 | The channel ${channel.name} has been unlocked.`);
  },
};
