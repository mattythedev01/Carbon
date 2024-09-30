const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-remove-member")
    .setDescription("Removes a member from the ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to remove from the ticket.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { channel, options, guild } = interaction;
      await interaction.deferReply();

      const memberToRemove = options.getUser("member");

      const ticket = await ticketSchema.findOne({
        GuildID: guild.id,
        ticketChannelID: channel.id,
        closed: false,
      });

      if (!ticket) {
        return await interaction.editReply({
          content: "This channel is not a ticket channel.",
        });
      }

      const memberExistsInServer = guild.members.cache.find(
        (mbr) => mbr.id === memberToRemove.id
      );
      if (!memberExistsInServer) {
        return await interaction.editReply({
          content: "The member you specified is not in the server.",
        });
      }

      const threadMember = await channel.members
        .fetch(memberToRemove.id)
        .catch((err) => {
          console.log(err);
        });

      if (!threadMember) {
        return await interaction.editReply({
          content: "The member you specified is not in the ticket.",
        });
      }

      await ticketSchema.findOneAndUpdate(
        {
          GuildID: guild.id,
          ticketChannelID: channel.id,
          closed: false,
        },
        {
          $pull: {
            membersAdded: memberToRemove.id,
          },
        }
      );
      await ticket.save();

      await channel.members.remove(memberToRemove.id);

      return await interaction.editReply({
        content: `Successfully removed ${memberToRemove} from the ticket.`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
