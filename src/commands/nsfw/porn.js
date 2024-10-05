const {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("porn")
    .setDescription("pick any porn youd like")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("pick a type")
        .setRequired(true)
        .addChoices(
          { name: "4k", value: "4k" },
          { name: "Anal", value: "anal" },
          { name: "Ass", value: "ass" },
          { name: "Gone Wild", value: "gonewild" },
          { name: "Porn Gif", value: "pgif" },
          { name: "Pussy", value: "pussy" },
          { name: "Thigh", value: "thigh" },
          { name: "Boobs", value: "boobs" },
          { name: "Hentai Ass", value: "hass" },
          { name: "Hentai", value: "hentai" },
          { name: "Hentai Anal", value: "hanal" },
          { name: "Hentai Midriff", value: "hmidriff" },
          { name: "Hentai Thigh", value: "hthigh" },
          { name: "Hentai Boobs", value: "hboobs" },
          { name: "Hentai Kitsune", value: "hkitsune" },
          { name: "Tentacle", value: "tentacle" },
          { name: "Yaoi", value: "yaoi" },
          { name: "Hentai Solo", value: "holo" },
          { name: "Food", value: "food" }
        )
    ),

  run: async (client, interaction) => {
    if (!interaction.channel.nsfw) {
      return interaction.reply({ content: "This is not a NSFW channel." });
    }

    await interaction.deferReply();

    let { data } = await axios.get(
      `https://nekobot.xyz/api/image?type=${interaction.options.getString(
        "type"
      )}`
    );

    const image = data.message;
    const embed = new EmbedBuilder()
      .setTitle(interaction.options.getString("type"))
      .setColor(Colors.Red)
      .setFooter({ text: "Yippie porn for all of you horny people." })
      .setImage(image);

    await interaction.editReply({ embeds: [embed] });
  },
};
