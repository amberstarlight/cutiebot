const loggerInit = require("./utils/logger.js");
loggerInit();
log.time("startup");
log.info("Starting Cutiebot!");

// import discord.js, token, and set up client
const Discord = require("discord.js");
const { token } = require("./config.json");
const client = new Discord.Client();

const fs = require("fs");
const chalk = require("chalk");

// setup command handler
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter(file => file.endsWith(".js"));
log.info(`Loading a total of ${chalk.bold(commandFiles.length)} commands.`);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	log.debug(`Loaded ${chalk.bold(command.name)} command.`);
}

// setup event handler
const eventFiles = fs
	.readdirSync("./events/")
	.filter(file => file.endsWith(".js"));
log.info(`Loading a total of ${chalk.bold(eventFiles.length)} events.`);

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	const eventName = file.split(".")[0];
	client.on(eventName, event.bind(null, client));
	log.debug(`Loaded ${chalk.bold(eventName)} event.`);
}

// error handling
process.on("unhandledRejection", error => {
	log.error(`Uncaught Promise Rejection`);
	console.error(error);
});

client
	.on("disconnect", () => log.warn("Bot is disconnecting..."))
	.on("reconnecting", () => log.info("Bot reconnecting..."))
	.on("debug", debug => log.debug(debug))
	.on("error", e => log.error(e))
	.on("warn", info => log.warn(info));

client.login(token);