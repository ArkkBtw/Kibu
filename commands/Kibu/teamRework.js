const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const fs = require('fs');
const bloqueadosPath = './bloqueados.json';

// ───────── SISTEMA BLOQUEADOS ─────────

function obtenerBloqueados() {
    if (!fs.existsSync(bloqueadosPath)) {
        fs.writeFileSync(bloqueadosPath, JSON.stringify([]));
    }
    // @ts-ignore
    return JSON.parse(fs.readFileSync(bloqueadosPath));
}

function guardarBloqueados(lista) {
    fs.writeFileSync(bloqueadosPath, JSON.stringify(lista, null, 2));
}


// ───────── SISTEMA COOLDOWN ─────────

// userId -> timestamp del último DM
const cooldowns = new Map();

// tiempo de cooldown en milisegundos (ej: 6 horas)
const COOLDOWN_TIME = 6 * 60 * 60 * 1000; // 21,600,000 ms

// ─────────────────────────────────────


module.exports = {
    data: new SlashCommandBuilder()
        .setName('buscar')
        .setDescription('Busca jugadores y envía invitaciones')
        .addStringOption(option =>
            option.setName('juego')
                .setDescription('Nombre del juego')
                .setRequired(true)
        ),


    async execute(interaction) {

        const gameQuery = interaction.options.getString('juego').toLowerCase();
        //await interaction.reply(`🔍 Buscando jugadores para **${gameQuery}**...`);
        //await interaction.reply(`Kibu esta pensando...`);
        await interaction.reply('> <:busy:1419271665627566160> Invitando jugadores...');

        const encontrados = [];

        interaction.client.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(member => {
                if (!member.presence) return;
                const playing = member.presence.activities.find(a => a.type === 0);
                if (!playing) return;

                if (playing.name.toLowerCase().includes(gameQuery)) {
                    encontrados.push(member);
                }
            });
        });

        if (!encontrados.length) {
            return interaction.editReply('⚠️ Nadie jugando al juego seleccionado.');
        }

        const embedplay = new EmbedBuilder()
            .setTitle(`<:busy:1419271665627566160> Invitación para jugar   <  **${gameQuery}**  >`)
            .setDescription(`<@${interaction.user.id}> está buscando un compañero para jugar \n- **${gameQuery}**`)
            .setColor('#00ADEF');


            // const embedacept = new EmbedBuilder()
            // .setTitle('✅ ¡Te uniste a la partida!')
            // .setDescription(`Has aceptado la invitacion para jugar **${gameQuery}** \n\nTe estan esperando en el servidor: \n- https://discord.gg/58KZmPCuUR \nEn el canal:\n- https://discord.com/channels/1349470064516136971/1410305098311274556`)
            // .setColor('#28ef00');

            const embedacept = new EmbedBuilder()
            .setTitle('✅ ¡Te uniste a la partida!')
            .setDescription(`Has aceptado la invitación para jugar **${gameQuery}** \n\n<@${interaction.user.id}> Te está esperando en el canal:\n- https://discord.com/channels/1349470064516136971/1410305098311274556`)
            .setColor('#28ef00');
            

            const embedexpire = new EmbedBuilder()
            .setTitle('⏰ Invitación expirada.')
            .setDescription(`Te perdiste una invitación para jugar **${gameQuery}** \nPuedes ver quién te la envió y a qué hora fue en: \nhttps://discord.com/channels/1349470064516136971/1410305098311274556`)
            .setColor('#00ADEF');


            const embeddecline = new EmbedBuilder()
            .setTitle('❌ Invitación rechazada.')
            .setDescription(`Has rechazado la invitación para **${gameQuery}**`)
            .setColor('#e91e1e');


            const embedblock = new EmbedBuilder()
            .setTitle('🚫 Has bloqueado futuras invitaciones.')
            .setDescription(`Ya no recibirás invitaciones de ningún jugador. \nPuedes volver a activar este sistema en: \n- https://discord.com/channels/1349470064516136971/1376994057544536276`)
            .setColor('#f4f7f8');

        const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('aceptar_juego')
                .setLabel('Aceptar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('rechazar_juego')
                .setLabel('Rechazar')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('bloquear_juego')
                .setLabel('Bloquear')
                .setStyle(ButtonStyle.Secondary)
        );

        // ───────── FILTRAR BLOQUEADOS + MAX 4 ─────────

        const bloqueados = obtenerBloqueados();

        // @ts-ignore
        const ahora = Date.now();

        // @ts-ignore
        const miembrosUnicos = new Map();

for (const member of encontrados) {
    if (!miembrosUnicos.has(member.id)) {
        miembrosUnicos.set(member.id, member);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// @ts-ignore
let candidatos = [...miembrosUnicos.values()]
    .filter(member => {
        if (bloqueados.includes(member.id)) return false;

        const ultimoDM = cooldowns.get(member.id);
        if (!ultimoDM) return true;

        return (ahora - ultimoDM) > COOLDOWN_TIME;
    });

// 🔀 Mezclar aleatoriamente
candidatos = shuffleArray(candidatos);

// Tomar máximo 4 ya mezclados
const lista = candidatos.slice(0, 2);

        /*if (!lista.length) {
            return interaction.editReply('❌ No hay jugadores disponibles');
        }*/

        let aceptado = false;

        async function invitarSiguiente(index) {

            if (index >= lista.length || aceptado) {
                if (!aceptado) {
                    await interaction.editReply('No pude encontrar ningun compañero <:sad:1420852911964946482>');
                    //await interaction.followUp('No pude encontrar ningun compañero <:sad:1420852911964946482>');
                }
                return;
            }

            const member = lista[index];
            let dm;

            try {

                dm = await member.send({
                    embeds: [embedplay],
                    components: [botones]
                });

                // guardar timestamp del envío
                cooldowns.set(member.id, Date.now());

                const filter = i =>
                    i.user.id === member.id &&
                    ['aceptar_juego', 'rechazar_juego', 'bloquear_juego'].includes(i.customId);

                const collected = await dm.awaitMessageComponent({
                    filter,
                    time: 60000
                });

                // ───────── ACEPTAR ─────────

                if (collected.customId === 'aceptar_juego') {

                    aceptado = true;


                    await collected.update({
                    embeds: [embedacept],
                    components: []
                    });

                    await interaction.editReply(`🎉🎉<@${member.id}> aceptó la invitación!🎉🎉 \n\n> <:wee:1419271471951515679> ¡Podéis empezar a chatear en este mismo canal! !Meow!`);
                    
                    
                }

                // ───────── RECHAZAR ─────────

                else if (collected.customId === 'rechazar_juego') {

                    // await collected.update({
                    //     content: '❌ Invitación rechazada.',
                    //     components: []
                    // });
                    await collected.update({
                    embeds: [embeddecline],
                    components: []
                    });

                    invitarSiguiente(index + 1);
                }

                // ───────── BLOQUEAR ─────────

                else if (collected.customId === 'bloquear_juego') {

                    let bloqueados = obtenerBloqueados();

                    if (!bloqueados.includes(member.id)) {
                        bloqueados.push(member.id);
                        guardarBloqueados(bloqueados);
                    }

                    // await collected.update({
                    //     content: '🚫 Has bloqueado futuras invitaciones.',
                    //     components: []
                    // });

                    await collected.update({
                    embeds: [embedblock],
                    components: []
                    });

                    invitarSiguiente(index + 1);
                }

            } catch (err) {

                // ⏰ TIMEOUT

                try {
                    await dm.edit({
                        embeds: [embedexpire],
                        components: []
                    });
                } catch {}

                invitarSiguiente(index + 1);
            }
        }

        //await interaction.editReply('');
        await interaction.editReply('> <:busy:1419271665627566160> Invitando jugadores... \n> 💤 Este proceso podria tardar unos minutos...');

        invitarSiguiente(0);
    }
};