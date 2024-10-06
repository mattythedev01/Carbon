require("dotenv/config");

const { Client, GatewayIntentBits } = require("discord.js");

const SoftUI = require("dbd-soft-ui");
const config = require("./testing.json");
let DBD = require("discord-dashboard");

const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

eventHandler(client);

client.login(process.env.DISCORD_TOKEN);

const Handler = new DBD.Handler();
/*
          Keyv storage instance
          Example: { store: new KeyvMongo('mongodb://user:pass@localhost:27017/dbname') }

          Can be left empty to use the default storage (Keyv with SQLite)
      */

(async () => {
  await DBD.useLicense(config.dbd.license);
  DBD.Dashboard = DBD.UpdatedClass();

  const Dashboard = new DBD.Dashboard({
    port: config.dbd.port,
    client: config.discord.client,
    redirectUri: `${config.dbd.domain}${config.dbd.redirectUri}`,
    domain: config.dbd.domain,
    ownerIDs: config.dbd.ownerIDs,
    useThemeMaintenance: true,
    useTheme404: true,
    bot: client,
    theme: SoftUI({
      storage: Handler,
      customThemeOptions: {
        index: async ({ req, res, config }) => {
          return {
            values: [],
            graph: {},
            cards: [],
          };
        },
      },
      websiteName: "Assistants",
      colorScheme: "pink",
      supporteMail: "support@support.com",
      icons: {
        favicon:
          "https://assistantscenter.com/wp-content/uploads/2021/11/cropped-cropped-logov6.png",
        noGuildIcon:
          "https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png",
        sidebar: {
          darkUrl: "https://assistantscenter.com/img/logo.png",
          lightUrl: "https://assistanscenter.com/img/logo.png",
          hideName: true,
          borderRadius: false,
          alignCenter: true,
        },
      },
      index: {
        graph: {
          enabled: true,
          lineGraph: false,
          title: "Memory Usage",
          tag: "Memory (MB)",
          max: 100,
        },
      },
      sweetalert: {
        errors: {},
        success: {
          login: "Successfully logged in.",
        },
      },
      preloader: {
        image: "/img/soft-ui.webp",
        spinner: false,
        text: "Page is loading",
      },
      admin: {
        pterodactyl: {
          enabled: false,
          apiKey: "apiKey",
          panelLink: "https://panel.website.com",
          serverUUIDs: [],
        },
      },
      commands: [],
    }),
    settings: [],
  });
  Dashboard.init();
})();
