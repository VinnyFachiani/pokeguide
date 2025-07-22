// Este é o arquivo principal do seu bot Discord.

// Importa as classes necessárias do discord.js
import { Client, GatewayIntentBits } from 'discord.js';
// Importa o dotenv para carregar variáveis de ambiente
import dotenv from 'dotenv';
// Importa a função respawnPokemon do seu arquivo respawns.js
import { respawnPokemon } from './respawns.js'; // Adicione .js se estiver usando módulos ES6 em Node.js

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma nova instância do cliente Discord com as intenções necessárias
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // IMPORTANTE: Para ler o conteúdo das mensagens
    ]
});

// Evento 'ready': Disparado quando o bot está logado e pronto
bot.once('ready', () => {
    console.log(`Bot conectado como ${bot.user.tag}!`); // Mostra o nome do bot
    console.log('Lançado!');
});

// Evento 'messageCreate': Disparado quando uma nova mensagem é criada
// Este handler agora é 'async' porque ele vai chamar uma função assíncrona (respawnPokemon)
bot.on('messageCreate', async message => { // Adicionado 'async' aqui
    // Ignora mensagens de outros bots para evitar loops infinitos
    if (message.author.bot) return;

    // Verifica se o conteúdo da mensagem é exatamente '!Who are you?'
    if (message.content === '!Who are you?') {
        // Envia a resposta no mesmo canal onde a mensagem foi enviada
        message.channel.send('New Bot!');
    }
    // Verifica se a mensagem começa com '!respawn'
    else if (message.content.startsWith('!respawn')) {
        // Extrai o nome do Pokémon da mensagem (ex: '!respawn Bulbassauro' -> 'Bulbassauro')
        const args = message.content.split(' ');
        const pokemonName = args[1]; // O nome do Pokémon é o segundo elemento

        // Chama a função de respawn passando o nome do Pokémon e o canal da mensagem
        // Adicionado 'await' porque 'respawnPokemon' agora é uma função assíncrona
        await respawnPokemon(pokemonName, message.channel);
    }
});

// Faz o login do bot usando o token do Discord
// O token deve ser carregado de uma variável de ambiente por segurança
bot.login(process.env.DISCORD_BOT_TOKEN);
