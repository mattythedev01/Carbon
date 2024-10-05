const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const Note = require("../../schemas/notesSchema");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-notes")
    .setDescription("List all notes or notes on a specific user"),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const allNotes = await Note.find({ guildId: interaction.guildId });
    const regularNotes = allNotes.filter((note) => !note.targetId);
    const userNotes = allNotes.filter((note) => note.targetId);

    const regularNotesEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("📝 Regular Notes")
      .setDescription(
        regularNotes.length > 0
          ? regularNotes
              .map(
                (note, index) =>
                  `${index + 1} - ${
                    note.note
                  } (noted on ${note.timestamp.toLocaleDateString()}) - Note ID: ${
                    note.noteId
                  }`
              )
              .join("\n")
          : "No regular notes available."
      );

    const userNotesEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("👤 User Notes")
      .setDescription(
        userNotes.length > 0
          ? userNotes
              .map(
                (note, index) =>
                  `${index + 1} - ${note.note} (on <@${
                    note.targetId
                  }>, noted on ${note.timestamp.toLocaleDateString()}) - Note ID: ${
                    note.noteId
                  }`
              )
              .join("\n")
          : "No user notes available."
      );

    const regularButton = new ButtonBuilder()
      .setCustomId("regular_notes")
      .setLabel("Regular Notes")
      .setStyle(ButtonStyle.Primary);

    const userButton = new ButtonBuilder()
      .setCustomId("user_notes")
      .setLabel("User Notes")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(regularButton, userButton);

    await interaction.reply({
      content: "📖 Select a note type:",
      components: [row],
      ephemeral: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "regular_notes") {
        await i.update({ embeds: [regularNotesEmbed], components: [row] });
      } else if (i.customId === "user_notes") {
        await i.update({ embeds: [userNotesEmbed], components: [row] });
      }
    });

    collector.on("end", (collected) =>
      console.log(`Collected ${collected.size} interactions.`)
    );
  },
};
