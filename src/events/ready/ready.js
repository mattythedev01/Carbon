module.exports = async (client) => {
  const activities = [
    `in ${client.guilds.cache.size} servers`,
    `with ${client.users.cache.size} members`,
    "Protecting your server at all costs",
  ];

  let i = 0;
  setInterval(() => {
    client.user.setActivity(activities[i], {
      type: "PLAYING",
      status: "dnd",
    });
    i = (i + 1) % activities.length;
  }, 3600000); // 1 hour in milliseconds
};
