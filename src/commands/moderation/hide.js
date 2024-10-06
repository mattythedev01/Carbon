const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hide")
    .setDescription("hide a text channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Text channel mention to hide.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [],
  run: async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");
    channel.edit({
      permissionOverwrites: [
        {
          type: "role",
          id: interaction.guild.roles.everyone,
          deny: ["ViewChannel"],
        },
      ],
    });

    const embed = new EmbedBuilder().setDescription(
      `The Channel ${channel.name} Has Been Hidden Successfully`
    );

    await interaction.reply({
      embeds: [embed],
    });
  },
};
