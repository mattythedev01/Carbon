const Discord = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

const lifeAdvices = [
  "Take care of your mental health.",
  "Don't be afraid to ask for help.",
  "Stay hydrated.",
  "Get enough sleep.",
  "Take breaks when you need to.",
  "Don't compare yourself to others.",
  "Practice gratitude.",
  "Be kind to yourself.",
  "Stay true to your values.",
  "Learn from your mistakes.",
  "Take responsibility for your actions.",
  "Set boundaries.",
  "Don't be afraid to say no.",
  "Communicate openly and honestly.",
  "Spend time with loved ones.",
  "Find a hobby you enjoy.",
  "Take care of your physical health.",
  "Practice mindfulness.",
  "Challenge yourself to try new things.",
  "Believe in yourself.",
  "Celebrate your accomplishments.",
  "Learn to let go of things you can't control.",
  "Forgive yourself and others.",
  "Take time to reflect on your life.",
  "Be patient with yourself and others.",
  "Stay organized.",
  "Take time to relax and unwind.",
  "Don't be afraid to take risks.",
  "Stay positive.",
  "Remember that mistakes are opportunities to learn and grow.",
];

module.exports = {
  name: "advice",
  description: "Get a random life advice!",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    const advice = lifeAdvices[Math.floor(Math.random() * lifeAdvices.length)];
    await message.channel.send(advice);
  },
};
