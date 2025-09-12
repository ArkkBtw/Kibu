const {
    userMention,
    SlashCommandBuilder,
    SlashCommandRoleOption,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require('discord.js');
const fs = require('fs');
const path = './gamesData.json';

// Mapa para almacenar usuarios recientes por juego
const gamesOfRecentPeople = new Map();

// ▶️ Cargar datos si existen
if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    for (const [key, value] of Object.entries(data)) {
        gamesOfRecentPeople.set(key, value);
    }
    console.log('Datos cargados desde gamesData.json');
}

//  Guardar el Map en archivo
function saveMapToFile() {
    const obj = Object.fromEntries(gamesOfRecentPeople);
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    console.log('Datos guardados en gamesData.json');
}

//  Guardar al cerrar el proceso
process.on('exit', saveMapToFile);
process.on('SIGINT', () => {
    saveMapToFile();
    process.exit();
});
process.on('SIGTERM', () => {
    saveMapToFile();
    process.exit();
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Encuentra gente que ha buscado equipo recientemente')
        .addRoleOption(new SlashCommandRoleOption()
            .setName('juego')
            .setDescription('Elige un rol que describa el juego que buscas')
            .setRequired(true)),

    async execute(/** @type {ChatInputCommandInteraction<'cached'>} */ interaction) {
        const game = interaction.options.getRole('juego');
        await interaction.reply('Buscando jugadores para ' + game.name + ' ...');

        if (!gamesOfRecentPeople.has(game.id)) {
            gamesOfRecentPeople.set(game.id, []);
        }

        const list = gamesOfRecentPeople.get(game.id);

        // Eliminar si ya está para evitar duplicados
        const position = list.indexOf(interaction.user.id);
        if (position !== -1) {
            list.splice(position, 1);
        }

        // Limitar a máximo 3 jugadores
        if (list.length === 3) {
            list.shift();
        }

        // Agregar siempre al usuario
        list.push(interaction.user.id);

        // Guardar después de cada cambio
        saveMapToFile();

        console.log("the user", list, "selected the role", game.name);

        // Filtramos para que no se muestre el propio usuario
        const filteredList = list.filter(id => id !== interaction.user.id);

        // Crear el embed directamente
        let embed;
        if (filteredList.length === 0) {
            embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('¡Ups! Por ahora no hay nadie por aquí 💤')
                .setDescription(`Parece que eres el primero en buscar jugadores para **${game.name}**.\n¡Espera un poco o intenta con otro juego diferente!`)
                .setThumbnail('https://i.imgur.com/bC5CdRI.png');
        } else {
            embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('¡Jugadores detectados! 🎯')
                .setDescription(`**¡Meow!** Estos son algunos de los jugadores recientes que estaban cazando un compañero para **${game.name}**.\n\n¡Prueba a escribirles a ver si quieren jugar!`)
                .setThumbnail('https://i.imgur.com/bC5CdRI.png')
                .addFields(
                    filteredList.map(id => ({ name: "Jugador", value: userMention(id) }))
                );
        }

        // Enviamos el embed final
        await interaction.channel.send({ embeds: [embed] });
    },
};
