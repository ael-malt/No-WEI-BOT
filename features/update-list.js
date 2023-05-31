const Discord = require("discord.js");
const { Client, APIErrorCode } = require("@notionhq/client");
const UL_Schema = require("../schemas/update-list-schema");

module.exports = async (instance, client) => {
	const Guild = client.guilds.cache.get("911220781298630676"); // Server Id
	var targetChannel = client.channels.cache.get("1111327975439335549"); //Channel Id
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
		let message = '';
		let emoji = '';
		let names = [];
		let values = [];
		names[0] = 'To-do'
		values[0] = ''
		while (response.results[i]) {
			if (response.results[i].heading_1)
			{
				listEmbed.setTitle(response.results[0].heading_1.rich_text[0].text.content)
				message += `# __${response.results[0].heading_1.rich_text[0].text.content}__\n`;
			}
			else if (response.results[i].heading_3)
			{
				j++;
				names[j] = response.results[i].heading_3.rich_text[0].text.content
				values[j] = ''
				message += `### __${response.results[i].heading_3.rich_text[0].text.content}__\n`;
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
				message += `${emoji} - ${response.results[i].to_do.rich_text[0].text.content}\n`
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
		const existingEntry = await UL_Schema.find({
		});
		console.log (existingEntry)
		// Send Message
		var msg = await targetChannel.send({ embeds: [listEmbed] });


		// //If new entry found, add to MongoDB and send Discord message
		// if (existingEntry[0] === undefined) {
			//Adding MongoDB entry
			// await new UL_Schema({
			// text: "test",
			// messageId: "test",
			// }).save();
		// }
		// 	//Get Answers

		// 	const pageInfo = myPage.results[i].properties;
		// 	// console.log(pageInfo);

		// 	const url = myPage.results[i].url;

		// 	const Username =
		// 	pageInfo["Contact (Discord Username)"].title[0].plain_text;

		// 	const teamAppartenance = pageInfo.Team.select.name;

		// 	const Description =
		// 	pageInfo["Description & goal"].rich_text[0].plain_text;

		// 	try {
		// 	var keyResults = pageInfo["Key results"].rich_text[0].plain_text;
		// 	} catch (err) {
		// 	if (err) {
		// 		var keyResults = "-";
		// 	}
		// 	}

		// 	try {UpdateChannel
		// 	}

		// 	try {
		// 	var Budget = pageInfo.Budget.rich_text[0].plain_text;
		// 	} catch (err) {
		// 	if (err) {
		// 		var Budget = "-";
		// 	}
		// 	}



		// 	const embed = new MessageEmbed()
		// 	.setTitle(`New project by ${Username}`)
		// 	.setURL(url)
		// 	.setColor("WHITE")
		// 	.addFields(
		// 		{
		// 		name: "1. Can you briefly describe the project and its goal?",
		// 		value: Description,
		// 		},
		// 		{
		// 		name: "2. What are the expected outcomes ? What does this project aim to accomplish?",
		// 		value: keyResults,
		// 		},
		// 		{
		// 		name: "3. When does it ship and what are the milestones?",
		// 		value: Milestones,
		// 		},
		// 		{
		// 		name: "4. If there are some costs associated, please mention them here.",
		// 		value: Budget,
		// 		}
		// 	);
		// }
		// }
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