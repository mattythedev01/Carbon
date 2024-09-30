const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  customId: "addroleBtn",
  userPermissions: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  run: async (client, interaction) => {
    try {
      const tempBanModal = new ModalBuilder()
        .setTitle("User Add Role")
        .setCustomId("addrole_modal")
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Role ID")
              .setCustomId("role_id_input")
              .setPlaceholder("Example: 1258970427141914727")
              .setStyle(TextInputStyle.Short)
          )
        );

      return await interaction.showModal(tempBanModal);
    } catch (error) {
      console.log(error);
    }
  },
};
