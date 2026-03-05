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
const capaArte = document.getElementById('vinil-giratorio');

const btnAbrirLetras = document.getElementById('btn-abrir-letras');
const btnFecharLetras = document.getElementById('btn-fechar-letras');
const lyricsView = document.getElementById('lyrics-view');
const versos = Array.from(document.querySelectorAll('.verso'));

let isPlaying = false;

// Ícones em formato SVG
const iconePlay = '<svg viewBox="0 0 24 24" width="35" height="35" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const iconePause = '<svg viewBox="0 0 24 24" width="35" height="35" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

// ==========================================
// FUNÇÃO PARA PINTAR A BARRINHA
// ==========================================
function atualizarCorBarra() {
    // Calcula a porcentagem de 0 a 100
    const porcentagem = (audio.currentTime / audio.duration) * 100;
    
    // Pinta a barrinha: Dourado até a porcentagem atual, cinza transparente no resto
    barraProgresso.style.background = `linear-gradient(to right, var(--cor-destaque) ${porcentagem}%, rgba(255,255,255,0.1) ${porcentagem}%)`;
}

// ==========================================
// TRANSIÇÃO DE TELA COM DELAY (HOME -> PLAYER)
// ==========================================
const textoBtn = document.getElementById('texto-btn');

btnEntrar.addEventListener('click', () => {
    if (btnEntrar.classList.contains('carregando')) return;

    btnEntrar.classList.add('carregando');
    textoBtn.textContent = "Aumente o som...";
    
    setTimeout(() => {
        textoBtn.textContent = "Prepare o coração...";
    }, 1500);

    setTimeout(() => {
        telaEntrada.classList.remove('tela-ativa');
        telaEntrada.classList.add('tela-oculta');
        
        telaPlayer.classList.remove('tela-oculta');
        telaPlayer.classList.add('tela-ativa');
        
        audio.play();
        isPlaying = true;
        btnPlay.innerHTML = iconePause;
        capaArte.classList.add('animacao-girar');

        setTimeout(() => {
            btnEntrar.classList.remove('carregando');
            textoBtn.textContent = "Ouvir a Poesia";
        }, 1000);

    }, 3200); 
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
        btnPlay.innerHTML = iconePlay; 
        capaArte.classList.remove('animacao-girar');
    } else {
        audio.play();
        btnPlay.innerHTML = iconePause; 
        capaArte.classList.add('animacao-girar');
    }
    isPlaying = !isPlaying;
});

// Acontece o tempo todo enquanto a música toca
audio.addEventListener('timeupdate', () => {
    const tempoAtual = audio.currentTime;
    
    barraProgresso.value = tempoAtual;
    tempoAtualEl.textContent = formatarTempo(tempoAtual);
    
    // Chama a função que pinta a barrinha
    if (!isNaN(audio.duration)) {
        atualizarCorBarra();
    }

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

// Acontece quando você clica ou arrasta a barrinha
barraProgresso.addEventListener('input', () => {
    audio.currentTime = barraProgresso.value;
    atualizarCorBarra(); // Pinta a barrinha na hora que você arrasta
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
            isPlaying = true;
            btnPlay.innerHTML = iconePause; 
            capaArte.classList.add('animacao-girar');
        }
        atualizarCorBarra(); // Pinta a barrinha ao pular pela letra
    });
});