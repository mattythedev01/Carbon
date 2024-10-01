const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const botSchema = require("../../schemas/botPresence");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-presence")
    .setDescription("Manage the bot's presence.")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add the bot's presence.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name to display.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription(
              "The type of activity (0: Default, 1: Watching, 2: Listening, 3: Playing)."
            )
            .setChoices(
              { name: "Competing", value: `${ActivityType.Competing}` },
              { name: "Watching", value: `${ActivityType.Watching}` },
              { name: "Listening", value: `${ActivityType.Listening}` },
              { name: "Playing", value: `${ActivityType.Playing}` },
              { name: "Custom", value: `${ActivityType.Custom}` },
              { name: "Streaming", value: `${ActivityType.Streaming}` }
            )
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("status")
            .setDescription(
              "The status to display (online, idle, dnd, offline)."
            )
            .addChoices(
              { name: "Online", value: "online" },
              { name: "Idle", value: "idle" },
              { name: "DND", value: "dnd" },
              { name: "Invisible", value: "invisible" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("remove").setDescription("Remove the last edit presence.")
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all current presences.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  devOnly: true,

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */

  run: async (client, interaction) => {
    const subs = interaction.options.getSubcommand();
    const data = await botSchema.findOne({ ClientID: client.user.id });

    switch (subs) {
      case "add":
        const name = interaction.options.getString("name");
        const type = interaction.options.getString("type");
        const status = interaction.options.getString("status");

        if (!data) {
          await botSchema.create({
            Presences: [
              {
                Activity: [
                  {
                    Name: name,
                    Type: parseInt(type),
                  },
                ],
                Status: status,
              },
            ],
          });
        } else {
          await botSchema.findOneAndUpdate(
            { ClientID: client.user.id },
            {
              $push: {
                Presences: {
                  Activity: [{ Name: name, Type: parseInt(type) }],
                  Status: status,
                },
              },
            }
          );
        }
        return interaction.reply({
          content: "Presence added successfully.",
          ephemeral: true,
        });
      case "remove":
        if (!data) {
          return interaction.reply({
            content: "No presences found.",
            ephemeral: true,
          });
        } else {
          await botSchema.findOneAndUpdate(
            { ClientID: client.user.id },
            { $pop: { Presences: 1 } }
          );
          return interaction.reply({
            content: "Last presence removed successfully.",
            ephemeral: true,
          });
        }

      case "list":
        if (!data) {
          return interaction.reply({
            content: "No presences found.",
            ephemeral: true,
          });
        }

        const presences = data.Presences;

        const rEmbed = new EmbedBuilder()
          .setTitle(`\`⭐\` Activities of the bot`)
          .setColor("White")
          .setFooter({
            text: `${client.user.username} - Activity List`,
            iconURL: `${client.user.displayAvatarURL({ dyanmic: true })}`,
          });

        const activityType = [
          "Playing",
          "Streaming",
          "Listening",
          "Watching",
          "Competing",
        ];
        const activityStatus = {
          online: "Online",
          idle: "Idle",
          dnd: "Do Not Disturb",
          invisible: "Invisible",
        };

        presences.forEach((presence, index) => {
          return rEmbed.addFields({
            name: `\`${index + 1}\ - \`${presence.Activity[0].Name}\``,
            value: `**Type:** ${
              activityType[presence.Activity[0].Type]
            }\n **Status:** ${activityStatus[presence.Status]}`,
          });
        });

        return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }
  },
};
