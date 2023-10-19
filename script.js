const formQuantidadeTimes = document.getElementById('formQuantidadeTimes');
const formNomes = document.getElementById('formNomes');
const resultadosTorneio = document.getElementById('resultadosTorneio');
const historicoPartidasSection = document.getElementById('historicoPartidas');
const tabela = document.getElementById('tabela');
const vencedorDiv = document.getElementById('vencedor');
const participantes_max = 20;
const historicoPartidas = [];
const botaoSalvarHistorico = document.getElementById('botaoSalvarHistorico');
const botaoCarregarHistorico = document.getElementById('botaoCarregarHistorico');

  botaoSalvarHistorico.addEventListener('click', salvarHistoricoPartidas);
  botaoCarregarHistorico.addEventListener('click', carregarHistoricoPartidas);

  function salvarHistoricoPartidas() {
    localStorage.setItem('historicoPartidas', JSON.stringify(historicoPartidas));
    alert('Histórico salvo com sucesso!');
  }

  function carregarHistoricoPartidas() {
    const historicoPartidasSalvo = localStorage.getItem('historicoPartidas');
    if (historicoPartidasSalvo) {
      historicoPartidas.length = 0; // Limpa o histórico de partidas atual
      historicoPartidas.push(...JSON.parse(historicoPartidasSalvo));
      alert('Histórico carregado com sucesso!');
      exibirHistoricoPartidas(); // Exibe o histórico de partidas carregado
    } else {
      alert('Nenhum histórico encontrado.');
    }
  }

  const botaoExibirHistorico = document.getElementById('botaoExibirHistorico');

  botaoExibirHistorico.addEventListener('click', function() {
    if (historicoPartidasSection.classList.contains('hidden')) {
      historicoPartidasSection.classList.remove('hidden');
      botaoExibirHistorico.textContent = 'Ocultar Histórico';
    } else {
      historicoPartidasSection.classList.add('hidden');
      botaoExibirHistorico.textContent = 'Exibir Histórico';
    }
  });

  formQuantidadeTimes.addEventListener('submit', function(event) {
    event.preventDefault();
    const quantidadeTimes = parseInt(document.getElementById('quantidadeTimes').value);

    if (quantidadeTimes > 0 && quantidadeTimes <= participantes_max) {
      // Mostra o formulário de nomes e esconde o formulário de quantidade de times
      formQuantidadeTimes.classList.add('hidden');
      formNomes.classList.remove('hidden');

      // Cria campos de entrada para os nomes dos times
      const inputNomes = document.getElementById('inputNomes');
      inputNomes.innerHTML = '';
      for (let i = 1; i <= quantidadeTimes; i++) {
        const label = document.createElement('label');
        label.textContent = `Nome do time ${i}: `;
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);
        input.setAttribute('name', `time${i}`);
        inputNomes.appendChild(label);
        inputNomes.appendChild(input);
        inputNomes.appendChild(document.createElement('br'));
      }
    } else {
      if (quantidadeTimes <= 0) {
        alert('Por favor, insira um número válido de times.');
      } else {
        alert(`O número máximo de times participantes é ${participantes_max}.`);
      }
    }
  });

  formNomes.addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtém os nomes dos times
    const nomesTimes = [];
    const inputs = formNomes.querySelectorAll('input');
    inputs.forEach(input => {
      nomesTimes.push(input.value);
    });

    // Esconde o formulário de nomes e mostra os resultados do torneio
    formNomes.classList.add('hidden');
    resultadosTorneio.classList.remove('hidden');

    simularTorneio(nomesTimes);
    exibirHistoricoPartidas();
  });

  function simularTorneio(times) {
    const numTimes = times.length;

    // Cria uma matriz para armazenar os resultados de cada jogo e inicializa os pontos
    const resultados = [];
    const pontos = {};

    for (let i = 0; i < numTimes; i++) {
      resultados[i] = [];
      for (let j = 0; j < numTimes; j++) {
        if (i === j) {
          resultados[i][j] = '-';
        } else {
          if (!resultados[j] || resultados[j][i] === undefined) {
            resultados[i][j] = Math.random() < 0.33 ? 'D' : Math.random() < 0.66 ? 'E' : 'V';

            if (resultados[i][j] === 'V') {
              pontos[times[i]] = (pontos[times[i]] || 0) + 3;
            } else if (resultados[i][j] === 'E') {
              pontos[times[i]] = (pontos[times[i]] || 0) + 1;
              pontos[times[j]] = (pontos[times[j]] || 0) + 1;
            } else if (resultados[i][j] === 'D') {
              pontos[times[j]] = (pontos[times[j]] || 0) + 3;
            }

            // Adiciona a partida ao histórico de partidas
            historicoPartidas.push({
              time1: times[i],
              time2: times[j],
              resultado: resultados[i][j],
            });
            
          } else {
            resultados[i][j] = resultados[j][i] === 'V' ? 'D' : 'V';
          }
        }
      }
    }

    exibirResultados(times, resultados, pontos);
  }

  function exibirResultados(times, resultados, pontos) {
    const numTimes = times.length;

    times.sort((a, b) => (pontos[b] || 0) - (pontos[a] || 0));

    const vencedor = times[0];
    vencedorDiv.textContent = `O vencedor do torneio é: ${vencedor} com ${pontos[vencedor] || 0} pontos`;

    const linhaCabecalho = tabela.insertRow();
    linhaCabecalho.insertCell().textContent = 'Times';
    linhaCabecalho.insertCell().textContent = 'Pontos';

    for (let i = 0; i < numTimes; i++) {
      const linha = tabela.insertRow();
      const nomeTime = times[i];
      linha.insertCell().textContent = nomeTime;
      linha.insertCell().textContent = pontos[nomeTime] || 0;
    }
  }

  function exibirHistoricoPartidas() {
    const tabelaHistoricoPartidas = document.createElement('table');

    historicoPartidas.forEach((partida, index) => {
      const linha = tabelaHistoricoPartidas.insertRow();
      const celulaNumeroPartida = linha.insertCell();
      celulaNumeroPartida.textContent = `Partida ${index + 1}`;
      const celulaTimes = linha.insertCell();
      celulaTimes.textContent = `${partida.time1} vs ${partida.time2}`;
      const celulaResultado = linha.insertCell();
      celulaResultado.textContent = `${partida.resultado} (${obterVencedor(partida)})`;
    });

    historicoPartidasSection.appendChild(tabelaHistoricoPartidas);
  }

  function obterVencedor(partida) {
    if (partida.resultado === 'V') {
      return `Vencedor: ${partida.time1}`;
    } else if (partida.resultado === 'D') {
      return `Vencedor: ${partida.time2}`;
    } else {
      return 'Empate';
    }
  }