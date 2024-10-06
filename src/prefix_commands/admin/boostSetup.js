const { EmbedBuilder } = require("discord.js");
const boostSchema = require("../../schemas/boostSchema");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "boost-setup",
  description: "Setup the boost event.",

  run: async (client, message, args) => {
    try {
      const { guild } = message;
      let dataGD = await moderationSchema.findOne({ GuildID: guild.id });
      const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

      if (!message.content.startsWith(guildPrefix)) return;

      const boostChannel = message.mentions.channels.first();
      const embedColor = args[0];
      const embedTitle = args[1];
      const embedMessage = args[2];
      const boostMessage = args[3];

      if (
        !boostChannel ||
        !embedColor ||
        !embedTitle ||
        !embedMessage ||
        !boostMessage
      ) {
        return message.reply("Please provide all the required information.");
      }

      let boostData = await boostSchema.findOne({
        GuildID: guild.id,
      });

      if (boostData) {
        return message.reply("The boost event has already been setup.");
      } else {
        boostData = await boostSchema.create({
          GuildID: guild.id,
          boostingChannelID: boostChannel.id,
          boostEmbedColor: embedColor,
          boostEmbedTitle: embedTitle,
          boostEmbedMsg: embedMessage,
          boostMsg: boostMessage,
        });

        const boostEmbed = new EmbedBuilder()
          .setTitle(embedTitle)
          .setColor(embedColor)
          .setDescription(embedMessage);

        return message.reply({
          content: `The boost has been setup. The boost message will be sent in ${boostChannel}.`,
          embeds: [boostEmbed],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
