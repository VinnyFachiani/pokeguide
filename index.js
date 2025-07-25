// Este é o arquivo principal do seu bot Discord.

// Importa as classes necessárias do discord.js
import { Client, GatewayIntentBits } from 'discord.js';
// Importa o dotenv para carregar variáveis de ambiente
import dotenv from 'dotenv';
// Importa a função respawnPokemon do seu arquivo respawns.js
import { respawnPokemon } from './respawns.js'; // Adicione .js se estiver usando módulos ES6 em Node.js
import { pokesBox } from './box.js'; // Adicione .js se estiver usando módulos ES6 em Node.js

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
    if (message.content.startsWith('!respawn')) {
        // Extrai o nome do Pokémon da mensagem (ex: '!respawn Bulbassauro' -> 'Bulbassauro')
        const args = message.content.split(' ');
        const pokemonName = args[1]; // O nome do Pokémon é o segundo elemento

        // Chama a função de respawn passando o nome do Pokémon e o canal da mensagem
        // Adicionado 'await' porque 'respawnPokemon' agora é uma função assíncrona
        await respawnPokemon(pokemonName, message.channel);
    }
    // Verifica se a mensagem começa com '!box'
    else if (message.content.startsWith('!box')) {
        // Extrai o nome da Task da mensagem (ex: '!quest Bulbassauro' -> 'Bulbassauro')
        const args = message.content.split(' ');
        const numerobox = args[1]; // 

        // Chama a função de respawn passando o nome do Pokémon e o canal da mensagem
        // Adicionado 'await' porque 'pokexBox' agora é uma função assíncrona
        await pokesBox(numerobox, message.channel);
    }




    else if (message.content.startsWith('!comandos')) {
        // Extrai o nome da Task da mensagem (ex: '!quest Bulbassauro' -> 'Bulbassauro')
        var comandos = '**!respawn [nome do Pokémon]** - Envia as coordenadas de respawn do Pokémon especificado.\n\n'
        comandos += '**!box [número 1 à 4]** - Mostra os Pokemons que podem vir em cada Box.\n\n'

        const embed = {
            color: 0x0099ff, // Cor da barra lateral da embed (azul)
            title: `Comandos Disponíveis no Bot (Em desenvolvimento)`,
            description: comandos,
            thumbnail: { // O ícone do Pokémon será exibido como thumbnail
                url: 'https://cdn-icons-png.flaticon.com/512/8161/8161879.png',
            },
            // Você pode adicionar mais campos se quiser, por exemplo:
            // fields: [
            //     { name: 'Região', value: foundPokemons[0].region, inline: true },
            // ],
            timestamp: new Date(), // Adiciona um timestamp
            footer: {
                text: 'Bot criado por Montauro',
                // icon_url: 'URL de um ícone para o rodapé, se tiver'
            },
        };

        // Envia a mensagem com a embed
        message.channel.send({ embeds: [embed] });
    }

    else if(message.content.startsWith('!')) {
        message.channel.send(`${message.author} comando ${message.content} não reconhecido.\nUse !comandos para ver os comandos disponíveis.`);
    }
});

// Faz o login do bot usando o token do Discord
// O token deve ser carregado de uma variável de ambiente por segurança
bot.login(process.env.DISCORD_BOT_TOKEN);