const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const Reminder = require("../../schemas/remindSchema");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-reminder")
    .setDescription("Create a reminder for yourself or another user")
    .addStringOption((option) =>
      option
        .setName("reminder")
        .setDescription("The reminder message")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "Duration in seconds, minutes, or hours (e.g., 10s, 5m, 1h)"
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to remind")
    ),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const reminderMessage = interaction.options.getString("reminder");
    const durationInput = interaction.options.getString("duration");
    const targetUser = interaction.options.getUser("user");
    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    const timestamp = Date.now();

    let duration = 0;
    if (durationInput.endsWith("s")) {
      duration = parseInt(durationInput.slice(0, -1), 10);
    } else if (durationInput.endsWith("m")) {
      duration = parseInt(durationInput.slice(0, -1), 10) * 60;
    } else if (durationInput.endsWith("h")) {
      duration = parseInt(durationInput.slice(0, -1), 10) * 3600;
    } else {
      duration = parseInt(durationInput, 10);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content:
          "Duration must be a number followed by 's' for seconds, 'm' for minutes, or 'h' for hours.",
        ephemeral: true,
      });
    }

    const reminder = new Reminder({
      user: userId,
      reminder: reminderMessage,
      repeating: false,
      time: timestamp,
      duration: duration,
      expires: timestamp + duration,
      guildId: guildId,
      targetId: targetUser ? targetUser.id : null,
    });

    await reminder.save();

    const reminderEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🚨 Reminder Created")
      .setDescription(`Your reminder has been set for ${duration} seconds.`)
      .addFields(
        { name: "Reminder", value: reminderMessage, inline: false },
        { name: "Duration", value: `${duration} seconds`, inline: false },
        {
          name: "Target",
          value: targetUser ? `<@${targetUser.id}>` : "You",
          inline: false,
        }
      );

    await interaction.reply({ embeds: [reminderEmbed], ephemeral: true });

    // Set up a timeout to ping the user when the reminder expires
    setTimeout(async () => {
      const channel = await client.channels.fetch(interaction.channelId);
      const target = targetUser ? `<@${targetUser.id}>` : `<@${userId}>`;
      await channel.send(`${target} reminder expired ${reminderMessage}`);
      // If the reminder has ended, wipe it from the database
      await Reminder.deleteOne({ _id: reminder._id });
    }, duration * 1000);
  },
};
