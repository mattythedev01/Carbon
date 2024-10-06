const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const giveawaySchema = require("../../schemas/giveaways");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listgiveaways")
    .setDescription("List all active giveaways")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const activeGiveaways = await giveawaySchema.find({ IsActive: true });

    if (activeGiveaways.length === 0) {
      return interaction.reply({
        content: "`⚠️` There are no active giveaways at the moment.",
        ephemeral: true,
      });
    }

    const giveawayListEmbed = new EmbedBuilder()
      .setTitle("Active Giveaways")
      .setColor("#0099ff");

    activeGiveaways.forEach((giveaway, index) => {
      giveawayListEmbed.addFields({
        name: `Giveaway ID: ${giveaway.GiveawayID}`,
        value: `Guild ID: ${giveaway.GuildID}\nStatus: ${
          giveaway.IsActive ? "Active" : "Inactive"
        }\n${index < activeGiveaways.length - 1 ? "---" : ""}`,
        inline: false,
      });
    });

    interaction.reply({
      embeds: [giveawayListEmbed],
      ephemeral: true,
    });
  },
};
