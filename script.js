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

const btnAbrirLetras = document.getElementById('btn-abrir-letras');
const btnFecharLetras = document.getElementById('btn-fechar-letras');
const lyricsView = document.getElementById('lyrics-view');
const versos = Array.from(document.querySelectorAll('.verso'));

let isPlaying = false;

// ==========================================
// TRANSIÇÃO DE TELA (HOME -> PLAYER)
// ==========================================
btnEntrar.addEventListener('click', () => {
    // Esconde a tela de entrada
    telaEntrada.classList.remove('tela-ativa');
    telaEntrada.classList.add('tela-oculta');
    
    // Mostra a tela do player
    telaPlayer.classList.remove('tela-oculta');
    telaPlayer.classList.add('tela-ativa');
    
    // Inicia a música e atualiza o botão
    audio.play();
    isPlaying = true;
    btnPlay.textContent = '⏸';
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
    } else {
        audio.play();
        btnPlay.textContent = '⏸';
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
        }
    });
});