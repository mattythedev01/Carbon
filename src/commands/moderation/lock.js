const {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const LockdownSchema = require("../../schemas/lockdownSchema");
const ms = require("ms");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lockdown this channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Expire date for this lockdown (1m, 1h, 1d).")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason for this lockdown.")
        .setRequired(false)
    ),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [],

  run: async (client, interaction) => {
    const { guild, channel, options } = interaction;

    const Reason = options.getString("reason") || "No specified reason";

    const Embed = new EmbedBuilder();

    if (!channel.permissionsFor(guild.id).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("Red").setDescription(
            "⛔ | This channel is already locked."
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: false,
    });

    interaction.reply({
      embeds: [
        Embed.setColor("Red").setDescription(
          `🔒 | This channel is now under lockdown for: ${Reason}`
        ),
      ],
    });
    const Time = options.getString("time");
    if (Time) {
      const ExpireDate = Date.now() + ms(Time);
      LockdownSchema.create({
        GuildID: guild.id,
        ChannelID: channel.id,
        Time: ExpireDate,
      });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SendMessages: null,
        });

        interaction
          .editReply({
            embeds: [
              Embed.setDescription(
                "🔓 | The lockdown has been lifted"
              ).setColor("Green"),
            ],
          })
          .catch(() => {});

        await LockdownSchema.deleteOne({ ChannelID: channel.id });
      }, ms(Time));
    }

    const moderationData = await moderationSchema.findOne({
      GuildID: guild.id,
    });
    const logChannel = guild.channels.cache.get(moderationData.LogChannelID);

    logChannel.send(
      `🔒 | The channel ${channel.name} has been locked for: ${Reason}`
    );
  },
};
