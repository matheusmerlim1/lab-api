// Selecionando elementos do DOM
const btn = document.getElementById("btnCambio");
const moedaInicialSelect = document.getElementById("moedaTipoInicial");
const moedaFinalSelect = document.getElementById("moedaTipoFinal");
const valorInput = document.getElementById("cambioInput");
const resultDiv = document.getElementById("result1");

// URL base da API
const apiBaseUrl = "https://v6.exchangerate-api.com/v6/d17206a6ae7057eb70a08ed3";

// Função para carregar taxas de câmbio
async function carregaDados(moedaInicial) {
    try {
        const resposta = await fetch(`${apiBaseUrl}/latest/${moedaInicial}`);
        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados");
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        return null;
    }
}

// Função para converter valores
async function converter(moedaInicial, moedaFinal, valor) {
    try {
        const resposta = await fetch(`${apiBaseUrl}/pair/${moedaInicial}/${moedaFinal}`);
        if (!resposta.ok) {
            throw new Error("Erro ao realizar a conversão");
        }
        const dados = await resposta.json();
        const taxaConversao = dados.conversion_rate;
        return valor * taxaConversao;
    } catch (error) {
        console.error("Erro na conversão:", error);
        return null;
    }
}

// Evento de clique no botão para realizar a conversão
btn.addEventListener("click", async () => {
    const moedaInicial = moedaInicialSelect.value;
    const moedaFinal = moedaFinalSelect.value;
    const valor = parseFloat(valorInput.value);

    if (isNaN(valor) || valor <= 0) {
        resultDiv.textContent = "Por favor, insira um valor válido.";
        return;
    }

    const resultado = await converter(moedaInicial, moedaFinal, valor);

    if (resultado !== null) {
        resultDiv.textContent = `${valor} ${moedaInicial} equivale a ${resultado.toFixed(2)} ${moedaFinal}`;
    } else {
        resultDiv.textContent = "Erro ao realizar a conversão. Tente novamente.";
    }
});

// filme

const keyFilmeUrl = "http://www.omdbapi.com/?apikey=819f7368";
const filmes = []; // Array para armazenar os filmes
const btnFilme = document.getElementById("btnFilme");
const filmeSelect = document.getElementById("filmeNome");
const resultDiv2 = document.getElementById("result2");

// Função para buscar os dados do filme pelo título
async function carregaFilme(titulo) {
    try {
        const resposta = await fetch(`${keyFilmeUrl}&t=${encodeURIComponent(titulo)}`);
        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados do filme");
        }
        const dadosFilme = await resposta.json();
        if (dadosFilme.Response === "False") {
            throw new Error("Filme não encontrado");
        }
        return dadosFilme;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Evento do botão para adicionar o filme ao array e exibir os resultados
btnFilme.addEventListener("click", async () => {
    const titulo = filmeSelect.value;

    if (!titulo.trim()) {
        resultDiv2.textContent = "Por favor, insira um título válido.";
        return;
    }

    const dadosFilme = await carregaFilme(titulo);

    if (dadosFilme) {
        // Adiciona o filme ao array
        filmes.push({
            titulo: dadosFilme.Title,
            ano: parseInt(dadosFilme.Year, 10),
            diretor: dadosFilme.Director,
        });

        // Cria a lista usando .map()
        const filmesProcessados = filmes.map(filme => ({
            titulo: filme.titulo,
            ano: filme.ano,
            diretor: filme.diretor,
        }));

        // Filtra os filmes lançados após o ano 2000
        const filmesApos2000 = filmesProcessados.filter(filme => filme.ano > 2000);

        // Renderiza os resultados na tela
        resultDiv2.innerHTML = `
            <h3>Filmes Lançados Após 2000:</h3>
            <ul>
                ${filmesApos2000
                    .map(filme => `<li>${filme.titulo} (${filme.ano}) - Diretor: ${filme.diretor}</li>`)
                    .join("")}
            </ul>
        `;
    } else {
        resultDiv2.textContent = "Filme não encontrado ou ocorreu um erro.";
    }
});


//previsão do tempo
const apiTempoKey = "22075aac5b5592f2911c64019cb287d5";
const btnCidade = document.getElementById("btncidade");
const resultDiv3 = document.getElementById("result3");

// Função assíncrona para buscar os dados do tempo de uma cidade
async function buscarTempo(cidade) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cidade
        )}&units=metric&appid=${apiTempoKey}&lang=pt_br`;
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Cidade não encontrada ou erro na requisição");
        }

        const dados = await resposta.json();
        return {
            nome: dados.name,
            temperatura: dados.main.temp,
            umidade: dados.main.humidity,
            condicao: dados.weather[0].description,
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Função para filtrar condições climáticas extremas
function filtrarCondicoesExtremas(dados) {
    const { temperatura } = dados;
    return temperatura > 35 || temperatura < 5;
}

// Evento do botão para buscar e exibir os dados
btnCidade.addEventListener("click", async () => {
    const cidade = document.getElementById("cidade").value;

    if (!cidade.trim()) {
        resultDiv3.textContent = "Por favor, insira o nome de uma cidade.";
        return;
    }

    const dados = await buscarTempo(cidade);

    if (dados) {
        const condicaoExtrema = filtrarCondicoesExtremas(dados);

        resultDiv3.innerHTML = `
            <h4>Previsão do Tempo para ${dados.nome}</h4>
            <p><strong>Temperatura:</strong> ${dados.temperatura}°C</p>
            <p><strong>Umidade:</strong> ${dados.umidade}%</p>
            <p><strong>Condição:</strong> ${dados.condicao}</p>
            ${
                condicaoExtrema
                    ? `<p style="color: red;"><strong>Atenção!</strong> Condições climáticas extremas!</p>`
                    : ""
            }
        `;
    } else {
        resultDiv3.textContent = "Erro ao buscar os dados. Tente novamente.";
    }
});
