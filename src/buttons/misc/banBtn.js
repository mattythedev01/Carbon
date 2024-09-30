const { PermissionFlagsBits, EmbedBuilder, Component } = require("discord.js")
const moderationSchema = require("../../schemas/moderation")
const mConfig = require("../../messageConfig.json")

module.exports = {
    customId: "banBtn",
    userPermissions: [],
    botPermissions: [PermissionFlagsBits.BanMembers],

    run: async (client, interaction) => {
        const { message, channel, guildId, guild, user } = interaction;

        const embedAuthor = message.embeds[0].author;
        const fetchedMembers = await guild.members.fetch({ query: embedAuthor.name, limit: 1 });
        const targetMember = fetchedMembers.first();

        const rEmbed = new EmbedBuilder()
            .setColor("FFFFFF")
            .setFooter({ text: `${client.user.username} - Carbon` })
            .setAuthor({ name: `${targetMember.user.username}`, iconURL: `${targetMember.user.displayAvatarURL({ dynamic: true })}` })
            .setDescription(`\`❔\` What is the reason to ban ${targetMember.user.username}?\n\`❕\` You have 15 seconds to reply. After this time, the actions will be cancelled.\n\n\`💡\` To continue without a reason, answer with \`-\``)

        message.edit({ embeds: [rEmbed], components: [] })

        const filter = (m) => m.author.id === user.id;
        const reasonCollector = await channel.awaitMessages({ filter, max: 1, time: 15_000, errors: ["time"] })
            .then((reason) => {
                if (reason.first().content.toLowerCase() === "cancel") {
                    reason.first().delete();
                    rEmbed
                        .setColor(mConfig.embedColorError)
                        .setDescription("\`❌\` Moderation actions cancelled.")
                    message.edit({ embeds: [rEmbed] });
                    setTimeout(() => {
                        message.delete();
                    }, 2_000);
                    return;
                };
                return reason;
            })
            .catch(() => {
                rEmbed
                    .setColor(mConfig.embedColorError)
                    .setDescription("\`❌\` Moderation actions cancelled.")
                message.edit({ embeds: [rEmbed] });
                setTimeout(() => {
                    message.delete();
                }, 2_000);
                return; // Shift + Alt + F
            });
            const reasonObj = reasonCollector?.first();
            if (!reasonObj) return;

            let reason = reasonObj.content; 
            if (reasonObj.content === "-") {
                reason = "No reason provided."
            }
            reasonObj.delete();

            targetMember.ban({ reason: `${reason}`, deleteMessageSeconds: 60 * 60 * 24 * 7 })

            let dataGD = await moderationSchema.findOne({ GuildID: guildId });
            const { LogChannelID } = dataGD;
            const loggingChannel = guild.channels.cache.get(LogChannelID)

            const lEmbed = new EmbedBuilder()
                .setColor("FFFFFF")
                .setTitle("\`❌\` User banned")
                .setAuthor({ name: targetMember.user.username, iconURL: targetMember.user.displayAvatarURL({ dyanmic: true }) })
                .setDescription(`\`💡\` To unban ${targetMember.user.username}, use \`/unban ${targetMember.user.id}\` to revoke this ban.`)
                .addFields(
                    { name: "Moderator:", value: ` <@${user.id}>`, inline: true },
                    { name: "Reason", value: `${reason}`, inline: true}
                )
                .setFooter({ iconURL: client.user.displayAvatarURL({ dyanmic: true }), text: `${client.user.user} - Carbon` })

            loggingChannel.send({ embeds: [lEmbed] })

            rEmbed 
                .setColor(mConfig.embedColorSuccess)
                .setDescription(`\`✅\` Successfully banned ${targetMember.user.username}.`);
            
            message.edit({ embeds: [rEmbed] });
            setTimeout(() => {
                message.delete();
            }, 2_000)
    },
};