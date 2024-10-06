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
    .setName("startgiveaway")
    .setDescription("Start a new giveaway")
    .addSubcommand((s) =>
      s
        .setName("create")
        .setDescription("Create a new giveaway")
        .addStringOption((o) =>
          o
            .setName("title")
            .setDescription("The title of the giveaway")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("The description of the giveaway")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("emoji")
            .setDescription("The emoji to use for the giveaway entry")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("duration")
            .setDescription(
              "The duration of the giveaway in seconds, minutes, hours or years"
            )
            .setRequired(true)
        )
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId, guild } = interaction;
    const subcmd = options.getSubcommand();
    if (!["create"].includes(subcmd)) return;

    const giveawayTitle = options.getString("title");
    const giveawayDescription = options.getString("description");
    const giveawayEmoji = options.getString("emoji");
    const giveawayDuration = options.getString("duration");

    let durationInMilliseconds;
    if (giveawayDuration.endsWith("s")) {
      durationInMilliseconds = parseInt(giveawayDuration) * 1000;
    } else if (giveawayDuration.endsWith("m")) {
      durationInMilliseconds = parseInt(giveawayDuration) * 60 * 1000;
    } else if (giveawayDuration.endsWith("h")) {
      durationInMilliseconds = parseInt(giveawayDuration) * 60 * 60 * 1000;
    } else if (giveawayDuration.endsWith("y")) {
      durationInMilliseconds =
        parseInt(giveawayDuration) * 365 * 24 * 60 * 60 * 1000;
    } else {
      return interaction.reply({
        content:
          "`⚠️` Invalid duration format. Please use 's', 'm', 'h' or 'y' at the end of the duration.",
        ephemeral: true,
      });
    }

    let dataGD = await giveawaySystemSchema.findOne({ GuildID: guildId });
    if (!dataGD) {
      return interaction.reply({
        content: "`⚠️` The giveaway system is not configured for this server.",
        ephemeral: true,
      });
    }

    const giveawayChannel = guild.channels.cache.get(dataGD.ChannelID);
    if (!giveawayChannel) {
      return interaction.reply({
        content: "`⚠️` The giveaway channel is not valid.",
        ephemeral: true,
      });
    }

    // Generate a 12-byte string for GiveawayID
    const giveawayID = Math.random().toString(36).substr(2, 12);
    const giveaway = new giveawaySchema({
      GiveawayID: giveawayID,
      CreatorID: interaction.user.id,
      Prize: giveawayTitle,
      StartDate: new Date(),
      EndDate: new Date(
        new Date().setMilliseconds(
          new Date().getMilliseconds() + durationInMilliseconds
        )
      ),
      Participants: [],
      WinnerID: null,
      IsActive: true,
    });
    await giveaway.save();

    const giveawayEmbed = new EmbedBuilder()
      .setTitle(giveawayTitle)
      .setDescription(giveawayDescription)
      .setColor(mConfig.embedColorSuccess)
      .setFooter({
        iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
        text: `${client.user.username} - Carbon`,
      })
      .addFields(
        { name: "Duration", value: giveawayDuration, inline: false },
        {
          name: "Entries",
          value: giveaway.Participants.length.toString(),
          inline: true,
        },
        { name: "Ends", value: giveaway.EndDate.toDateString(), inline: true }
      );

    const giveawayButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`giveaway-${giveawayID}`)
        .setLabel("Enter Giveaway")
        .setStyle(ButtonStyle.Primary)
        .setEmoji(giveawayEmoji)
    );

    const giveawayMessage = await giveawayChannel.send({
      embeds: [giveawayEmbed],
      components: [giveawayButton],
    });

    // DM the CreatorID with the giveaway ID
    await interaction.user.send(`Your giveaway ID is: ${giveawayID}`);

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;
      if (interaction.customId !== `giveaway-${giveawayID}`) return;

      const participant = giveaway.Participants.find(
        (p) => p === interaction.user.id
      );
      if (participant) {
        return interaction.reply({
          content: "`⚠️` You have already entered this giveaway.",
          ephemeral: true,
        });
      }

      giveaway.Participants.push(interaction.user.id);
      await giveaway.save();

      // Update the entries field in the embed
      giveawayEmbed.data.fields.find((f) => f.name === "Entries").value =
        giveaway.Participants.length.toString();
      await giveawayMessage.edit({
        embeds: [giveawayEmbed],
      });

      interaction.reply({
        content: "`✅` You have successfully entered the giveaway!",
        ephemeral: true,
      });
    });

    // Set up a timeout to end the giveaway and pick a winner
    setTimeout(async () => {
      if (giveaway.Participants.length === 0) {
        giveawayEmbed.setDescription("No one entered this giveaway.");
        await giveawayMessage.edit({
          embeds: [giveawayEmbed],
        });
        return;
      }

      const winnerIndex = Math.floor(
        Math.random() * giveaway.Participants.length
      );
      const winnerID = giveaway.Participants[winnerIndex];
      giveaway.WinnerID = winnerID;
      await giveaway.save();

      giveawayEmbed.setDescription(`Congrats <@${winnerID}>!`);
      await giveawayMessage.edit({
        embeds: [giveawayEmbed],
      });

      giveawayChannel.send(
        `Congrats <@${winnerID}>! You have won **${giveawayTitle}**!`
      );
    }, durationInMilliseconds);

    // Set up a timeout to delete the giveaway data after 24 hours
    setTimeout(async () => {
      await giveawaySchema.findOneAndDelete({
        GiveawayID: giveawayID,
      });
    }, 24 * 60 * 60 * 1000);

    interaction.reply({
      content: "`✅` Giveaway created successfully!",
      ephemeral: true,
    });
  },
};
