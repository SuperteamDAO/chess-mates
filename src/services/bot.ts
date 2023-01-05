import { GatewayIntentBits, Interaction, Message } from "discord.js";
import { Client } from "discordx";
import { importx } from "@discordx/importer";
import dotenv from "dotenv";

dotenv.config();

export const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  await bot.guilds.fetch();
  await bot.initApplicationCommands();
  await bot.initGlobalApplicationCommands({
    log: true,
  });

  console.log("[🤖] The bot is ready!");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

export const run = async () => {
  await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  await bot.login(process.env.BOT_TOKEN!);
};
