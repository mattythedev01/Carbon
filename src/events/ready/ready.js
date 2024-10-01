module.exports = async (client) => {
  client.user.setPresence({
    activity: {
      name: `in ${client.guilds.cache.size} servers`,
      type: "WATCHING",
    },
    status: "online",
  });
};
