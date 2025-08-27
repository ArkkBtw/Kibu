
const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandRoleOption, ChatInputCommandInteraction, Embed } = require('discord.js')


// //reclare the bot permissions
// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//     ],
// });

const culoembed = new EmbedBuilder()
    .setColor('#71368A')
    //.set title: prints title
    .setTitle('Comandos disponibles')
    //.setURL('https://discord.js.org/')
    //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/2Utpujo.png', url: 'https://lol.es' })
    .setDescription('Ups, este canal está en mantenimiento en este momento.')
    .setThumbnail('https://i.imgur.com/6LnjnOv.png')
    //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    //.setImage('https://i.imgur.com/bC5CdRI.png')
    //.setTimestamp()
    .setFooter({ text: 'Powered by Kibu', iconURL: 'https://i.imgur.com/bC5CdRI.png' });





// // create new button with style
// const culobutton = new ButtonBuilder()
//     // .setCustomId('button1')
//     .setLabel("button label")
//     .setURL("https://lol.es")
//     .setStyle(ButtonStyle.Link)

// // create new row  (Action Row Builder is needed to print the buttons)    
// const culorow = new ActionRowBuilder().addComponents(culobutton)


module.exports = {


    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('muestra todos los comandos'),
    async execute(interaction) {

        await interaction.reply('Kibu esta buscando...');
        await interaction.channel.send({ embeds: [culoembed] })
        //await interaction.channel.send({ components: [culorow] })

    },
};
// data: new SlashCommandBuilder()
//     .setName('shop')
//     .setDescription('obten el link directo a la tienda de BWF')
//     .addRoleOption(new SlashCommandRoleOption()
//         .setName('juego')
//         .setDescription('Elige un rol que describa el juego que buscas')
//         .setRequired(true)),
module.exports = {


    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('muestra todos los comandos'),
    async execute(interaction) {

        await interaction.reply('Kibu esta buscando...');
        await interaction.channel.send({ embeds: [culoembed] })
        //await interaction.channel.send({ components: [culorow] })

    },
};
// async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {

//const game = interaction.options.getRole('juego')

// if (!gamesOfRecentPeople.has(game.id)) {
//     gamesOfRecentPeople.set(game.id, [])

// }

// const list = gamesOfRecentPeople.get(game.id)

// const position = list.indexOf(interaction.user.id)

// if (position !== -1) {
//     list.splice(position, 1)
// }
// if (list.length === 3) {
//     list.shift()
// }
// list.push(interaction.user.id)

// console.log("the user", list, "selected the role", game.id)
// console.log(list)

// await interaction.channel.send(`${userMention(list[0])}, ${userMention(list[1])}, ${userMention(list[2])}>`)
//await interaction.channel.send
// const message = await interaction.channel.send({ embeds: [createculoembed([])] })
// await message.edit({ embeds: [createculoembed(list)] })
// //await interaction.channel.send({ components: [culorow] })
