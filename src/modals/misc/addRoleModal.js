const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "addrole_modal",
  userPermissions: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  run: async (client, interaction) => {
    try {
      const { message, channel, guildId, guild, user, fields } = interaction;

      const embedAuthor = message.embeds[0].author;
      const guildMembers = await guild.members.fetch({
        query: embedAuthor.name,
        limit: 1,
      });
      const targetMember = guildMembers.first();

      const roleId = fields.getTextInputValue("role_id_input");
      const role = guild.roles.cache.get(roleId);

      await interaction.deferReply({ ephermal: true });

      const addedRole = new EmbedBuilder()
        .setAuthor({
          name: `${targetMember.user.username}`,
          iconURL: `${targetMember.user.displayAvatarURL({ dyanmic: true })}`,
        })
        .setDescription(
          `**${role} has been added successfully to the ${targetMember}!**`
        );

      targetMember.roles.add(role).catch((err) => {
        console.log(err);
      });

      return interaction.editReply({ embeds: [addedRole], components: [] });
    } catch (error) {
      console.log(error);
    }
  },
};
