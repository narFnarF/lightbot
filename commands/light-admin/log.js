const commando = require('discord.js-commando');
const logger = require("../../logger.js");
const logSender = require("../../LogSender.js");


module.exports = class CommandHelpadmin extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'logs',
			aliases: ['log'],
			group: 'light-admin',
			memberName: 'logs',
			description: "Sends a copy of the logs and DB to the usual channel.",
			details: `Sends a copy of the logs and DB to the channel specified in the config.json file ("backupChannel").`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`Log requested by ${msg.author.username} ${msg.author} (in server "${msg.guild.name}")`);

		msg.reply(`Acknowledge! Sending you the files...`);
		// try {
			await logSender.sendErrorLogs();
			await logSender.sendInfoLogs();
			await logSender.sendPlayerDB();

			return msg.reply(`I sent you the files in the usual place.`);

		// } catch(err){
		// 	logger.error(`Error in !log command. Could not send the files.`);
		// 	throw err;
		// }

	}


};
