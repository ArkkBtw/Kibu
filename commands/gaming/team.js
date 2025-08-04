const { SlashCommandBuilder, SlashCommandRoleOption, ChatInputCommandInteraction, SlashCommandStringOption, InteractionCallback } = require('discord.js');

const gamesOfRecentPeople = new Map()

module.exports = {

    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('find a teammate')
        .addRoleOption(new SlashCommandRoleOption()
            .setName('game')
            .setDescription('The game you are looking to play')
            .setRequired(true)),
    async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {
        await interaction.reply('Testing ✅' + interaction.options.getRole('game'));
        const game = interaction.options.getRole('game').id
        if (!gamesOfRecentPeople.has(game)) {
            gamesOfRecentPeople.set(game, [])

        }
        const list = gamesOfRecentPeople.get(game)



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
