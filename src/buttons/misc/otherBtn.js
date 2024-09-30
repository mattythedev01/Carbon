const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  customId: "otherBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const { message, channel, guildId, guild, user } = interaction;

    await interaction.deferReply({ ephermal: false });

    try {
      const embedAuthor = message.embeds[0].author;
      const guildMembers = await guild.members.fetch({
        query: embedAuthor.name,
        limit: 1,
      });
      const targetMember = guildMembers.first();

      const Oembed = new EmbedBuilder()
        .setTitle("Other Options")
        .setAuthor({
          name: `${targetMember.user.username}`,
          iconURL: `${targetMember.user.displayAvatarURL({ dyanmic: true })}`,
        })
        .setDescription(
          `\`❔\` What action do you want to use against ${targetMember.user.username}?`
        );

      const otherRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("nickBtn")
          .setLabel("Manage Nick")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("addroleBtn")
          .setLabel("Add Role")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("cancelBtn")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.editReply({ embeds: [Oembed], components: [otherRow] });
    } catch (error) {
      console.log(error);
    }
  },
};
