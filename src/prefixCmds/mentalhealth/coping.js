const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  name: "coping",
  description: "Get some coping mechanisms for mental health!",
  async run(client, message, args) {
    const guildId = message.guild.id;
    const guildPrefix = await moderationSchema
      .findOne({ GuildID: guildId })
      .then((doc) => (doc ? doc.GuildPrefix : null));
    if (!guildPrefix || !message.content.startsWith(guildPrefix)) return;

    const subcommand = args[0];
    let copingEmbed = new EmbedBuilder().setColor("#0099ff");

    switch (subcommand) {
      case "breathing":
        copingEmbed
          .setTitle("Breathing Exercise")
          .setDescription(
            "Take slow, deep breaths in through your nose and out through your mouth."
          )
          .setImage(
            "https://media.giphy.com/media/vuj6qbprcVOs27RgQW/giphy.gif"
          )
          .setURL("https://media.giphy.com/media/vuj6qbprcVOs27RgQW/giphy.gif");
        break;
      case "exercise":
        copingEmbed
          .setTitle("Exercise Routine")
          .setDescription(
            "Engage in physical activity to release endorphins and improve mood."
          )
          .setImage(
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM29tMXNwNHpsdWZqbXFuNDhtZzVteGpoZWdlMWxiZjlubDFhdXhueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13beCEg2qPMmIg/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/SakuMonsters-saku-monsters-monster-0IFx1PFkc8941UGETA/giphy.gif"
          );
        break;
      case "mindfulness":
        copingEmbed
          .setTitle("Mindfulness Meditation")
          .setDescription(
            "Focus on the present moment and let go of worries about the past or future."
          )
          .setImage(
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnkwN2lhMDRycTR5c2hiM2Q2ZDJveHRncjFxNXQxeTkzazRibGQ4MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DBbPjLMsQPruMkDcrd/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/spiritualgrowth-effectivebuddhism-buddhistwisdom-H1Hid0ytHaTQLtV3P9/giphy.gif"
          );
        break;
      case "grounding":
        copingEmbed
          .setTitle("Grounding Techniques")
          .setDescription(
            "Use your senses to ground yourself in the present moment."
          )
          .setImage(
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHp3OWJwODdoM2NnNzBpdDBueDR3YmFvMjd6OTMyeHZldmt6NjZwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7cjBJyG3AaQgPTsmtE/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/IntoAction-mental-health-wellbeing-jazminantionette-IgSbum3io6QikjzSkd/giphy.gif"
          );
        break;
      case "journaling":
        copingEmbed
          .setTitle("Journaling")
          .setDescription(
            "Write down your thoughts and feelings to process and release them."
          )
          .setImage(
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnc5N3Zhd2J4aG15d253bDAxeXlkYXp5aGQ0anJsb25nYWZzdWRqMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l49JX6ecphixAOoNO/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/sad-emotional-diary-Wrld9LT6GFh4XvV3rY/giphy.gif"
          );
        break;
      case "social-support":
        copingEmbed
          .setTitle("Seek Social Support")
          .setDescription(
            "Reach out to friends, family, or a therapist for emotional support."
          )
          .setImage(
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjEzb3ZydjQxNzBoMWI0NXllMThhbzM0MDJsMDc1ZmRydmh0N2M3cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1QsIxQhTvuh3yshQrc/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/buzzfeed-hug-national-hugging-day-why-is-good-for-your-health-HXm58u53vnVA4j5VF0/giphy.gif"
          );
        break;
      case "self-care":
        copingEmbed
          .setTitle("Practice Self-Care")
          .setDescription("Take care of your physical and emotional needs.")
          .setImage(
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExemRkbnF4dzhldjlvOGt2cjZjbXNpZ3JxOHRxZGdlYnM4OXRrY2cwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KCk0pDmxnGDOiRF6VI/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/youtube-self-care-me-time-is-not-selfish-KCk0pDmxnGDOiRF6VI/giphy.gif"
          );
        break;
      case "negative-thoughts":
        copingEmbed
          .setTitle("Challenge Negative Thoughts")
          .setDescription(
            "Replace negative thoughts with more balanced and realistic ones."
          )
          .setImage(
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTR6ZHZqN2V4Zjk2dzh2c2xpNDM2MWJram1kdWRicGFheHR3NDl4MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RckpMNKj25czZEVUe9/giphy.gif"
          )
          .setURL("https://media.giphy.com/media/RckpMNKj25czZEVUe9/giphy.gif");
        break;
      case "breaks":
        copingEmbed
          .setTitle("Take Breaks")
          .setDescription("Give yourself time to rest and recharge.")
          .setImage(
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWtwMXo5bzc4cHF1OHB3aW5pYWV4NnY4NG15MGwxYWpkNDk1cHc4ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S8DcNuvt1FUy31LUH6/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/take-a-break-chandni-poddar-xyz-aglet-D8LcHsV0tNGUGSYZAy/giphy.gif"
          );
        break;
      case "forgiveness":
        copingEmbed
          .setTitle("Practice Forgiveness")
          .setDescription("Let go of grudges and forgive yourself and others.")
          .setImage(
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXM4azl6cnVjcGE5cm9oNmNpMHJjNWE4em92bnYxMjJnazNmdDl0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MSiOC7m7zMFMmAlfuL/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/showtime-season-1-comedy-3oxHQgMigLIohjpMcg/giphy.gif"
          );
        break;
      case "professional-help":
        copingEmbed
          .setTitle("Seek Professional Help")
          .setDescription(
            "Consult a mental health professional for guidance and support."
          )
          .setImage(
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTRxYzZtam5vOWVpeWpsamF2Z3ZiYzl2OWxjaXZpNzQwN3J5YWt4OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1Ku5XDb3TakqgbxS/giphy.gif"
          )
          .setURL(
            "https://media.giphy.com/media/heyarnold-hey-arnold-nicksplat-26FeVV0pxmM08jUWI/giphy.gif"
          );
        break;
      default:
        copingEmbed
          .setTitle("Coping Mechanisms for Mental Health")
          .setDescription(
            "Here are some coping mechanisms to help you manage your mental health:"
          )
          .addFields(
            {
              name: "Breathing Exercise",
              value:
                "Take slow, deep breaths in through your nose and out through your mouth.",
              inline: false,
            },
            {
              name: "Exercise",
              value:
                "Engage in physical activity to release endorphins and improve mood.",
              inline: false,
            },
            {
              name: "Mindfulness",
              value:
                "Focus on the present moment and let go of worries about the past or future.",
              inline: false,
            },
            {
              name: "Grounding Techniques",
              value:
                "Use your senses to ground yourself in the present moment.",
              inline: false,
            },
            {
              name: "Journaling",
              value:
                "Write down your thoughts and feelings to process and release them.",
              inline: false,
            },
            {
              name: "Seek Social Support",
              value:
                "Reach out to friends, family, or a therapist for emotional support.",
              inline: false,
            },
            {
              name: "Practice Self-Care",
              value: "Take care of your physical and emotional needs.",
              inline: false,
            },
            {
              name: "Challenge Negative Thoughts",
              value:
                "Replace negative thoughts with more balanced and realistic ones.",
              inline: false,
            },
            {
              name: "Take Breaks",
              value: "Give yourself time to rest and recharge.",
              inline: false,
            },
            {
              name: "Practice Forgiveness",
              value: "Let go of grudges and forgive yourself and others.",
              inline: false,
            },
            {
              name: "Seek Professional Help",
              value:
                "Consult a mental health professional for guidance and support.",
              inline: false,
            }
          );
        break;
    }

    await message.channel.send({ embeds: [copingEmbed] });
  },
};
