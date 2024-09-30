const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emit-event")
    .setDescription("Emit an event to the client")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("The event to emit")
        .setRequired(true)
        .addChoices({ name: "guildMemberUpdate", value: "guildMemberUpdate" })
    ),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { member, options } = interaction;

    const event = options.getString("event");

    switch (event) {
      case "guildMemberUpdate":
        client.emit("guildMemberUpdate", member, member);
        break;
      default:
        interaction.reply({ content: "Invalid event.", ephemeral: true });
        break;
    }

    interaction.reply({
      content: `Emitted event \`${event}\``,
      ephemeral: true,
    });
  },
};
