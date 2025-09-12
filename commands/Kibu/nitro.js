
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
    .setColor('#ff57ce')
    .setTitle('💜 Beneficios para Boosters')
    //.setDescription('Meow! Kibu te enseñara todos los comandos disponibles a cambio de un pescadito')
    .setThumbnail('https://i.imgur.com/ub9ky8m.gif')
    .addFields(
        { name: '__CHAT__', value: '\n🔹 - Rol Booster <@&1350953924886138942> \n🔹 - Permisos de imagen en el Chat general  \n🔹 - Cambio de nombre \n🔹 - Adelantos sobre noticias del servidor \n🔹 - Emogis y stickers externos \n🔹 - Mensajes de voz \n 🔹 - Crear encuestas' },
        { name: '__VOZ__', value: '\n🔸 - Acceso a panel de sonidos \n🔸 - Cambiar el estado de el canal de voz \n🔸 - Acceso a actividades' },
        { name: '\u200B', value: '\u200B' },
        
    )
    
    .setFooter({ text: 'Powered by Kibu', iconURL: 'https://i.imgur.com/bC5CdRI.png' });


module.exports = {


    data: new SlashCommandBuilder()
        .setName('nitro')
        .setDescription('Beneficios nitro'),
    async execute(interaction) {

        //await interaction.reply('Kibu esta buscando...');
        await interaction.channel.send({ embeds: [culoembed] })
        //await interaction.channel.send({ components: [culorow] })

    },
};