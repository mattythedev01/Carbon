const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "mhinfo",
  description: "Get information about mental health!",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    const mhInfoEmbed = new EmbedBuilder()
      .setTitle("🌟 Mental Health Information 🌟")
      .setDescription(
        "Mental health is just as important as physical health. It's essential to take care of your mental well-being by practicing self-care, seeking help when needed, and maintaining a healthy lifestyle. Remember, you are not alone, and there is always support available. 💕"
      )
      .setColor(0x0099ff);

    const disordersButton = new ButtonBuilder()
      .setCustomId("disorders")
      .setLabel("🔍 Disorders")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(disordersButton);

    await message.channel.send({ embeds: [mhInfoEmbed], components: [row] });

    const filter = (i) =>
      i.customId === "disorders" && i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector(filter);

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      const disordersEmbed = new EmbedBuilder()
        .setTitle("🚨 Common Mental Health Disorders 🚨")
        .setDescription(
          "Here are some of the most common mental health disorders, their annual diagnosis rates, and a brief description:"
        )
        .setColor(0x0099ff)
        .addFields(
          {
            name: "🌧️ Depression",
            value:
              "> Annual Diagnosis: 300 million\n> Description: A mood disorder characterized by feelings of sadness, loss, and a lack of interest in activities.",
          },
          {
            name: "😟 Anxiety",
            value:
              "> Annual Diagnosis: 40 million\n> Description: A mental health disorder characterized by feelings of worry, anxiety, and fear.",
          },
          {
            name: "🌈 Bipolar Disorder",
            value:
              "> Annual Diagnosis: 60 million\n> Description: A mood disorder characterized by periods of extreme highs and lows.",
          },
          {
            name: "🧠 Schizophrenia",
            value:
              "> Annual Diagnosis: 20 million\n> Description: A mental disorder characterized by hallucinations, delusions, and disorganized thinking.",
          }
        );

      await message.channel.send({ embeds: [disordersEmbed] });
    });
  },
};
