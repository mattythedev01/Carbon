const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  customId: "tempmuteBtn",
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  run: async (client, interaction) => {
    try {
      const tempMuteModal = new ModalBuilder()
        .setTitle("Temp Mute")
        .setCustomId("tempmuteMdl")
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Duration")
              .setCustomId("tempmuteTime")
              .setPlaceholder("Example: 1h, 2d, 3w (h: hour, d: day, w: week)")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Reason")
              .setCustomId("tempmuteReason")
              .setPlaceholder("Reason for temporarily muting this user.")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          )
        );

      await interaction.showModal(tempMuteModal);
    } catch (error) {
      console.error("Error in tempMuteBtn:", error);
      await interaction.reply({
        content: "An error occurred while processing your request.",
        ephemeral: true,
      });
    }
  },
};
