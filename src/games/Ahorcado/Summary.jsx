import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Eliminamos import JSZip from 'jszip'; y lo cargamos dinámicamente
import { saveAs } from 'file-saver';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Tag,
    Smartphone,
    Globe,
    FileText,
    Calendar,
    Monitor,
    Puzzle,
    Grid,
    Layers,
    Shapes,
    Type,
    List,
    Info
} from 'lucide-react';

// Eliminadas las importaciones de CSS externos para evitar errores y confusión.
// Los estilos necesarios están ahora incluidos en este archivo.


// --- ICONO AHORCADO POR DEFECTO (SVG Base64) ---
const DEFAULT_ICON_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDU5OTIiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTAgNThoNDQiLz48cGF0aCBkPSJNMjAgNThWMTBoMzB2MTAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjI4IiByPSI1Ii8+PHBhdGggZD0iTTUwIDMzVjQ4Ii8+PHBhdGggZD0iTTUwIDM4bC04IDgiLz48cGF0aCBkPSJlNTAgMzhsOCA4Ii8+PHBhdGggZD0iTTUwIDQ4bC04IDgiLz48cGF0aCBkPSJlNTAgNDhsOCA4Ii8+PC9zdmc+";

// --- ESTILOS CSS EN LÍNEA PARA EL COMPONENTE REACT ---
const styles = `
    .summary-screen {
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        background: #ffffff;
        color: #1f2937;
    }
    .selection-title {
        text-align: center;
        color: #005f92;
        margin-bottom: 2rem;
        font-size: 2rem;
        font-weight: 700;
    }
    .rules-text {
        text-align: center;
        color: #6b7280;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    .summary-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        margin-top: 2rem;
    }
    .summary-row {
        display: flex;
        flex-direction: row; 
        align-items: center; 
        gap: 0.5rem;
        justify-content: flex-start; /* Asegura que etiqueta y valor estén pegados a la izquierda */
        white-space: nowrap; /* Evita que se rompa la línea entre etiqueta y valor */
    }
    .download-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        margin-top: 3rem;
        padding: 2rem;
        background: #f8fafc;
        border-radius: 1rem;
        border: 1px solid #e2e8f0;
    }
    .btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: #005f92;
        color: white;
        font-size: 1rem;
    }
    .btn-primary:hover:not(:disabled) {
        background: #004a73;
        transform: translateY(-1px);
    }
    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .btn-success {
        background: #005f92;
    }
    .btn-success:hover:not(:disabled) {
        background: #004a73;
    }
    
    /* Grid Helpers */
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
`;

// --- DIBUJOS DEL AHORCADO ---
const hangmanDrawings = [
    `
    +---+
    |   |
        |
        |
        |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
        |
        |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
    |   |
        |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
   /|   |
        |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
   /|\\  |
        |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
   /|\\  |
   /    |
        |
  =========
  `,
    `
    +---+
    |   |
    O   |
   /|\\  |
   / \\  |
        |
  =========
  `
];

// --- CONFIGURACIÓN DE PLANTILLA ANDROID PARA AHORCADO ---
const ANDROID_GAME_CONFIG = {
    baseZipUrl: '/templates/ahorcado/android-base.zip',
    configPath: 'android/app/src/main/assets/public/config/ahorcado-config.json',
    buildConfigData: ({ gameConfig, gameDetails, selectedWords, selectedPlatforms }) => ({
        nivel: gameConfig?.difficulty || 'básico',
        categoria: gameConfig?.category || '',
        nombreApp: gameDetails?.gameName || 'Juego del Ahorcado',
        version: gameDetails?.version || '1.0.0',
        descripcion: gameDetails?.description || '',
        fecha: gameDetails?.date || new Date().toISOString(),
        plataformas: Array.isArray(selectedPlatforms)
            ? selectedPlatforms
            : ['android'],
        palabras: Array.isArray(selectedWords)
            ? selectedWords.map((w) => ({
                word: w.word,
                clue: w.clue,
            }))
            : Array.isArray(gameConfig?.words)
                ? gameConfig.words.map((w) => ({
                    word: w.word,
                    clue: w.clue,
                }))
                : [],
    }),
};

// --- GENERADOR DE CÓDIGO HTML ---
// Se ha modificado para recibir gameDetails y selectedPlatforms
const generateGameCode = (config = {}, iconBase64, gameDetails, selectedPlatforms) => {
    const drawingsJSON = JSON.stringify(hangmanDrawings);
    const maxAttempts = hangmanDrawings.length - 1;
    const faviconHref = iconBase64 || DEFAULT_ICON_BASE64;

    // Formatear datos para el HTML
    const formattedDate = gameDetails.date
        ? new Date(gameDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Fecha no especificada';

    const platformsString = selectedPlatforms && selectedPlatforms.length > 0
        ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
        : 'Web';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Juego del Ahorcado'} - ${config.category || ''}</title>
    <link rel="icon" type="image/png" href="${faviconHref}">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        :root { --primary: #005f92; --secondary: #1f2937; --correct: #22c55e; --wrong: #ef4444; --bg: #f0f2f5; --surface: #ffffff; --accent: #3b82f6; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: #111827; margin: 0; padding: 20px; display: flex; justify-content: center; min-height: 100vh; overflow: hidden; }
        .container { background: var(--surface); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 100%; max-width: 900px; display: flex; flex-direction: column; position: relative; z-index: 1; }
        h1 { text-align: center; color: var(--secondary); margin-bottom: 0.5rem; }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box;}
        .overlay.hidden { opacity: 0; pointer-events: none; display: none; }
        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .btn-exit { background: var(--secondary); }
        .btn-retry { background: var(--primary); }
        .btn-info { background: white; color: var(--primary); border: 2px solid var(--primary); }
        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary); animation: popIn 0.5s ease-out; }
        .score-display { font-size: 2rem; margin: 1rem 0; color: var(--secondary); }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .game-grid { display: grid; grid-template-columns: 1fr 280px; gap: 2rem; }
        .drawing-area { background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; text-align: center; margin-bottom: 1.5rem; }
        pre { font-family: monospace; font-weight: bold; font-size: 1.2rem; color: var(--secondary); margin: 0; line-height: 1.2; }
        .word-letters { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .letter-slot { width: 45px; height: 55px; border-bottom: 4px solid var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; text-transform: uppercase; }
        .keyboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)); gap: 0.5rem; }
        .key-btn { padding: 0.75rem 0; border: 1px solid #e5e7eb; border-radius: 0.375rem; background: white; font-weight: 600; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }
        .key-btn:hover:not(:disabled) { background: var(--primary); color: white; border-color: var(--primary); transform: translateY(-2px); }
        .key-btn:disabled { cursor: not-allowed; opacity: 0.6; }
        .key-btn.correct { background: var(--correct); color: white; border-color: var(--correct); }
        .key-btn.wrong { background: var(--wrong); color: white; border-color: var(--wrong); }
        .stats-card { background: #f8fafc; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; height: fit-content; }
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 1rem; }
        .actions { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .btn { padding: 0.75rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: opacity 0.2s; }
        .btn-hint { background: var(--primary); color: white; }
        .btn-reset { background: var(--secondary); color: white; }
        .end-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 2rem; }
        
        /* Estilos para el Modal de Información */
        .info-modal-content {
            background: white;
            padding: 2.5rem;
            border-radius: 1rem;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            position: relative;
        }
        .info-header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .info-title { font-size: 1.8rem; color: var(--primary); margin: 0; font-weight: 800; }
        .info-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
        .info-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .info-item { background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; font-weight: 600; }
        .info-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
        .info-desc { grid-column: 1 / -1; background: #fff; padding: 0; border: none; }
        .info-desc .info-value { font-size: 1rem; line-height: 1.6; color: #475569; }
        .close-info-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .close-info-btn:hover { color: var(--wrong); }

        @media(max-width: 768px) { .game-grid { grid-template-columns: 1fr; } .info-details-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <!-- PANTALLA DE INICIO -->
    <div id="start-screen" class="overlay">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; text-align: center;">${gameDetails.gameName || 'Ahorcado'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; margin-bottom: 2rem; display: inline-block;">
            Categoría: ${config.category}
        </div>
        <p style="margin-bottom: 2rem; font-size: 1.1rem; color: #666;">
            Tienes <strong>${config.timeLimit} segundos</strong> para adivinar cada palabra.
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <button class="big-btn" onclick="startGameSequence()">▶ Iniciar Juego</button>
            <button class="big-btn btn-info" onclick="toggleInfo(true)">ℹ Información</button>
        </div>
    </div>

    <!-- PANTALLA DE CUENTA REGRESIVA -->
    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>

    <!-- PANTALLA FINAL -->
    <div id="end-screen" class="overlay hidden">
        <h1 id="end-title" style="font-size: 3rem; color: var(--primary);">Juego Terminado</h1>
        <div class="score-display">Puntos Obtenidos: <span id="final-score-display" style="font-weight:bold;">0</span></div>
        <div class="end-buttons">
             <button class="big-btn btn-exit" onclick="exitGame()">Salir</button>
             <button class="big-btn btn-retry" onclick="location.reload()">Volver a Jugar</button>
        </div>
    </div>

    <!-- MODAL DE INFORMACIÓN (NUEVO) -->
    <div id="info-overlay" class="overlay hidden" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 100;">
        <div class="info-modal-content">
            <button class="close-info-btn" onclick="toggleInfo(false)">&times;</button>
            <div class="info-header">
                <h2 class="info-title">${gameDetails.gameName || 'Juego del Ahorcado'}</h2>
                <div class="info-subtitle">Actividad configurada desde la plataforma Steam-G</div>
            </div>
            
            <div class="info-details-grid">
                <div class="info-item">
                    <span class="info-label">Versión</span>
                    <span class="info-value">${gameDetails.version || '1.0.0'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Fecha de Creación</span>
                    <span class="info-value">${formattedDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Plataformas</span>
                    <span class="info-value">${platformsString}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dificultad</span>
                    <span class="info-value" style="text-transform: capitalize;">${config.difficulty}</span>
                </div>
                <div class="info-item info-desc">
                    <span class="info-label">Descripción</span>
                    <p class="info-value">${gameDetails.description || 'Sin descripción disponible para este juego.'}</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 1.5rem;">
                <button class="big-btn" style="font-size: 1rem; padding: 0.75rem 2rem;" onclick="toggleInfo(false)">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- JUEGO PRINCIPAL -->
    <div class="container">
        <h1>Ahorcado: ${config.category.toUpperCase()}</h1>
        <div style="text-align:center; color:#6b7280; margin-bottom:2rem;" id="clue-text">Cargando pista...</div>
        <div class="game-grid">
            <div class="game-main">
                <div class="drawing-area" id="drawing-container"><pre></pre></div>
                <div class="word-letters" id="word-display"></div>
                <div class="keyboard" id="keyboard"></div>
            </div>
            <div class="game-sidebar">
                <div class="stats-card">
                    <h3 style="margin-top:0; color:var(--secondary); border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem;">Tablero</h3>
                    <div class="stat-row"><span>Palabra:</span> <strong id="word-counter">1/${config.words.length}</strong></div>
                    <div class="stat-row"><span>Tiempo:</span> <strong id="timer">${config.timeLimit}s</strong></div>
                    <div class="stat-row"><span>Puntos:</span> <strong id="score">0</strong></div>
                    <div class="actions">
                        <button class="btn btn-hint" id="btn-hint" onclick="useHint()">💡 Revelar Pista</button>
                        <button class="btn btn-reset" onclick="showEndScreen(false)">⏹ Finalizar Juego</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const config = ${JSON.stringify(config)};
        const drawings = ${drawingsJSON};
        const maxWrong = ${maxAttempts};
        let state = { wordIndex: 0, score: 0, wrong: 0, guessed: [], timeLeft: config.timeLimit, hintUsed: false, timer: null, gameActive: false };
        
        function toggleInfo(show) {
            const modal = document.getElementById('info-overlay');
            if(show) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex'; // Forzar flex para centrado
            } else {
                modal.classList.add('hidden');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        }

        function exitGame() {
            window.close();
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;background:#1f2937;color:white;font-family:sans-serif;"><h1>Juego Finalizado</h1><p>Gracias por jugar. Ya puedes cerrar esta pestaña.</p></div>';
        }
        function startGameSequence() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 5;
            const countDisplay = document.getElementById('countdown-display');
            countDisplay.innerText = count;
            const countInterval = setInterval(() => {
                count--;
                if(count > 0) {
                    countDisplay.innerText = count;
                    countDisplay.style.animation = 'none';
                    countDisplay.offsetHeight;
                    countDisplay.style.animation = 'popIn 0.5s ease-out';
                } else {
                    clearInterval(countInterval);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    init();
                }
            }, 1000);
        }
        function init() {
            if (state.wordIndex >= config.words.length) return showEndScreen(true);
            state.wrong = 0; state.guessed = []; state.timeLeft = config.timeLimit; state.hintUsed = false; state.gameActive = true;
            document.getElementById('btn-hint').disabled = false; document.getElementById('btn-hint').innerText = '💡 Revelar Pista';
            renderUI(); renderKeyboard(); startTimer();
        }
        function startTimer() {
            if (state.timer) clearInterval(state.timer);
            state.timer = setInterval(() => {
                if(!state.gameActive) return;
                state.timeLeft--; document.getElementById('timer').innerText = state.timeLeft + 's';
                if (state.timeLeft <= 0) handleGameOver(false, '¡Tiempo agotado!');
            }, 1000);
        }
        function renderUI() {
            const current = config.words[state.wordIndex];
            document.getElementById('clue-text').innerHTML = '<strong>Pista:</strong> ' + current.clue;
            document.getElementById('word-counter').innerText = (state.wordIndex + 1) + '/' + config.words.length;
            document.getElementById('score').innerText = state.score;
            document.getElementById('drawing-container').innerHTML = '<pre>' + drawings[state.wrong] + '</pre>';
            const wordContainer = document.getElementById('word-display'); wordContainer.innerHTML = '';
            current.word.toUpperCase().split('').forEach(char => {
                const slot = document.createElement('div'); slot.className = 'letter-slot';
                slot.innerText = state.guessed.includes(char.toLowerCase()) ? char : ''; wordContainer.appendChild(slot);
            });
        }
        function renderKeyboard() {
            const kb = document.getElementById('keyboard'); kb.innerHTML = '';
            'abcdefghijklmnopqrstuvwxyzñáéíóú'.split('').forEach(char => {
                const btn = document.createElement('button'); btn.className = 'key-btn'; btn.innerText = char; btn.onclick = () => guess(char);
                if (state.guessed.includes(char)) {
                    btn.disabled = true;
                    btn.classList.add(config.words[state.wordIndex].word.toLowerCase().includes(char) ? 'correct' : 'wrong');
                }
                kb.appendChild(btn);
            });
        }
        function guess(char) {
            if (!state.gameActive || state.guessed.includes(char)) return;
            state.guessed.push(char);
            if (!config.words[state.wordIndex].word.toLowerCase().includes(char)) state.wrong++;
            renderUI(); renderKeyboard(); checkWinCondition();
        }
        function useHint() {
            if (state.hintUsed || !state.gameActive) return;
            const current = config.words[state.wordIndex].word.toLowerCase();
            const available = current.split('').filter(c => !state.guessed.includes(c));
            if (available.length > 1) {
                const random = available[Math.floor(Math.random() * available.length)];
                state.hintUsed = true; state.wrong++; 
                document.getElementById('btn-hint').disabled = true; document.getElementById('btn-hint').innerText = 'Pista Usada';
                Swal.fire({toast: true, position: 'top-end', icon: 'info', title: 'Pista: ' + random.toUpperCase(), showConfirmButton: false, timer: 1500});
                guess(random);
            }
        }
        function checkWinCondition() {
            const current = config.words[state.wordIndex].word.toLowerCase();
            if (current.split('').every(c => state.guessed.includes(c))) {
                clearInterval(state.timer); state.gameActive = false; state.score += 10;
                Swal.fire({title: '¡Correcto!', icon: 'success', timer: 1500, showConfirmButton: false}).then(() => { state.wordIndex++; init(); });
            } else if (state.wrong >= maxWrong) handleGameOver(false, 'La palabra era: ' + current.toUpperCase());
        }
        function handleGameOver(success, msg) {
            clearInterval(state.timer); state.gameActive = false;
            Swal.fire({title: 'Perdiste', text: msg, icon: 'error', confirmButtonText: 'Continuar'}).then(() => { state.wordIndex++; init(); });
        }
        function showEndScreen(completed) {
            clearInterval(state.timer);
            state.gameActive = false;
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('final-score-display').innerText = state.score;
            document.getElementById('end-title').innerText = completed ? "¡Juego Completado!" : "Fin del Juego";
        }
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY (PRINCIPAL) ---
const Summary = ({ config = {}, onBack }) => {
    // Estados para controlar la descarga de Web (HTML)
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    // Estado para verificar si JSZip está listo
    const [jsZipReady, setJsZipReady] = useState(false);

    // Estados para controlar la descarga de Android
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(-1));
    const state = location.state || null;

    // --- DATOS DE RESPALDO PARA PREVIEW ---
    const MOCK_DATA = {
        selectedAreas: ['science', 'math'],
        selectedSkills: ['Resolución de problemas', 'Creatividad'],
        gameDetails: {
            gameName: "Juego de Prueba (Preview)",
            description: "Esta es una descripción de prueba para el preview.",
            version: "1.0.0",
            date: new Date().toISOString()
        },
        selectedPlatforms: ['web', 'mobile']
    };

    // Si vienes desde un juego/flujo real, usamos SOLO lo que venga en state.
    // Si abres el Summary directo (sin state), usamos MOCK_DATA para que el preview no se vea vacío.
    const data = state ?? MOCK_DATA;

    // Config del juego: usamos state.gameConfig o el prop config
    const gameConfig = state?.gameConfig || config || {};

    // El ZIP solo tiene sentido si hay palabras.
    const canGenerateZip = Array.isArray(gameConfig.words) && gameConfig.words.length > 0;

    const {
        selectedAreas = [],
        selectedSkills = [],
        gameDetails = {},
        selectedPlatforms = []
    } = data;
    // Efecto para cargar JSZip dinámicamente
    useEffect(() => {
        if (window.JSZip) {
            setJsZipReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.async = true;
        script.onload = () => {
            console.log("JSZip cargado correctamente");
            setJsZipReady(true);
        };
        script.onerror = () => {
            console.error("Error cargando JSZip");
            setStatusText("Error cargando librería ZIP");
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, []);

    // Función modificada para manejar la descarga en pantalla (sin modal)
    const handleDownloadZip = () => {
        if (!canGenerateZip) {
            alert("Primero configura una categoría y agrega al menos 1 palabra antes de descargar el paquete.");
            return;
        }
        if (isGenerating || !jsZipReady) return;

        setIsGenerating(true);
        setProgress(0);
        setStatusText("Iniciando...");

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 2;

            if (currentProgress >= 90) {
                clearInterval(interval);
                setStatusText("Procesando recursos...");
                generateAndDownloadZip();
            } else {
                if (currentProgress > 20 && currentProgress < 50) setStatusText("Generando código HTML...");
                if (currentProgress >= 50 && currentProgress < 80) setStatusText("Incrustando imágenes...");
                setProgress(currentProgress);
            }
        }, 200);
    };

    const generateAndDownloadZip = async () => {
        if (!window.JSZip) {
            alert("La librería ZIP aún no está lista. Por favor intente de nuevo en unos segundos.");
            setIsGenerating(false);
            return;
        }

        try {
            const zip = new window.JSZip();
            setStatusText("Convirtiendo icono...");
            const iconBase64 = DEFAULT_ICON_BASE64;

            setStatusText("Finalizando HTML...");
            // Pasamos gameDetails y selectedPlatforms a la función generadora
            const hangmanCfg = {
                ...gameConfig,
                // Aseguramos tipos seguros para la plantilla generada
                category: (gameConfig?.category || '').toString(),
                difficulty: (gameConfig?.difficulty || '').toString(),
                timeLimit: Number(gameConfig?.timeLimit || 0),
                words: Array.isArray(gameConfig?.words) ? gameConfig.words : []
            };
            const htmlContent = generateGameCode(hangmanCfg, iconBase64, gameDetails, selectedPlatforms);
            zip.file("index.html", htmlContent);

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            const categorySlug = (hangmanCfg.category || 'sin-categoria')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-');
            link.download = `juego-ahorcado-${categorySlug}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setProgress(100);
            setStatusText("¡Descarga iniciada!");
            setTimeout(() => {
                setIsGenerating(false);
                setProgress(0);
            }, 2000);

        } catch (error) {
            console.error("Error generando el ZIP:", error);
            setStatusText("Error al generar el archivo.");
            setIsGenerating(false);
        }
    };

    // --- FUNCIÓN PARA GENERAR ANDROID ZIP CON CONFIGURACIÓN ---
    const generarAndroidZipConConfig = async () => {
        try {
            if (!window.JSZip) {
                throw new Error('La librería JSZip aún no está cargada. Por favor, intenta de nuevo en unos segundos.');
            }

            setErrorMsg('');
            setIsGeneratingAndroid(true);

            const { baseZipUrl, configPath, buildConfigData } = ANDROID_GAME_CONFIG;

            // Descargar la plantilla base desde /public
            const res = await fetch(baseZipUrl);
            if (!res.ok) {
                throw new Error(
                    `No se pudo descargar la plantilla base (${baseZipUrl}). HTTP ${res.status}. ` +
                    `Verifica que el archivo exista dentro de /public.`
                );
            }

            const arrayBuffer = await res.arrayBuffer();
            const baseZip = await window.JSZip.loadAsync(arrayBuffer);

            // Construir el JSON de configuración
            const configData = buildConfigData({
                gameConfig,
                gameDetails,
                selectedWords: gameConfig?.words || [],
                selectedPlatforms
            });

            // Insertar el JSON en la ruta correcta dentro del ZIP
            baseZip.file(configPath, JSON.stringify(configData, null, 2));

            // Generar el ZIP final
            const finalBlob = await baseZip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });

            // Generar nombre del archivo
            const nombreArchivo = `android-ahorcado-${configData.nivel || 'juego'}.zip`
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            // Descargar usando file-saver
            saveAs(finalBlob, nombreArchivo);

        } catch (err) {
            console.error('Error generando Android ZIP:', err);
            setErrorMsg(err.message || 'Ocurrió un error al generar el archivo android.zip.');
        } finally {
            setIsGeneratingAndroid(false);
        }
    };

    // --- Funciones de Ayuda ---
    const getAreaName = (areaId) => {
        const areas = { science: 'Ciencia', technology: 'Tecnología', engineering: 'Ingeniería', arts: 'Arte', math: 'Matemáticas' };
        return areas[areaId] || areaId;
    };

    const getAreaIcon = (areaId) => {
        const icons = {
            science: '/images/areas/Ciencia.png',
            technology: '/images/areas/Tecnologia.png',
            engineering: '/images/areas/Ingenieria.png',
            arts: '/images/areas/Artes.png',
            math: '/images/areas/Matematicas.png'
        };
        return icons[areaId] || 'https://placehold.co/32x32/eee/aaa?text=?';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        try {
            const date = new Date(dateString);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) { return "Fecha inválida"; }
    };

    return (
        <div className="summary-screen">
            <style>{styles}</style>

            <h2 style={{ color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle size={32} color="#22c55e" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu juego ha sido configurado correctamente. Revisa los detalles y descárgalo.</p>

            <h1 className="selection-title" style={{ textAlign: 'center', color: '#0077b6', marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>
                Resumen de la Configuración
            </h1>

            <div className="summary-details" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-card-header"><Tag size={16} /> Nombre del Juego</div>
                        <div className="info-card-value">{gameDetails.gameName || 'No disponible'}</div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Layers size={16} /> Versión</div>
                        <div className="info-card-value">{gameDetails.version || '1.0.0'}</div>
                    </div>

                    <div className="info-card full-width">
                        <div className="info-card-header"><FileText size={16} /> Descripción</div>
                        <div className="info-card-value" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                            {gameDetails.description || 'Sin descripción.'}
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Calendar size={16} /> Fecha de Creación</div>
                        <div className="info-card-value">{formatDate(gameDetails.date)}</div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Monitor size={16} /> Plataformas</div>
                        <div className="info-card-value">
                            {selectedPlatforms?.length > 0
                                ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
                                : 'No seleccionadas'}
                        </div>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="info-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                            <Shapes size={20} color="#3b82f6" /> Áreas Seleccionadas
                        </h4>
                        {selectedAreas?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {selectedAreas.map(areaId => (
                                    <span key={areaId} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 0.75rem', background: '#eff6ff',
                                        borderRadius: '0.5rem', fontSize: '0.95rem', color: '#1e40af'
                                    }}>
                                        <img
                                            src={getAreaIcon(areaId)}
                                            alt=""
                                            style={{ width: '20px', height: '20px' }}
                                            onError={(e) => { e.target.src = 'https://placehold.co/20x20/eee/aaa?text=?'; }}
                                        />
                                        {getAreaName(areaId)}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No hay áreas seleccionadas.</p>
                        )}
                    </div>

                    <div className="info-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                            <Puzzle size={20} color="#8b5cf6" /> Habilidades Seleccionadas
                        </h4>
                        {selectedSkills?.length > 0 ? (
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155', textAlign: 'left' }}>
                                {selectedSkills.map(skill => (
                                    <li key={skill} style={{ marginBottom: '0.4rem' }}>{skill}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No hay habilidades seleccionadas.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="summary-card" style={{ marginTop: '2.5rem' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#0077b6' }}>
                    Parámetros del Juego
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', rowGap: '1rem', alignItems: 'center' }}>
                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Grid size={18} /> Categoría:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {(gameConfig.category || '').charAt(0).toUpperCase() + (gameConfig.category || '').slice(1).toLowerCase()}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Type size={18} /> Dificultad:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {(gameConfig.difficulty || '').charAt(0).toUpperCase() + (gameConfig.difficulty || '').slice(1).toLowerCase()}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Clock size={18} /> Tiempo Límite:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {gameConfig.timeLimit} segundos
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <List size={18} /> Total Palabras:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {gameConfig.words?.length ?? 0}
                        </strong>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <strong style={{ display: 'block', marginBottom: '0.75rem', color: '#334155' }}>Palabras incluidas en el paquete:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(gameConfig.words || []).map(w => (
                            <span key={w.word} style={{
                                background: 'white', padding: '6px 12px',
                                borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#475569'
                            }}>
                                {w.word}
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- NUEVO: Botón "Volver a Editar" movido AQUÍ --- */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={handleBack} disabled={isGenerating} style={{ opacity: isGenerating ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            {/* Sección de Descargas */}
            <div className="download-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>

                <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
                    <h3 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>Descargar Paquetes del Juego</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                        Genera los archivos .zip listos para ser descargados en su computadora.
                    </p>

                    {/* Barra de Progreso para Web (HTML) */}
                    {isGenerating && (
                        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>
                                <span>{statusText}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="progress-container1" style={{
                                width: '100%',
                                height: '14px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '7px',
                                overflow: 'hidden',
                                marginTop: '0.5rem',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <div
                                    className="progreso-barra"
                                    style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        backgroundColor: '#005f92',
                                        transition: 'width 0.3s ease-out',
                                        borderRadius: '7px'
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Indicador de generación Android */}
                    {isGeneratingAndroid && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                            <p style={{ color: '#1e40af', margin: 0, fontWeight: '500' }}>
                                ⏳ Generando paquete Android... La descarga iniciará automáticamente.
                            </p>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {errorMsg && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fecaca' }} role="alert">
                            <p style={{ color: '#991b1b', margin: 0, fontWeight: '500' }}>
                                ❌ Error: {errorMsg}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Botón para Web (HTML) */}
                    {canGenerateZip && (
                        <button
                            className="btn-primary btn-success"
                            onClick={handleDownloadZip}
                            disabled={isGenerating || !jsZipReady || isGeneratingAndroid}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 14px 0 rgba(40, 165, 238, 0.39)',
                                minWidth: '200px', justifyContent: 'center',
                                cursor: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 'not-allowed' : 'pointer',
                                opacity: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 0.6 : 1
                            }}
                        >
                            {isGenerating ? (
                                <>Generando Web...</>
                            ) : !jsZipReady ? (
                                <>Cargando librería...</>
                            ) : (
                                <><Globe size={18} /> Web (HTML)</>
                            )}
                        </button>
                    )}

                    {/* Botón para Android */}
                    <button
                        className="btn-primary"
                        onClick={generarAndroidZipConConfig}
                        disabled={isGeneratingAndroid || !jsZipReady || isGenerating}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(40, 165, 238, 0.39)',
                            minWidth: '200px', justifyContent: 'center',
                            cursor: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 'not-allowed' : 'pointer',
                            opacity: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 0.6 : 1,
                            background: '#3ddc84'
                        }}
                    >
                        {isGeneratingAndroid ? (
                            <>Generando Android...</>
                        ) : !jsZipReady ? (
                            <>Cargando librería...</>
                        ) : (
                            <><Smartphone size={18} /> Android (APK)</>
                        )}
                    </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '600px', margin: '0.5rem 0 0 0', textAlign: 'center' }}>
                    <strong>Web:</strong> Archivo HTML listo para abrir en navegador.
                    {' '}<strong>Android:</strong> Proyecto React Native listo para compilar en Android Studio.
                </p>
            </div>
        </div>
    );
};

export default Summary;