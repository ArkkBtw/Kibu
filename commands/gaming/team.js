const { userMention, Role, SlashCommandBuilder, SlashCommandRoleOption, ChatInputCommandInteraction, SlashCommandStringOption, InteractionCallback, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const gamesOfRecentPeople = new Map()

//funtion can use any value like "list" even outside the code, and use it anywhere
function createculoembed(/** @type {any[]} */ list) {
    return new EmbedBuilder()
        .setColor('#E67E22')
        //.set title: prints title
        .setTitle('Team finder')
        //.setURL('https://discord.js.org/')
        //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/2Utpujo.png', url: 'https://lol.es' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/2Utpujo.png')
        .addFields(
            list.map(id => ({ name: "Player", value: userMention(id) }))
            // { name: '\u200B', value: '\u200B' },
            // { name: "Player", value: 'Some value here', inline: true },
            // { name: "Player", value: 'Some value here', inline: true },
        )
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        //.setImage('https://i.imgur.com/2Utpujo.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/2Utpujo.png' });

}





// // create new button with style
// const culobutton = new ButtonBuilder()
//     .setCustomId('button1')
//     .setLabel("button label")
//     .setURL("https://lol.es")
//     .setStyle(ButtonStyle.Link)

// // create new row  (Action Row Builder is needed to print the buttons)    
// const culorow = new ActionRowBuilder().addComponents(culobutton)


module.exports = {

    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Encuentra gente que ha buscado equipo recientemente')
        .addRoleOption(new SlashCommandRoleOption()
            .setName('juego')
            .setDescription('Elige un rol que describa el juego que buscas')
            .setRequired(true)),
    async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {

        const game = interaction.options.getRole('juego')

        await interaction.reply('Buscando jugadores para' + " " + game.name + " " + "...");
        if (!gamesOfRecentPeople.has(game.id)) {
            gamesOfRecentPeople.set(game.id, [])

        }

        const list = gamesOfRecentPeople.get(game.id)

        const position = list.indexOf(interaction.user.id)

        if (position !== -1) {
            list.splice(position, 1)
        }
        if (list.length === 3) {
            list.shift()
        }
        list.push(interaction.user.id)

        console.log("the user", list, "selected the role", game.id)
        console.log(list)

        // await interaction.channel.send(`${userMention(list[0])}, ${userMention(list[1])}, ${userMention(list[2])}>`)
        //await interaction.channel.send
        await interaction.channel.send({ embeds: [createculoembed(list)] })
        //await interaction.channel.send({ components: [culorow] })
    },
};
