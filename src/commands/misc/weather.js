const {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const weather = require(`weather-js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Check the weather of a state or country.")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("The location to check the weather for.")
        .setRequired(true)
    ),
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.Client} client
   * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
   */
  userPermissions: [], // Defines user permissions (omitted for simplicity)
  botPermissions: [], // Defines bot permissions (omitted for simplicity)

  run: async (client, interaction) => {
    const location = interaction.options.getString("location");
    weather.find({ search: location, degreeType: "F" }, function (err, result) {
      if (err) {
        console.log(err);
        interaction.reply(
          "There was an error while fetching the weather data."
        );
        return;
      }
      if (!result || result.length === 0) {
        interaction.reply(`No weather data found for ${location}.`);
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
      interaction.reply({ embeds: [weatherEmbed] });
    });
  },
};
