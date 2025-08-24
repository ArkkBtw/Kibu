const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {
		await interaction.reply('Pong!');
	},
};
