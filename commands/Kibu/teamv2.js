const { 
    userMention, 
    Role, 
    SlashCommandBuilder, 
    SlashCommandRoleOption, 
    ChatInputCommandInteraction, 
    SlashCommandStringOption, 
    InteractionCallback, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    roleMention 
} = require('discord.js');

const gamesOfRecentPeople = new Map()

// Función para crear embed
function createculoembed(list, game) {
    return new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('jugadores recientes')
        .setDescription("¡Miau! Estos son algunos de los jugadores recientes que estaban cazando un compañero para este juego.")
        .setThumbnail('https://i.imgur.com/bC5CdRI.png')
        .addFields(
            list.map(id => ({ name: "Jugador", value: userMention(id) }))
        )
        .setTimestamp()
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('team2')
        .setDescription('Encuentra gente que ha buscado equipo recientemente')
        .addRoleOption(new SlashCommandRoleOption()
            .setName('juego')
            .setDescription('Elige un rol que describa el juego que buscas')
            .setRequired(true)),

    async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {

        const game = interaction.options.getRole('juego')

        await interaction.reply('Buscando jugadores para ' + game.name + " ...");

        if (!gamesOfRecentPeople.has(game.id)) {
            gamesOfRecentPeople.set(game.id, [])
        }

        const list = gamesOfRecentPeople.get(game.id)

        // Si el user ya está en la lista, lo quitamos para volverlo a meter al final
        const position = list.indexOf(interaction.user.id)
        if (position !== -1) {
            list.splice(position, 1)
        }

        // Mantener máximo 3 jugadores en lista
        if (list.length === 3) {
            list.shift()
        }

        // Guardar SIEMPRE al usuario en la lista
        list.push(interaction.user.id)

        console.log("the user", list, "selected the role", game.name)

        // Filtramos solo para el embed (para que no aparezca el propio user)
        const filteredList = list.filter(id => id !== interaction.user.id);

        // Enviamos embed vacío primero
        const message = await interaction.channel.send({ embeds: [createculoembed([], game)] })

        // Luego lo editamos con la lista filtrada
        await message.edit({ embeds: [createculoembed(filteredList, game)] })
    },
};