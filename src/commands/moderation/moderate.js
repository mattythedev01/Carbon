const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  escapeStrikethrough,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderate")
    .setDescription("Take moderation action on a user.")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user you want to take action on.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild, member } = interaction;

    const user = options.getUser("user");
    const targetMember = await guild.members.fetch(user);

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
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("otherBtn")
        .setLabel("Utility")
        .setEmoji("🛠️")
        .setStyle(ButtonStyle.Secondary),
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
