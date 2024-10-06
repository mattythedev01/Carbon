const { EmbedBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const moderationSchema = require("../../schemas/moderation");
require("dotenv/config");

module.exports = {
  name: "ask",
  description: "Ask ai",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    async function run() {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-pro-latest",
        });
        const prompt = args.join(" ");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        if (text.length > 2000) {
          const chunks = text.match(/[\s\S]{1,2000}/g);
          for (const chunk of chunks) {
            const embed = new EmbedBuilder()
              .setDescription(chunk)
              .setColor("Aqua")
              .setTimestamp();
            await message.channel.send({ embeds: [embed] });
          }
        } else {
          const embed2 = new EmbedBuilder()
            .setDescription(text)
            .setColor("Aqua")
            .setTimestamp();
          await message.channel.send({ embeds: [embed2] });
        }
      } catch (error) {
        console.log(`An error occured in the askAI command:\n\n${error}`);
        await message.channel.send({
          content: "An error occurred while processing your request.",
        });
      }
    }

    run();
  },
};
