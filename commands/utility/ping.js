const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(/** @type {CommandInteraction<'cached'>} */ interaction) {
		await interaction.reply('Pong!');
	},
};
