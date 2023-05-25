const Discord = require("discord.js");
const { Client, APIErrorCode } = require("@notionhq/client");
// const UL_Schema = require("../schemas/notion-projects-schema");

module.exports = async (instance, client) => {
	const Guild = client.guilds.cache.get("911220781298630676"); // Server Id
	var targetChannel = client.channels.cache.get("1111327975439335549"); //Channel Id
	const notion = new Client({
		auth: process.env.NOTION_TOKEN,
	});
	const databaseId = 'aa3864006a1f456fa5eab0ad7c115b0e';
	

	async function notionProjectNotif() {
	try {
		// const response = await notion.search({
		// 	query: 'No WEI Back',
		// });
		// console.log(response.results[0]);


		// const pageId = 'aa386400-6a1f-456f-a5ea-b0ad7c115b0e';
		// const response = await notion.pages.retrieve({ page_id: pageId });
		// console.log(response.properties.title);
		const blockId = 'aa386400-6a1f-456f-a5ea-b0ad7c115b0e';
		const response = await notion.blocks.children.list({
		  block_id: blockId,
		  page_size: 50,
		});
		console.log(response.results[2].to_do);
		let i = 0;
		let message = '';
		let emoji = ''
		while (response.results[i]) {
			if (response.results[i].heading_1)
				message += `# __${response.results[0].heading_1.rich_text[0].text.content}__\n`;
			else if (response.results[i].heading_3)
				message += `### __${response.results[i].heading_3.rich_text[0].text.content}__\n`;
			else if (response.results[i].divider)
				 ;
			else if (response.results[i].to_do)
			{
				if (response.results[i].to_do.checked == false)
					emoji = '🇽'
				else
					emoji = '✅'
				message += `${emoji} - ${response.results[i].to_do.rich_text[0].text.content}\n`
			}
			i++;
		}
		console.log(message);

		// const myPage = await notion.databases.query({
		// database_id: databaseId,
		// });
		// console.log(myPage.results[0]);

		// for (let i = 0; i < myPage.results.length; i++) {
		// //Check for existing entries
		// const existingEntries = await UL_Schema.find({
		// 	object: myPage.results[i].object,
		// 	id: myPage.results[i].id,
		// 	created_time: myPage.results[i].created_time,
		// 	url: myPage.results[i].url,
		// });

		// //If new entry found, add to MongoDB and send Discord message
		// if (existingEntries[0] === undefined) {
		// 	//Adding MongoDB entry
		// 	await new UL_Schema({
		// 	object: myPage.results[i].object,
		// 	id: myPage.results[i].id,
		// 	created_time: myPage.results[i].created_time,
		// 	url: myPage.results[i].url,
		// 	}).save();

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
			targetChannel.send({ content: message });
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