const PULAR_INTRODUCAO = false; 

// ==========================================
// ELEMENTOS DA INTERFACE E ÁUDIOS
// ==========================================
const telaZero = document.getElementById('tela-zero');
const telaEntrada = document.getElementById('tela-entrada');
const telaPlayer = document.getElementById('tela-player');
const btnAbrirCarta = document.getElementById('btn-abrir-carta');
const btnEntrar = document.getElementById('btn-entrar');
const textoBtn = document.getElementById('texto-btn');

const audioFundo = document.getElementById('musica-fundo');
const audioDigitacao = document.getElementById('som-digitacao');
const audio = document.getElementById('musica');
const modalFinal = document.getElementById('modal-final');

const btnPlay = document.getElementById('btn-play');
const barraProgresso = document.getElementById('barra-progresso');
const tempoAtualEl = document.getElementById('tempo-atual');
const tempoTotalEl = document.getElementById('tempo-total');
const capaArte = document.getElementById('vinil-giratorio');

const btnAbrirLetras = document.getElementById('btn-abrir-letras');
const btnFecharLetras = document.getElementById('btn-fechar-letras');
const lyricsView = document.getElementById('lyrics-view');
const versos = Array.from(document.querySelectorAll('.verso'));

let isPlaying = false;
let fraseAtual = 0;
let isDragging = false; // A trava de segurança da barrinha de progresso

const iconePlay = '<svg viewBox="0 0 24 24" width="35" height="35" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const iconePause = '<svg viewBox="0 0 24 24" width="35" height="35" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

// ==========================================
// 1. ATIVAR PULO DA INTRODUÇÃO (SE FOR TRUE)
// ==========================================
window.addEventListener('load', () => {
    if (PULAR_INTRODUCAO) {
        telaZero.style.display = 'none';
        telaEntrada.classList.replace('tela-ativa', 'tela-oculta');
        telaPlayer.classList.replace('tela-oculta', 'tela-ativa');
    }
});

// ==========================================
// 2. CLIQUE NO ENVELOPE (TELA ZERO)
// ==========================================
btnAbrirCarta.addEventListener('click', () => {
    document.querySelector('.wrapper-carta').style.opacity = '0';
    btnAbrirCarta.style.opacity = '0';
    
    // Toca o instrumental
    if (audioFundo) { 
        audioFundo.volume = 0.4; 
        audioFundo.play(); 
    }
    
    // Prepara o som de digitação para o navegador não bloquear depois
    if (audioDigitacao) { 
        audioDigitacao.volume = 0.2; 
        audioDigitacao.play().then(() => audioDigitacao.pause()).catch(e => {}); 
    }
    
    telaZero.style.opacity = 0;
    setTimeout(() => {
        telaZero.style.display = 'none'; 
        setTimeout(contarHistoria, 500); // Chama a história!
    }, 1500);
});

// ==========================================
// 3. FADE OUT DO INSTRUMENTAL
// ==========================================
function fadeOutAudio(audioElement, duracaoFade) {
    if (!audioElement || audioElement.paused) return;
    const passos = 50;
    const tempoIntervalo = duracaoFade / passos;
    const reducaoVolume = audioElement.volume / passos;
    const intervaloFade = setInterval(() => {
        if (audioElement.volume > reducaoVolume) { 
            audioElement.volume -= reducaoVolume; 
        } else { 
            audioElement.volume = 0; 
            audioElement.pause(); 
            clearInterval(intervaloFade); 
        }
    }, tempoIntervalo);
}

// ==========================================
// 4. LÓGICA DA HISTÓRIA
// ==========================================
const textoHistoria = document.getElementById('texto-historia');
const areaBotao = document.getElementById('area-botao');

function contarHistoria() {
    // Requer o arquivo historia.js carregado no HTML com a array frasesDaHistoria
    if (fraseAtual < frasesDaHistoria.length) {
        
        // Na penúltima frase, abaixa a música de fundo
        if (fraseAtual === frasesDaHistoria.length - 2) fadeOutAudio(audioFundo, 9000); 
        
        textoHistoria.style.opacity = 0;
        setTimeout(() => {
            textoHistoria.textContent = frasesDaHistoria[fraseAtual];
            textoHistoria.style.opacity = 1;
            fraseAtual++;
            setTimeout(contarHistoria, 3500);
        }, 1500);
    } else {
        textoHistoria.style.opacity = 0;
        setTimeout(() => {
            textoHistoria.style.display = 'none';
            areaBotao.classList.remove('oculto');
            iniciarEscritaFinal();
        }, 1500);
    }
}

// ==========================================
// 5. MÁQUINA DE ESCREVER COM SOM
// ==========================================
function digitarTexto(elemento, texto, velocidade, callback) {
    let i = 0; 
    elemento.innerHTML = '';
    
    if (audioDigitacao) { 
        audioDigitacao.currentTime = 0; 
        audioDigitacao.play().catch(e => {}); 
    }
    
    function proximaLetra() {
        if (i < texto.length) {
            elemento.innerHTML += texto.charAt(i); 
            i++;
            setTimeout(proximaLetra, velocidade);
        } else {
            if (audioDigitacao) audioDigitacao.pause();
            if (callback) setTimeout(callback, 400); 
        }
    }
    proximaLetra();
}

function iniciarEscritaFinal() {
    digitarTexto(document.getElementById('digita-subtitulo'), "Para a dona dos...", 120, () => {
        digitarTexto(document.getElementById('digita-titulo'), "Cachos", 350, () => {
            document.getElementById('digita-titulo').classList.add('animacao-brilho');
            digitarTexto(document.getElementById('digita-descricao'), "Uma poesia transformada em melodia.", 80, () => {
                const btnNovo = document.getElementById('btn-entrar');
                btnNovo.classList.remove('oculto');
                btnNovo.classList.add('revelar-suave');
            });
        });
    });
}

// ==========================================
// 6. TRANSIÇÃO PARA O PLAYER DE MÚSICA
// ==========================================
btnEntrar.addEventListener('click', () => {
    if (btnEntrar.classList.contains('carregando')) return;
    btnEntrar.classList.add('carregando');
    if (textoBtn) textoBtn.textContent = "Aumente o som...";
    
    setTimeout(() => { if (textoBtn) textoBtn.textContent = "Prepare o coração..."; }, 1500);

    setTimeout(() => {
        // Trava de segurança para calar o fundo de vez
        if (audioFundo) { audioFundo.pause(); audioFundo.currentTime = 0; }
        
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
            if (textoBtn) textoBtn.textContent = "Ouvir a Poesia";
        }, 1000);
    }, 3200); 
});

// ==========================================
// 7. LÓGICA DO PLAYER, BARRINHA E LETRAS
// ==========================================
function formatarTempo(segundos) {
    if (isNaN(segundos) || segundos === Infinity) return "0:00";
    const min = Math.floor(segundos / 60); 
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

function atualizarCorBarra() {
    const tempoAtual = isDragging ? barraProgresso.value : audio.currentTime;
    let porcentagem = 0;
    if (audio.duration) {
        porcentagem = (tempoAtual / audio.duration) * 100;
    }
    barraProgresso.style.background = `linear-gradient(to right, var(--cor-destaque) ${porcentagem}%, rgba(255,255,255,0.1) ${porcentagem}%)`;
}

function inicializarPlayer() {
    if (audio.duration && !isNaN(audio.duration)) {
        barraProgresso.max = audio.duration; 
        tempoTotalEl.textContent = formatarTempo(audio.duration);
    }
}

// Escuta quando a música carrega...
audio.addEventListener('loadedmetadata', inicializarPlayer);
// ...mas força se já estiver no cache do navegador!
if (audio.readyState >= 1) {
    inicializarPlayer();
}

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

// A música tocando atualiza a barra
audio.addEventListener('timeupdate', () => {
    if (!isDragging) {
        barraProgresso.value = audio.currentTime; 
        tempoAtualEl.textContent = formatarTempo(audio.currentTime);
        atualizarCorBarra();
    }

    // Lógica das Letras subindo
    let versoAtivoIndex = -1;
    for (let i = 0; i < versos.length; i++) {
        if (audio.currentTime >= parseFloat(versos[i].getAttribute('data-time'))) {
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

// ==========================================
// 8. FÍSICA DE ARRASTAR A BARRINHA (Touch e Mouse)
// ==========================================
barraProgresso.addEventListener('mousedown', () => isDragging = true);
barraProgresso.addEventListener('touchstart', () => isDragging = true, {passive: true});

barraProgresso.addEventListener('input', () => {
    atualizarCorBarra(); 
    tempoAtualEl.textContent = formatarTempo(barraProgresso.value);
});

barraProgresso.addEventListener('mouseup', () => {
    isDragging = false;
    audio.currentTime = barraProgresso.value;
});
barraProgresso.addEventListener('touchend', () => {
    isDragging = false;
    audio.currentTime = barraProgresso.value;
});

// ==========================================
// 9. EVENTOS DE LETRAS E FIM DA MÚSICA
// ==========================================
btnAbrirLetras.addEventListener('click', () => { 
    lyricsView.classList.add('aberta'); 
    const versoAtivo = document.querySelector('.verso.ativo'); 
    if(versoAtivo) versoAtivo.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
});
btnFecharLetras.addEventListener('click', () => { lyricsView.classList.remove('aberta'); });

// Clicar em um verso específico pula a música para lá
versos.forEach(verso => {
    verso.addEventListener('click', () => {
        audio.currentTime = parseFloat(verso.getAttribute('data-time'));
        if(!isPlaying) { 
            audio.play(); 
            isPlaying = true; 
            btnPlay.innerHTML = iconePause; 
            capaArte.classList.add('animacao-girar'); 
        }
        atualizarCorBarra(); 
    });
});

// Quando a música acaba, abre o modal
audio.addEventListener('ended', () => {
    capaArte.classList.remove('animacao-girar');
    isPlaying = false;
    btnPlay.innerHTML = iconePlay;
    
    setTimeout(() => { 
        modalFinal.classList.add('ativo'); 
    }, 1000);
});

function fecharModal() { 
    modalFinal.classList.remove('ativo'); 
}