const { MessageCollector } = require("discord.js");
const Reminder = require("../../schemas/remindSchema");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "create-reminder",
  description: "Create a reminder for yourself or another user",
  run: async (client, message, args) => {
    const { guild } = message;
    const dataGD = await moderationSchema.findOne({ GuildID: guild.id });
    const guildPrefix = dataGD ? dataGD.GuildPrefix : "!";

    await message.channel.send(
      "What would you like the reminder message to be?"
    );

    const filter = (m) => m.author.id === message.author.id;
    const collector = new MessageCollector(message.channel, {
      filter,
      max: 2,
      time: 60000,
    });

    let reminderMessage = "";
    let duration = 0;

    collector.on("collect", async (m, col) => {
      if (!reminderMessage) {
        reminderMessage = m.content;
        await m.reply(
          `Okay, "${reminderMessage}" is set! What about the duration?`
        );
      } else {
        const durationInput = m.content;
        const durationRegex = /(\d+)(s|m|h|y)/;
        const match = durationInput.match(durationRegex);

        if (match) {
          const [, num, unit] = match;
          switch (unit) {
            case "s":
              duration = parseInt(num, 10);
              break;
            case "m":
              duration = parseInt(num, 10) * 60;
              break;
            case "h":
              duration = parseInt(num, 10) * 3600;
              break;
            case "y":
              duration = parseInt(num, 10) * 31536000;
              break;
          }

          const reminder = new Reminder({
            user: message.author.id,
            reminder: reminderMessage,
            repeating: false,
            time: Date.now(),
            duration: duration,
            expires: Date.now() + duration * 1000,
            guildId: guild.id,
          });

          await reminder.save();
          await m.reply(`Reminder set for ${duration} seconds.`);

          // Set a timeout to DM the user when the reminder is up and delete it from the database
          setTimeout(async () => {
            try {
              const user = await client.users.fetch(message.author.id);
              await user.send(`Your reminder is up: ${reminderMessage}`);
              await Reminder.deleteOne({ _id: reminder._id });
            } catch (error) {
              console.error(
                "Failed to send DM reminder or delete from DB.",
                error
              );
            }
          }, duration * 1000);
        } else {
          await m.reply(
            "Invalid duration. Please use the format <number><s|m|h|y>."
          );
          collector.stop();
        }
      }
    });

    collector.on("end", (collected) => {
      if (collected.size < 2) {
        message.channel.send(
          "You did not provide the necessary information in time."
        );
      }
    });
  },
};
