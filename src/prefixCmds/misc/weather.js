const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moderationSchema = require("../../schemas/moderation");
const weather = require(`weather-js`);

module.exports = {
  name: "weather",
  description: "Check the weather of a state or country.",

  run: async (client, message, args) => {
    const { guild } = message;
    const dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";
    const guildID = guild.id;

    if (!args[0] || args[0].toLowerCase() !== `${guildPrefix}weather`) {
      return message.channel.send("Invalid command usage.");
    }

    const location = args.slice(1).join(" ");
    weather.find({ search: location, degreeType: "F" }, function (err, result) {
      if (err) {
        console.log(err);
        message.channel.send(
          "There was an error while fetching the weather data."
        );
        return;
      }
      if (!result || result.length === 0) {
        message.channel.send(`No weather data found for ${location}.`);
        return;
      }
      const current = result[0].current;
      const locationName = result[0].location.name;
      const temperature = current.temperature;
      const feelsLike = current.feelslike;
      const description = current.skytext;
      const windSpeed = current.winddisplay;
      const humidity = current.humidity;
      const weatherEmbed = new EmbedBuilder()
        .setTitle(`**Weather for ${locationName}**`)
        .setDescription(
          `Description: ${description}\nTemperature: ${temperature}°F\nFeels Like: ${feelsLike}°F\nWind Speed: ${windSpeed}\nHumidity: ${humidity}%`
        )
        .setColor(0x0099ff);
      message.channel.send({ embeds: [weatherEmbed] });
    });
  },
};
