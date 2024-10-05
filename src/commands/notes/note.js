const { SlashCommandBuilder } = require("discord.js");
const Note = require("../../schemas/notesSchema");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Create a note on a user")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text of the note")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to put the note on")
        .setRequired(false)
    ),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const noteText = interaction.options.getString("text");
    const targetUser = interaction.options.getUser("target");
    const noteEntry = new Note({
      guildId: interaction.guildId,
      note: noteText,
      authorId: interaction.user.id,
      targetId: targetUser ? targetUser.id : null, // Handle case where target might not be specified
      noteId: Math.floor(Math.random() * (100 - 1 + 1)) + 1, // Generate a random noteId between 1 and 100
    });

    await noteEntry.save();

    const timestamp = noteEntry.timestamp.toLocaleDateString("en-US"); // Format the timestamp for display

    await interaction.reply(
      `Note created on ${
        targetUser ? targetUser.username : "general"
      }: "${noteText}" at ${timestamp}`
    );
  },
};
