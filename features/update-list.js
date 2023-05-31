const Discord = require("discord.js");
const { Client, APIErrorCode } = require("@notionhq/client");
const UL_Schema = require("../schemas/update-list-schema");
const mongoose = require('mongoose');
module.exports = async (instance, client) => {
	mongoose.connect(process.env.MONGO_URI);
	// const UL_Schema = mongoose.model('update-list', new mongoose.Schema({ name: String }));
	
	const targetChannel = client.channels.cache.get("1113464078619394078"); //Channel Id
	const notion = new Client({
		auth: process.env.NOTION_TOKEN,
	});

	async function notionProjectNotif() {
	try {
		const blockId = 'aa386400-6a1f-456f-a5ea-b0ad7c115b0e';
		const response = await notion.blocks.children.list({
		  block_id: blockId,
		  page_size: 50,
		});
		const listEmbed = new Discord.EmbedBuilder();
		// console.log(response.results[2].to_do);
		let i = 0;
		j = 0;
		let listContent = '';
		let emoji = '';
		let names = [];
		let values = [];
		names[0] = 'To-do'
		values[0] = ''
		while (response.results[i]) {
			if (response.results[i].heading_1)
			{
				listEmbed.setTitle(response.results[0].heading_1.rich_text[0].text.content)
				listContent += `# __${response.results[0].heading_1.rich_text[0].text.content}__\n`;
			}
			else if (response.results[i].heading_3)
			{
				j++;
				names[j] = response.results[i].heading_3.rich_text[0].text.content
				values[j] = ''
				listContent += `### __${response.results[i].heading_3.rich_text[0].text.content}__\n`;
			}
			else if (response.results[i].divider)
				 ;
			else if (response.results[i].to_do.rich_text[0].text.content)
			{
				if (response.results[i].to_do.checked == false)
					emoji = '🇽'
				else
					emoji = '✅'
				values[j] += `${emoji} - ${response.results[i].to_do.rich_text[0].text.content}\n`
				listContent += `${emoji} - ${response.results[i].to_do.rich_text[0].text.content}\n`
			}
			i++;
		}
		j = 0;
		while (names[j]) {
			listEmbed.addFields({name: names[j], value: values[j]});
			j++;
		}
		const today = new Date();
		listEmbed.setFooter({text: `🕛 Updated ${today.getUTCHours() + 2}:${today.getUTCMinutes()}`})

		// Check for existing entries
		var existingEntry = await getEntry();
		
		//If new entry found, add to MongoDB and send Discord message
		if (existingEntry[0] === undefined) {
			sendMessage(targetChannel, listEmbed, listContent);
		} else {
			try {
				// Edit message
				await targetChannel.messages.fetch(existingEntry[0].messageId)
				.then(message => message.edit({embeds: [listEmbed]}))
			} catch (error) {
				// If message has been deleted
				// Rm DB entry
				try {
					await UL_Schema.findOneAndDelete({
						messageId: existingEntry[0].messageId
					})
					// Send new message
					sendMessage(targetChannel, listEmbed, listContent);
				} catch (error) {
					console.log(error);
				}
			}
		}
	} catch (error) {
		if (error.code === APIErrorCode.ObjectNotFound) {
		} else {
		console.error(error);
		}
	}
	}
	notionProjectNotif();

	function start() {
	setTimeout(function () {
		notionProjectNotif();
		start();
	}, 304000);
	}
	start();
};

module.exports.config = {
	dbName: "notion-contributors",
	displayName: "Notion Contributors",
};
async function getEntry() {
	return (await UL_Schema.find({}));
}
async function sendMessage(targetChannel, listEmbed, listContent) {
	// Send Message
	var msg = await targetChannel.send({ embeds: [listEmbed] });

	// Add MongoDB entry
	await new UL_Schema({
	text: listContent,
	messageId: msg.id,
	}).save();
}