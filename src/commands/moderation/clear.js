const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Removes a certain amount of messages specified.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to delete.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Messages to be deleted from a specific user.")
    ),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const { options, channel } = interaction;
    let amount = options.getInteger("amount");
    const target = options.getUser("target");
    const multiMsg = amount === 1 ? "message" : "messages";

    if (!amount || amount > 100 || amount < 1) {
      return await interaction.reply({
        content:
          "Please specify an amount between `1-100` before deleting messages.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      let messagesToDelete;
      if (target) {
        messagesToDelete = await channel.messages.fetch({ limit: 100 });
        messagesToDelete = messagesToDelete
          .filter((m) => m.author.id === target.id)
          .first(amount);
      } else {
        messagesToDelete = await channel.messages.fetch({ limit: amount });
      }

      if (messagesToDelete.size === 0) {
        return await interaction.editReply({
          content: "There are no messages to delete.",
          ephemeral: true,
        });
      }

      const deletedCount = messagesToDelete.size;
      await channel.bulkDelete(messagesToDelete, true);

      const clearEmbed = new EmbedBuilder().setColor(mConfig.embedColorSuccess)
        .setDescription(`
          \`✅\` Successfully cleared \`${deletedCount}\` ${multiMsg} ${
        target ? `from ${target}` : ""
      } in ${channel}.   
        `);

      await interaction.editReply({ embeds: [clearEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error has occurred, please try again later!",
        ephemeral: true,
      });
    }
  },
};
