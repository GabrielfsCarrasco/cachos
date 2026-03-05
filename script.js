// Elementos das Telas
const telaEntrada = document.getElementById('tela-entrada');
const telaPlayer = document.getElementById('tela-player');
const btnEntrar = document.getElementById('btn-entrar');

// Elementos do Player
const audio = document.getElementById('musica');
const btnPlay = document.getElementById('btn-play');
const barraProgresso = document.getElementById('barra-progresso');
const tempoAtualEl = document.getElementById('tempo-atual');
const tempoTotalEl = document.getElementById('tempo-total');

// Selecionando a capa para animar
const capaArte = document.getElementById('vinil-giratorio')

const btnAbrirLetras = document.getElementById('btn-abrir-letras');
const btnFecharLetras = document.getElementById('btn-fechar-letras');
const lyricsView = document.getElementById('lyrics-view');
const versos = Array.from(document.querySelectorAll('.verso'));

let isPlaying = false;

// ==========================================
// TRANSIÇÃO DE TELA COM DELAY (HOME -> PLAYER)
// ==========================================
const textoBtn = document.getElementById('texto-btn');

btnEntrar.addEventListener('click', () => {
    // Se o botão já estiver carregando, não faz nada (evita clique duplo)
    if (btnEntrar.classList.contains('carregando')) return;

    // 1. Inicia a animação de carregamento
    btnEntrar.classList.add('carregando');
    
    // 2. Muda o texto pela primeira vez
    textoBtn.textContent = "Aumente o som...";
    
    // 3. Muda o texto novamente após 1.5 segundos
    setTimeout(() => {
        textoBtn.textContent = "Prepare o coração...";
    }, 1500);

    // 4. Executa a transição de tela após 3.2 segundos
    setTimeout(() => {
        // Esconde a home e mostra o player
        telaEntrada.classList.remove('tela-ativa');
        telaEntrada.classList.add('tela-oculta');
        
        telaPlayer.classList.remove('tela-oculta');
        telaPlayer.classList.add('tela-ativa');
        
        // Toca a música e gira o vinil
        audio.play();
        isPlaying = true;
        btnPlay.textContent = '⏸';
        capaArte.classList.add('animacao-girar');

        // (Opcional) Reseta o botão caso ela recarregue a página
        setTimeout(() => {
            btnEntrar.classList.remove('carregando');
            textoBtn.textContent = "Ouvir a Poesia";
        }, 1000);

    }, 3200); // 3200 milissegundos = 3.2 segundos de delay total
});

// ==========================================
// LÓGICA DO PLAYER
// ==========================================

function formatarTempo(segundos) {
    if (isNaN(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

audio.addEventListener('loadedmetadata', () => {
    barraProgresso.max = audio.duration;
    tempoTotalEl.textContent = formatarTempo(audio.duration);
});

btnPlay.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        btnPlay.textContent = '▶';
        // Pausa o vinil
        capaArte.classList.remove('animacao-girar');
    } else {
        audio.play();
        btnPlay.textContent = '⏸';
        // Volta a girar o vinil
        capaArte.classList.add('animacao-girar');
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    const tempoAtual = audio.currentTime;
    
    barraProgresso.value = tempoAtual;
    tempoAtualEl.textContent = formatarTempo(tempoAtual);

    let versoAtivoIndex = -1;
    for (let i = 0; i < versos.length; i++) {
        const tempoVerso = parseFloat(versos[i].getAttribute('data-time'));
        if (tempoAtual >= tempoVerso) {
            versoAtivoIndex = i;
        } else {
            break;
        }
    }

    versos.forEach((verso, index) => {
        if (index === versoAtivoIndex) {
            if (!verso.classList.contains('ativo')) {
                verso.classList.add('ativo');
                if(lyricsView.classList.contains('aberta')) {
                    verso.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else {
            verso.classList.remove('ativo');
        }
    });
});

barraProgresso.addEventListener('input', () => {
    audio.currentTime = barraProgresso.value;
});

btnAbrirLetras.addEventListener('click', () => {
    lyricsView.classList.add('aberta');
    const versoAtivo = document.querySelector('.verso.ativo');
    if(versoAtivo) versoAtivo.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

btnFecharLetras.addEventListener('click', () => {
    lyricsView.classList.remove('aberta');
});

versos.forEach(verso => {
    verso.addEventListener('click', () => {
        const tempo = parseFloat(verso.getAttribute('data-time'));
        audio.currentTime = tempo;
        if(!isPlaying) {
            audio.play();
            btnPlay.textContent = '⏸';
            isPlaying = true;
            // Garante que o vinil volte a girar se você clicar num verso enquanto estiver pausado
            capaArte.classList.add('animacao-girar');
        }
    });
});