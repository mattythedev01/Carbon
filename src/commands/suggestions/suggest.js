const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const suggestionSchema = require("../../schemas/suggestSchema"); // Changed to use the new schema
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Make a suggestion to the server.")
    .addStringOption((o) =>
      o
        .setName("suggestion")
        .setDescription("Your suggestion for the server.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild, user } = interaction;
    const suggestion = options.getString("suggestion");

    const rEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSuccess)
      .setTitle("New Suggestion")
      .setDescription(suggestion)
      .setFooter({
        iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
        text: `${client.user.username} - Carbon`,
      });

    let dataGD = await suggestionSchema.findOne({ GuildID: guildId });
    if (!dataGD) {
      return interaction.reply({
        content: "The suggestion system is not configured for this server.",
        ephemeral: true,
      });
    }

    const suggestionChannel = guild.channels.cache.get(dataGD.ChannelID);
    if (!suggestionChannel) {
      return interaction.reply({
        content: "The suggestion channel is not valid.",
        ephemeral: true,
      });
    }

    await suggestionChannel.send({ embeds: [rEmbed] });

    const newSuggestion = new suggestionSchema({
      UserID: user.id,
      GuildID: guildId,
      ChannelID: dataGD.ChannelID,
      Suggestion: suggestion,
      // SuggestionID is now generated automatically by the schema
    });
    await newSuggestion.save();

    rEmbed.addFields({
      name: "Suggestion ID",
      value: `||${newSuggestion.SuggestionID}||`,
      inline: false,
    });

    interaction.reply({
      content: `Your suggestion has been submitted successfully. Suggestion ID: ${newSuggestion.SuggestionID}.`,
      ephemeral: true,
    });
  },
};
