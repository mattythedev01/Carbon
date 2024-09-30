const {
  ContextMenuCommandBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  escapeStrikethrough,
  Application,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Moderate user")
    .setType(ApplicationCommandType.User),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [],

  run: async (client, interaction) => {
    const { targetMember, guildId, member } = interaction;
    const rEmbed = new EmbedBuilder()
      .setColor("FFFFFF")
      .setFooter({ text: `${client.user.username} - Carbon` });

    let data = await moderationSchema.findOne({ GuildID: guildId });
    if (!data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(
          "`❌` The server is not configured yet.\n\n`💡` Use `/modsystem configure` to configure the moderation system."
        );
      return interaction.reply({ embeds: [rEmbed], ephermal: true });
    }

    if (targetMember.id === member.id) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.unableToInteractionWithYourself}`);
      return interaction.reply({ embeds: [rEmbed], ephermal: true });
    }
    if (targetMember.roles.highest.position >= member.roles.highest.position) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.hasHigherRolePosition}`);
      return interaction.reply({ embeds: [rEmbed], ephermal: true });
    }

    const moderationButtons = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("punishmentBtn")
        .setLabel("Punishments")
        .setEmoji("👷")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("otherBtn")
        .setLabel("Utility")
        .setEmoji("🛠️")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancelBtn")
        .setLabel("Cancel Actions")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Secondary)
    );

    rEmbed
      .setAuthor({
        name: `${targetMember.user.username}`,
        iconURL: `${targetMember.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `\`❔\` What action do you want to use against ${targetMember.user.username}?`
      );

    interaction.reply({ embeds: [rEmbed], components: [moderationButtons] });
  },
};
