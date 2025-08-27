
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
    .setColor('#FEE75C')
    //.set title: prints title
    .setTitle('Ups, este canal está en mantenimiento en este momento')
    //.setURL('https://discord.js.org/')
    //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/2Utpujo.png', url: 'https://lol.es' })
    .setDescription('Lo sentimos, prueba más tarde o contacta con un administrador para más información.')
    .setThumbnail('https://i.imgur.com/6LnjnOv.png')
    //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    //.setImage('https://i.imgur.com/bC5CdRI.png')
    //.setTimestamp()
    .setFooter({ text: 'Powered by Kibu', iconURL: 'https://i.imgur.com/bC5CdRI.png' });


module.exports = {


    data: new SlashCommandBuilder()
        .setName('warning')
        .setDescription('genera el mensaje de mantenimiento'),
    async execute(interaction) {

        await interaction.channel.send({ embeds: [culoembed] })
    
    },
};