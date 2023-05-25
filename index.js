const { Client, IntentsBitField, Partials, } = require("discord.js");

const WOK = require("wokcommands");
const path = require("path");
require("dotenv/config");

const dotenv = require("dotenv");
dotenv.config();
const UpdateChannel = "905417166906613780";

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
	],
	partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.GuildScheduledEvent, Partials.ThreadMember],
});

client.on("ready", () => {
	console.log("No Wei BOT is Ready!");
	client.user.setActivity('your towels', { type: "WATCHING" });
	new WOK({
		client,
		commandsDir: path.join(__dirname, "commands"),
		featuresDir: path.join(__dirname, "features"),
		testServers: ["911220781298630676"],
		mongoUri: process.env.MONGO_URI,
	});
	client.channels.cache.get(UpdateChannel);
});

client.login(process.env.DISCORD_TOKEN);