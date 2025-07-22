// --- Arquivo: respawns.js (Atualizado com Imagem do Pokémon na Embed) ---
// Este arquivo contém a lógica para buscar as coordenadas dos Pokémons.

// Importa o módulo 'fs' para leitura de arquivos. Usamos 'promises' para operações assíncronas.
import { promises as fs } from 'fs';
// Importa 'path' para construir caminhos de arquivo de forma segura e compatível com diferentes OS.
import path from 'path';
// Importa 'fileURLToPath' e 'dirname' para obter o diretório atual em módulos ES.
import { fileURLToPath } from 'url';

// Define __dirname para módulos ES, equivalente ao CommonJS __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o caminho para o arquivo JSON.
// Certifique-se de que o caminho relativo './data/datarespawns.json' está correto
// em relação ao local onde 'respawns.js' está.
const datarespawnsPath = path.join(__dirname, 'data', 'datarespawns.json');

// Variável para armazenar os dados do Pokémon, carregada uma vez.
let pokemonData = null;

/**
 * Função assíncrona para carregar os dados do JSON.
 * Esta função será chamada uma vez para carregar os dados.
 */
async function loadPokemonData() {
    if (pokemonData) {
        return pokemonData; // Retorna os dados se já estiverem carregados
    }
    try {
        // Lê o conteúdo do arquivo JSON de forma assíncrona
        const fileContent = await fs.readFile(datarespawnsPath, 'utf8');
        // Faz o parseamento do conteúdo JSON
        // A nova estrutura JSON é um array diretamente, então não há necessidade de .respawns
        pokemonData = JSON.parse(fileContent);
        console.log("Dados de Pokémon carregados com sucesso!");
        return pokemonData;
    } catch (error) {
        console.error("Erro ao carregar datarespawns.json:", error);
        // Lança o erro para que a função chamadora possa lidar com ele
        throw new Error("Não foi possível carregar os dados de respawn.");
    }
}


function pLM(str) {
  if (!str) return str; // Retorna a string original se estiver vazia
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Função assíncrona para buscar as coordenadas de respawn de um Pokémon e enviá-las para um canal.
 * @param {string} pokemonName - O nome do Pokémon a ser pesquisado.
 * @param {object} channel - O objeto do canal do Discord para enviar a mensagem.
 */
export async function respawnPokemon(pokemonName, channel) {
    // Garante que os dados do Pokémon sejam carregados antes de prosseguir
    try {
        if (!pokemonData) { // Carrega os dados apenas se ainda não estiverem carregados
            await loadPokemonData();
        }
    } catch (error) {
        await channel.send(error.message); // Envia a mensagem de erro para o canal
        return;
    }

    // Verifica se o nome do Pokémon foi fornecido
    if (!pokemonName) {
        await channel.send('Por favor, forneça o nome do Pokémon que deseja as coordenadas do respawn. \nExemplo: !respawn bulbasaur');
        return; // Sai da função se o nome não for fornecido
    }

    // Procura TODOS os Pokémons que correspondem ao nome no array de dados
    // Usamos filter() para encontrar todas as ocorrências
    const foundPokemons = pokemonData.filter(respawn =>
        respawn.pokemon.name.toLowerCase() === pokemonName.toLowerCase()
    );

    // Formata o nome do Pokémon para ter apenas a primeira letra maiúscula
    const formattedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();

    // Se Pokémons forem encontrados
    if (foundPokemons.length > 0) {
        let coordsString = '';
        // Itera sobre cada Pokémon encontrado para coletar suas coordenadas
        for (const pokemon of foundPokemons) {
            // A coordenada agora está diretamente em 'pokemon.coords'
            coordsString += `\n:map:  **Região**: *${pLM(pokemon.region)}*  :pushpin: **Coordenada**: *${pokemon.coords}*`;
        }

        // Pega o ícone do primeiro Pokémon encontrado (assumindo que todos os ícones são os mesmos para o mesmo Pokémon)
        const pokemonIconUrl = foundPokemons[0].pokemon.icon;

        // Cria uma Embed para a mensagem
        const embed = {
            color: 0x0099ff, // Cor da barra lateral da embed (azul)
            title: `Coordenadas do Respawn do ${formattedPokemonName}`,
            description: coordsString,
            thumbnail: { // O ícone do Pokémon será exibido como thumbnail
                url: pokemonIconUrl,
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
        await channel.send({ embeds: [embed] });

    } else {
        // Se o Pokémon não for encontrado
        await channel.send(`Pokémon "${formattedPokemonName}" não encontrado respawn.`);
    }
}
