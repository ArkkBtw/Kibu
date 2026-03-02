// ignore this shit, this is just to make the online host working
const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const gamepath = "./presenceData.json";
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');
const mensajesBusqueda = new Map();

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences
    ]
});

client.mensajesBusqueda = mensajesBusqueda;
 
const desc = [`El gatito oficial de BWF 💫`,
    `Gatito monitoreando 👀`,
    `Cuidando el servidor 🛡️`,
    `Durmiendo en BWF 💤`,
    `Cazando bugs dentro de BWF 🐛`,
    `Tareas hechas, ¡Meow! ✔️`
];

let i = 0;


client.once("ready", () => {
    // Ejecutar inmediatamente una vez
    client.user.setActivity(desc[i], { type: 3 });

    // Cambiar cada 24 horas
    setInterval(() => {
        i++;
        if (i >= desc.length) i = 0;

        client.user.setActivity(desc[i], { type: 3 });

    }, 86400000); // 24h = 86,400,000 ms
});

/*
//pressence checker

// Cargar archivo o crearlo
function loadData() {
	if (!fs.existsSync(gamepath)) {
		fs.writeFileSync(gamepath, JSON.stringify({}, null, 2));
	}
	return JSON.parse(fs.readFileSync(gamepath, 'utf-8'));
}

// Guardar archivo
function saveData(data) {
	fs.writeFileSync(gamepath, JSON.stringify(data, null, 2));
}

client.on("presenceUpdate", async (oldPresence, newPresence) => {
	if (!newPresence || !newPresence.user) return;

	const userId = newPresence.user.id;
	const username = newPresence.user.username;

	// find activity "Playing" 0
	const gameActivity = newPresence.activities?.find(
		act => act.type === 0 // "Playing" and listening?
	);



	const gameName = gameActivity ? gameActivity.name : null;


	// hmm load
	const data = loadData();

	// create the list
	if (!data[userId]) {
		data[userId] = {
			username: username,
			games: [],
			updatedAt: null
		};
	}

	// we push the song and game in to the upper list
	if (gameName && !data[userId].games.includes(gameName)) {
		data[userId].games.push(gameName);
		console.log(`Añadido juego para ${username}: ${gameName}`);
	}



	data[userId].updatedAt = new Date().toISOString();

	// save
	saveData(data);

	console.log(`updated ${username}: jugando → ${gameName}`);
	//console.log(newPresence.activities);

});

//pressence checker
*/

const commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, function (readyClient) {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;


	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

/*
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    // BOTÓN: JUGAR
    if (interaction.customId === 'aceptar_juego') {
        await interaction.reply({
            content: '✅ Te marqué como listo para jugar.',
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    // BOTÓN: NO POR AHORA
    if (interaction.customId === 'rechazar_juego') {
        await interaction.reply({
            content: '⏳ Sin problema, quizá luego.',
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    // BOTÓN: BLOQUEAR
    if (interaction.customId === 'bloquear_juego') {
        await interaction.reply({
            content: '🚫 No volverás a recibir invitaciones.',
            flags: MessageFlags.Ephemeral
        });
        return;
    }
}); */


// Log in to Discord with your client's token
client.login(token);
