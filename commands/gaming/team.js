const { SlashCommandBuilder, SlashCommandRoleOption, ChatInputCommandInteraction, SlashCommandStringOption, InteractionCallback } = require('discord.js');

const list = [];

module.exports = {

    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('find a teammate')
        .addRoleOption(new SlashCommandRoleOption()
            .setName('Game')
            .setDescription('The game you are looking to play')
            .setRequired(true)),
    async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {
        await interaction.reply('Testing ✅' + interaction.options.getRole('Game'));
        const position = list.indexOf(interaction.user.id)
        if (position !== -1) {
            list.splice(position, 1)
        }
        if (list.length === 3) {
            list.shift()
        }
        list.push(interaction.user.id)
    },
};
