const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect-all")
    .setDescription("disconnect all members of the specified voice channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "the voice channel from which to disconnect all members"
        )
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),

  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");

    // Retrieves all members in the voice channel
    const members = channel.members.filter((member) => member.voice.channel);

    // Disconnects each member from the voice channel
    members.forEach((member) => {
      member.voice.disconnect();
    });

    return interaction.reply({ content: "Finished.", ephemeral: true });
  },
};
