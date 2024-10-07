const { EmbedBuilder, Colors, MessageCollector } = require("discord.js");
const axios = require("axios");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "porn",
  description: "pick any porn you'd like",

  run: async (client, message, args) => {
    const { guild } = message;
    const dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    if (!message.channel.nsfw) {
      return message.channel.send("This is not a NSFW channel.");
    }

    const categories = [
      "4k",
      "anal",
      "ass",
      "gonewild",
      "pgif",
      "pussy",
      "thigh",
      "boobs",
      "hass",
      "hentai",
      "hanal",
      "hmidriff",
      "hthigh",
      "hboobs",
      "hkitsune",
      "tentacle",
      "yaoi",
      "holo",
      "food",
    ];

    const categoryList = categories.join(", ");
    await message.reply(
      `Okay, what category? Available categories are: ${categoryList}`
    );

    const filter = (m) => m.author.id === message.author.id;
    const collector = new MessageCollector(message.channel, {
      filter,
      time: 15000,
      max: 1,
    });

    collector.on("collect", async (m) => {
      const type = m.content.toLowerCase();
      if (!categories.includes(type)) {
        m.reply("Invalid category. Please try again with a valid category.");
        return;
      }

      let { data } = await axios.get(
        `https://nekobot.xyz/api/image?type=${type}`
      );
      const image = data.message;
      const embed = new EmbedBuilder()
        .setTitle(type)
        .setColor(Colors.Red)
        .setFooter({ text: "Yippie porn for all of you horny people." })
        .setImage(image);

      message.channel.send({ embeds: [embed] });
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        message.channel.send("You did not specify a category in time.");
      }
    });
  },
};
