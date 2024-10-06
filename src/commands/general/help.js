const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const buttonPagination = require("../../utils/buttonPagination");
const footerData = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("🌟🚀 Get super advanced help with the bot commands!"),

  run: async (client, interaction) => {
    try {
      const commandFolders = fs
        .readdirSync("./src/commands")
        .sort()
        .filter((folder) => folder !== "developers");
      const helpEmbeds = [];

      const folderEmojis = {
        admin: "<:Admin:1290168797449162774>",
        fun: "😊",
        general: "💘",
        giveaways: "🎉",
        mentalhealth: "😭",
        misc: "📦",
        moderation: "<:Moderator:1290169208226709568>",
        notes: "📚",
        nsfw: "🔞",
        remind: "🌏",
        suggestions: "🤔",
      };

      const frontPageEmbed = new EmbedBuilder()
        .setTitle("🚀🌌 Welcome to the Future of Command Help 🌌🚀")
        .setDescription(
          "`- Use the buttons to navigate through the command categories!`"
        )
        .setColor("#42f5e3")
        .setFooter({ text: `${footerData.footerText} | 🕒` })
        .setTimestamp();

      let categoriesDescription = commandFolders
        .map((folder) => `> ${folderEmojis[folder] || "📁"} ${folder}`)
        .join("\n");
      frontPageEmbed.addFields({
        name: "📂 Categories",
        value: categoriesDescription,
      });

      helpEmbeds.push(frontPageEmbed);

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));

        const categoryEmbed = new EmbedBuilder()
          .setTitle(`${folderEmojis[folder] || "📁"} ${folder}`)
          .setFooter({ text: `${footerData.footerText} | 🕒` })
          .setTimestamp()
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("#42f5e3");

        const subcommands = [];

        for (const file of commandFiles) {
          const command = require(`../../commands/${folder}/${file}`);

          if (command.deleted) {
            continue;
          }

          const description =
            command.data.description || "No description provided";

          if (
            command.data.type === "SUB_COMMAND" ||
            command.data.type === "SUB_COMMAND_GROUP"
          ) {
            subcommands.push(command);
          } else {
            categoryEmbed.addFields({
              name: `🔹 /${command.data.name}`,
              value: `**Advanced Description:** ${description}`,
              inline: true,
            });
          }
        }

        if (subcommands.length > 0) {
          categoryEmbed.addFields({
            name: "👥 Subcommands",
            value: subcommands
              .map((subcommand) => `🔸 /${subcommand.data.name}`)
              .join("\n"),
            inline: false,
          });
        }

        helpEmbeds.push(categoryEmbed);
      }

      await buttonPagination(interaction, helpEmbeds, 60000); // Increased time to 60 seconds
    } catch (error) {
      console.error("🚨 Critical Error Encountered:", error);
      interaction.reply({
        content:
          "❌ An advanced error occurred while generating help information.",
        ephemeral: true,
      });
    }
  },
};
