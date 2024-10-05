const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("id")
    .setDescription("Get the ID of a user or yourself.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to get the ID of")
        .setRequired(false)
    ),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    let person = interaction.options.getUser("user");
    if (!person) person = interaction.user;
    const id = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`${person} **${person.id}**`)
      .setFooter({ text: `The ID of the user pinged.` });
    interaction.reply({ embeds: [id] });
  },
};
