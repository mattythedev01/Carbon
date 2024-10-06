const {
  SlashCommandBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const giveawaySystemSchema = require("../../schemas/giveawaysystem"); // Changed to use the new schema
const giveawaySchema = require("../../schemas/giveaways"); // Assuming there's a giveaway schema for managing giveaways
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endgiveaway")
    .setDescription("End an ongoing giveaway")
    .addStringOption((o) =>
      o
        .setName("giveaway_id")
        .setDescription("The ID of the giveaway to end")
        .setRequired(false)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild } = interaction;
    let giveawayID = options.getString("giveaway_id");

    if (!giveawayID) {
      let latestGiveaway = await giveawaySchema
        .findOne()
        .sort({ StartDate: -1 });
      if (latestGiveaway) {
        giveawayID = latestGiveaway.GiveawayID;
      } else {
        return interaction.reply({
          content: "`⚠️` No active giveaways found.",
          ephemeral: true,
        });
      }
    }

    let giveaway = await giveawaySchema.findOne({ GiveawayID: giveawayID });
    if (!giveaway) {
      return interaction.reply({
        content: "`⚠️` The giveaway with the provided ID does not exist.",
        ephemeral: true,
      });
    }

    if (!giveaway.IsActive) {
      return interaction.reply({
        content: "`⚠️` The giveaway with the provided ID is not active.",
        ephemeral: true,
      });
    }

    giveaway.IsActive = false;
    await giveaway.save();

    // Schedule deletion of the giveaway in 24 hours
    setTimeout(async () => {
      await giveawaySchema.findOneAndDelete({ GiveawayID: giveawayID });
    }, 24 * 60 * 60 * 1000);

    interaction.reply({
      content:
        "`✅` Giveaway ended successfully! It will be removed from the database in 24 hours.",
      ephemeral: true,
    });
  },
};
