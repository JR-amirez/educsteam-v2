import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    HelpCircle, RotateCcw, Timer, Trophy, Star, CheckCircle,
    Download, ArrowLeft, Tag, Layers, FileText, Calendar, Monitor, 
    Shapes, Puzzle, Type, Clock, List, Upload, Image as ImageIcon, Trash2,
    Play
} from 'lucide-react';

// --- ESTILOS GLOBALES ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700&family=Fredoka+One&display=swap');

        :root {
            --primary-blue: #0077b6;
            --dark-blue: #023e8a;
            --light-blue: #e0f7fa;
            --pure-white: #ffffff;
            --soft-white: #f8f9fa;
            --dark-gray: #212529;
            --success-green: #2a9d8f;
            --danger-red: #e63946;
            --gray-secondary: #6c757d;
            --shadow-card: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
        }

        body { font-family: 'Nunito', sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; }
        .main-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        
        /* Tarjetas y Contenedores */
        .card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-card); }
        .level-select-container { width: 100%; max-width: 64rem; background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; min-height: 80vh; }
        
        /* Botones de Navegación Inferior */
        .nav-action-btn {
            padding: 0.8rem 1.5rem;
            background-color: var(--primary-blue);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            min-width: 140px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .nav-action-btn:disabled {
            background-color: var(--gray-secondary) !important;
            cursor: not-allowed;
            opacity: 0.7;
            box-shadow: none;
        }
        .nav-action-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        /* Título Animado */
        .game-title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 3.5em;
          font-weight: 700;
          font-family: 'Fredoka One', cursive;
        }
        .game-title span {
          display: inline-block;
          animation: bounce 1.5s infinite ease-in-out;
          position: relative;
        }
        .game-title span:nth-child(1) { color: #e74c3c; animation-delay: 0.1s; }
        .game-title span:nth-child(2) { color: #f1c40f; animation-delay: 0.2s; }
        .game-title span:nth-child(3) { color: #2ecc71; animation-delay: 0.3s; }
        .game-title span:nth-child(4) { color: #3498db; animation-delay: 0.4s; }
        .game-title span:nth-child(5) { color: #9b59b6; animation-delay: 0.5s; }
        .game-title span:nth-child(6) { color: #e67e22; animation-delay: 0.6s; }
        .game-title span:nth-child(7) { color: #1abc9c; animation-delay: 0.7s; }
        .game-title span:nth-child(8) { color: #e74c3c; animation-delay: 0.8s; }
        .game-title span:nth-child(9) { color: #f1c40f; animation-delay: 0.9s; }
        .game-title span:nth-child(10) { color: #2ecc71; animation-delay: 1.0s; }
        .game-title span:nth-child(11) { color: #3498db; animation-delay: 1.1s; }
        .game-title span:nth-child(12) { color: #9b59b6; animation-delay: 1.2s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(0) rotate(0eg); }
          75% { transform: translateY(-5px) rotate(-5deg); }
        }

        /* Inputs y Selects */
        .custom-select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 0.5rem; font-size: 1rem; margin-top: 0.5rem; }
        .file-input-label { 
            display: flex; justify-content: space-between; align-items: center; 
            cursor: pointer; padding: 10px; border: 2px dashed #ccc; 
            border-radius: 0.5rem; margin-top: 0.5rem; transition: all 0.2s;
        }
        .file-input-label:hover { border-color: var(--primary-blue); background-color: var(--light-blue); }
        
        /* SweetAlert Custom */
        .swal2-popup-custom { border-radius: 16px; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .swal2-confirm-button-custom { background-color: var(--primary-blue) !important; color: white !important; border-radius: 8px !important; }
        .swal2-cancel-button-custom { background-color: var(--danger-red) !important; color: white !important; border-radius: 8px !important; }

        /* Estilos del Preview Interno */
        .puzzle-game-container { 
            padding: 2rem; 
            max-width: 1200px; 
            margin: auto; 
            background: white; 
            border-radius: 1.5rem; 
            box-shadow: var(--shadow-card); 
            display: flex;
            flex-direction: column;
            align-items: center; 
        }
        .rules-header { 
            background-color: var(--soft-white); 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 1.5rem; 
            border: 1px solid #e0e0e0; 
            width: 100%;
            text-align: center;
        }

        /* Barra de Estadísticas */
        .stats-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            background-color: #f1f5f9;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
            flex-wrap: wrap;
            gap: 1rem;
        }
        .stats-group { display: flex; gap: 2rem; align-items: center; }
        .game-wrapper { display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; justify-content: center; width: 100%; }
        .stat-item { font-size: 1.2em; color: var(--dark-blue); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .game-area { display: flex; gap: 2rem; justify-content: center; flex-grow: 1; position: relative; flex-wrap: wrap; }

        .puzzle-pieces-container, .puzzle-board { 
            display: grid; 
            gap: 2px; 
            padding: 5px; 
            background-color: #e0e0e0; 
            border: 1px solid #ccc; 
            border-radius: 8px; 
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1); 
            align-content: start; /* CORRECCIÓN: Evita que se estiren verticalmente */
        }
        .puzzle-slot { background-color: rgba(255,255,255,0.5); border: 1px dashed #aaa; border-radius: 2px; width: 100%; height: 100%; }
        .puzzle-piece { 
            cursor: grab; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
            border-radius: 2px; 
            transition: box-shadow 0.2s; 
            aspect-ratio: 1 / 1; /* CORRECCIÓN: Fuerza a que sean cuadradas */
        }
        .correct-placement { box-shadow: 0 0 5px 2px rgba(40, 167, 69, 0.8); z-index: 10; }
        .incorrect-placement { box-shadow: 0 0 5px 2px rgba(220, 53, 69, 0.8); z-index: 10; }

        /* Overlays */
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box; }
        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .btn-exit { background: var(--gray-secondary); } 
        .btn-retry { background: var(--primary-blue); } 
        .btn-info { background: white; color: var(--primary-blue); border: 2px solid var(--primary-blue); } 
        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary-blue); animation: popIn 0.5s ease-out; } 
        .info-title { font-size: 1.8rem; color: var(--primary-blue); margin: 0; font-weight: 800; font-family: 'Fredoka One', cursive; } 

    `}</style>
);

// --- ESTILOS SUMMARY ---
const summaryStyles = `
    .summary-screen {
        font-family: system-ui, -apple-system, sans-serif; max-width: 1000px; margin: 0 auto; padding: 2rem; background: #ffffff;
        color: #1f2937; border-radius: 1.5rem; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
    }
    .selection-title { text-align: center; color: #0077b6; marginBottom: 2rem; font-size: 2rem; font-weight: 700; }
    .rules-text { text-align: center; color: #6b7280; margin-bottom: 2rem; font-size: 1.1rem; }
    .summary-card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-top: 2rem; }
    .summary-row { display: flex; flex-direction: column; gap: 0.5rem; }
    .download-section { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-top: 3rem; padding: 2rem; background: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0; }
    .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; background: #0077b6; color: white; font-size: 1rem; }
    .btn-primary:hover:not(:disabled) { background: #023e8a; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-success { background: #0077b6; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
`;

// --- NIVELES DE DIFICULTAD ---
const LEVELS = {
  basico: { name: 'Básico', difficulty: 3, time: 180 }, 
  intermedio: { name: 'Intermedio', difficulty: 4, time: 300 },
  avanzado: { name: 'Avanzado', difficulty: 5, time: 420 },
};

// --- GENERADOR HTML PARA ROMPECABEZAS ---
const generatePuzzleCode = (config, gameDetails, selectedPlatforms, imageBase64) => {
    const formattedDate = gameDetails.date 
        ? new Date(gameDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Fecha no especificada';
    
    const platformsString = selectedPlatforms && selectedPlatforms.length > 0
        ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
        : 'Web';
        
    const titleSpans = 'Rompecabezas'.split('').map(c => `<span>${c}</span>`).join('');

    // Sanitización básica del Base64
    const cleanImageBase64 = imageBase64 ? imageBase64.replace(/(\r\n|\n|\r)/gm, "") : "";

    // Lógica del juego en Vanilla JS
    const gameLogicJS = `
        const config = ${JSON.stringify(config)};
        // LEER IMAGEN DESDE SCRIPT OCULTO (Más robusto que string literal)
        let imageSrc = "";
        try {
            const dataEl = document.getElementById('puzzle-image-data');
            if(dataEl) imageSrc = dataEl.textContent.trim();
        } catch(e) { console.error("Error leyendo imagen", e); }
        
        let state = { timeLeft: config.time, timer: null, active: false, score: 0, finished: false };
        let board = [], panelPieces = [];
        let draggedItem = null;

        const gameUi = document.getElementById('game-ui');
        const timerEl = document.getElementById('timer');
        const scoreEl = document.getElementById('score');
        const boardEl = document.getElementById('puzzle-board');
        const panelEl = document.getElementById('puzzle-panel');

        function initGameData() {
            const total = config.difficulty * config.difficulty;
            board = Array(total).fill(null);
            panelPieces = Array.from({length: total}, (_, i) => ({id: i, originalIndex: i}));
            panelPieces.sort(() => Math.random() - 0.5);
            renderBoard();
            renderPanel();
        }

        // CÁLCULO DE POSICIÓN DE FONDO CORREGIDO PARA RESPONSIVE
        function getPieceStyle(index) {
            const row = Math.floor(index / config.difficulty);
            const col = index % config.difficulty;
            
            // Fórmula estándar para sprites CSS responsivos: (pos / (total - 1)) * 100%
            // Esto alinea los bordes correctamente independientemente del tamaño en px
            const xPercent = (col / (config.difficulty - 1)) * 100;
            const yPercent = (row / (config.difficulty - 1)) * 100;

            return 'background-image: url(' + imageSrc + '); ' +
                   'background-position: ' + xPercent + '% ' + yPercent + '%; ' +
                   'background-size: ' + (config.difficulty * 100) + '% ' + (config.difficulty * 100) + '%;' + 
                   'background-repeat: no-repeat;';
        }

        function renderBoard() {
            boardEl.innerHTML = '';
            boardEl.style.gridTemplateColumns = 'repeat(' + config.difficulty + ', 1fr)';
            board.forEach((piece, idx) => {
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot';
                slot.ondragover = (e) => e.preventDefault();
                slot.ondrop = () => handleDropOnBoard(idx);
                if (piece) {
                    const el = document.createElement('div');
                    el.className = 'puzzle-piece';
                    el.style = getPieceStyle(piece.originalIndex);
                    el.draggable = true;
                    el.ondragstart = () => draggedItem = { piece, origin: 'board', index: idx };
                    if(piece.originalIndex === idx) el.classList.add('correct');
                    else el.classList.add('incorrect');
                    slot.appendChild(el);
                }
                boardEl.appendChild(slot);
            });
        }

        function renderPanel() {
            panelEl.innerHTML = '';
            panelEl.style.gridTemplateColumns = 'repeat(' + config.difficulty + ', 1fr)';
            panelPieces.forEach((piece, idx) => {
                const el = document.createElement('div');
                el.className = 'puzzle-piece';
                el.style = getPieceStyle(piece.originalIndex);
                el.draggable = true;
                el.ondragstart = () => draggedItem = { piece, origin: 'panel', index: idx };
                panelEl.appendChild(el);
            });
        }

        function handleDropOnBoard(targetIdx) {
            if (!state.active || !draggedItem || board[targetIdx]) return;
            board[targetIdx] = draggedItem.piece;
            if (draggedItem.origin === 'panel') {
                panelPieces = panelPieces.filter(p => p.id !== draggedItem.piece.id);
            } else {
                board[draggedItem.index] = null;
            }
            draggedItem = null;
            renderBoard();
            renderPanel();
            checkWin();
        }

        panelEl.ondragover = (e) => e.preventDefault();
        panelEl.ondrop = () => {
             if (!state.active || !draggedItem || draggedItem.origin === 'panel') return;
             board[draggedItem.index] = null;
             panelPieces.push(draggedItem.piece);
             draggedItem = null;
             renderBoard();
             renderPanel();
        };

        // Función para calcular puntaje dinámico basado en el tiempo
        function calculateScore() {
            const baseScore = 100;
            // Bonificación por tiempo: 1 punto por cada segundo restante
            const timeBonus = state.timeLeft > 0 ? state.timeLeft : 0;
            return baseScore + timeBonus;
        }

        function checkWin() {
            const isFull = board.every(p => p !== null);
            if (!isFull) return;
            const isCorrect = board.every((p, i) => p.originalIndex === i);
            if (isCorrect) {
                state.score = calculateScore(); // CALCULO DINÁMICO
                // Update UI Score immediately before finish
                if(scoreEl) scoreEl.innerText = state.score;
                setTimeout(() => finishGame(true), 100);
            }
        }

        // Nueva función para verificar si está resuelto al presionar el botón
        function checkResultAndFinish() {
            // Verificar si el tablero está completo y correcto, aunque no haya saltado el trigger automático
            const isFull = board.every(p => p !== null);
            const isCorrect = isFull && board.every((p, i) => p.originalIndex === i);
            
            if (isCorrect) {
                state.score = calculateScore(); // CALCULO DINÁMICO
                finishGame(true);
            } else {
                finishGame(false);
            }
        }

        function startGameSequence() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 5;
            const countDisplay = document.getElementById('countdown-display');
            countDisplay.innerText = count;
            const interval = setInterval(() => {
                count--;
                if(count > 0) {
                    countDisplay.innerText = count;
                    countDisplay.style.animation = 'none';
                    countDisplay.offsetHeight;
                    countDisplay.style.animation = 'popIn 0.5s ease-out';
                } else {
                    clearInterval(interval);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    startGame();
                }
            }, 1000);
        }

        function startGame() {
            gameUi.style.display = 'flex';
            state.active = true;
            state.score = 0;
            state.timeLeft = config.time;
            state.finished = false;
            if(scoreEl) scoreEl.innerText = 0;
            initGameData();
            state.timer = setInterval(() => {
                state.timeLeft--;
                timerEl.innerText = formatTime(state.timeLeft);
                if (state.timeLeft <= 0) finishGame(false);
            }, 1000);
        }

        function finishGame(win) {
            if(state.finished) return; // Prevenir doble ejecución
            state.finished = true;
            
            clearInterval(state.timer);
            state.active = false;
            gameUi.style.display = 'none';
            const endScreen = document.getElementById('end-screen');
            endScreen.classList.remove('hidden');
            
            const titleEl = document.getElementById('end-title');
            if(titleEl) titleEl.innerText = win ? "¡Juego Terminado!" : "¡Tiempo Agotado!";
            
            const msgEl = document.getElementById('end-message');
            if(msgEl) {
                if (win) {
                    msgEl.innerText = "Felicidades has completado el Rompecabezas";
                } else {
                    msgEl.innerText = "¡Inténtalo de nuevo!";
                }
            }
            
            if(win) {
                Swal.fire({ icon: 'success', title: '¡Excelente!', text: 'Felicidades has completado el Rompecabezas' });
            }
        }

        function formatTime(s) {
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function toggleInfo(show) {
            const modal = document.getElementById('info-overlay');
            if(show) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
            } else {
                modal.classList.add('hidden');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        }
        function exitGame() { window.close(); }
    `;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Rompecabezas'} - ${config.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700&family=Fredoka+One&display=swap" rel="stylesheet">
    <style>
        :root { --primary-blue: #0077b6; --dark-blue: #023e8a; --light-blue: #e0f7fa; --bg: #f0f2f5; --white: #ffffff; --green: #2a9d8f; --red: #e63946; --gray-secondary: #6c757d; }
        body { font-family: 'Nunito', sans-serif; background: var(--bg); color: #212529; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        
        .puzzle-game-container { padding: 2rem; max-width: 1200px; width: 100%; margin: auto; background: white; border-radius: 1.5rem; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; align-items: center; }
        
        .game-title { text-align: center; margin-bottom: 1.5rem; font-size: 3.5em; font-weight: 700; font-family: 'Fredoka One', cursive; margin-top: 0; }
        .game-title span { display: inline-block; animation: bounce 1.5s infinite ease-in-out; position: relative; }
        .game-title span:nth-child(1) { color: #e74c3c; animation-delay: 0.1s; }
        .game-title span:nth-child(2) { color: #f1c40f; animation-delay: 0.2s; }
        .game-title span:nth-child(3) { color: #2ecc71; animation-delay: 0.3s; }
        .game-title span:nth-child(4) { color: #3498db; animation-delay: 0.4s; }
        .game-title span:nth-child(5) { color: #9b59b6; animation-delay: 0.5s; }
        .game-title span:nth-child(6) { color: #e67e22; animation-delay: 0.6s; }
        .game-title span:nth-child(7) { color: #1abc9c; animation-delay: 0.7s; }
        .game-title span:nth-child(8) { color: #e74c3c; animation-delay: 0.8s; }
        .game-title span:nth-child(9) { color: #f1c40f; animation-delay: 0.9s; }
        .game-title span:nth-child(10) { color: #2ecc71; animation-delay: 1.0s; }
        .game-title span:nth-child(11) { color: #3498db; animation-delay: 1.1s; }
        .game-title span:nth-child(12) { color: #9b59b6; animation-delay: 1.2s; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .stats-bar { display: flex; justify-content: space-between; align-items: center; width: 100%; background-color: #f1f5f9; padding: 1rem 1.5rem; border-radius: 1rem; margin-bottom: 2rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); flex-wrap: wrap; gap: 1rem; box-sizing: border-box; }
        .stats-group { display: flex; gap: 2rem; align-items: center; }
        .stat-item { font-size: 1.2em; color: var(--dark-blue); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        
        .nav-action-btn { padding: 0.5rem 1.5rem; background-color: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; min-width: 120px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav-action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-exit { background-color: var(--gray-secondary); }

        .game-wrapper { display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; justify-content: center; width: 100%; }
        .game-area { display: flex; gap: 2rem; justify-content: center; flex-grow: 1; position: relative; flex-wrap: wrap; }
        
        .puzzle-container { 
            display: grid; 
            gap: 5px; 
            background: #e0e0e0; 
            padding: 10px; 
            border-radius: 8px; 
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1); 
            align-content: start; /* Mantiene las piezas arriba */
        }
        .puzzle-slot { background: rgba(255,255,255,0.8); border: 1px dashed #aaa; width: 80px; height: 80px; position: relative; }
        .puzzle-piece { 
            width: 100%; 
            height: 100%; 
            cursor: grab; 
            transition: transform 0.2s; 
            border-radius: 2px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); 
            aspect-ratio: 1 / 1; /* Mantiene la forma cuadrada */
        }
        .puzzle-piece.correct { box-shadow: 0 0 5px 2px rgba(40, 167, 69, 0.8); z-index: 10; }
        .puzzle-piece.incorrect { box-shadow: 0 0 5px 2px rgba(220, 53, 69, 0.8); z-index: 10; }

        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box; }
        .hidden { display: none !important; opacity: 0; pointer-events: none; }
        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .btn-info { background: white; color: var(--primary-blue); border: 2px solid var(--primary-blue); }
        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary-blue); animation: popIn 0.5s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        .info-modal-content { background: white; padding: 2.5rem; border-radius: 1rem; max-width: 600px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; position: relative; }
        .info-header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .info-title { font-size: 1.8rem; color: var(--primary-blue); margin: 0; font-weight: 800; font-family: 'Fredoka One', cursive; }
        .info-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
        .info-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .info-item { background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 0.25rem; }
        .info-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
        .info-desc { grid-column: 1 / -1; background: #fff; padding: 0; border: none; }
        .close-info-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        
        .puzzle-piece { background-size: ${config.difficulty * 100}% ${config.difficulty * 100}%; }
    </style>
</head>
<body>
    <!-- CONTENEDOR SEGURO DE DATOS DE IMAGEN -->
    <script id="puzzle-image-data" type="text/plain">
${cleanImageBase64}
    </script>

    <div id="start-screen" class="overlay">
        <h1 class="info-title" style="font-size: 3rem;">${gameDetails.gameName || 'Rompecabezas'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; margin-bottom: 2rem;">
            Nivel: ${config.name} (${config.difficulty}x${config.difficulty})
        </div>
        <p style="margin-bottom: 2rem; color: #64748b; font-size: 1.1rem;">Arma la imagen correctamente antes de que se agote el tiempo.</p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button class="big-btn" onclick="startGameSequence()"><i data-lucide="play"></i> Iniciar Juego</button>
            <button class="big-btn btn-info" onclick="toggleInfo(true)"><i data-lucide="info"></i> Información</button>
        </div>
    </div>

    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>
    
    <div id="info-overlay" class="overlay hidden" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 100;">
        <div class="info-modal-content">
            <button class="close-info-btn" onclick="toggleInfo(false)">&times;</button>
            <div class="info-header">
                <h2 class="info-title">${gameDetails.gameName || 'Rompecabezas'}</h2>
                <div class="info-subtitle">Configurado desde Steam-G</div>
            </div>
            <div class="info-details-grid">
                <div class="info-item"><span class="info-label">Versión</span><span class="info-value">${gameDetails.version || '1.0.0'}</span></div>
                <div class="info-item"><span class="info-label">Fecha</span><span class="info-value">${formattedDate}</span></div>
                <div class="info-item"><span class="info-label">Plataforma</span><span class="info-value">${platformsString}</span></div>
                <div class="info-item"><span class="info-label">Dificultad</span><span class="info-value">${config.name}</span></div>
                <div class="info-item info-desc">
                    <span class="info-label">Descripción</span>
                    <p class="info-value">${gameDetails.description || 'Sin descripción disponible.'}</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 1.5rem;">
                <button class="big-btn" style="font-size: 1rem; padding: 0.75rem 2rem;" onclick="toggleInfo(false)">Cerrar</button>
            </div>
        </div>
    </div>

    <div id="end-screen" class="overlay hidden">
        <h1 id="end-title" style="color: var(--dark-blue); font-size: 3rem; font-family: 'Fredoka One';">Juego Terminado</h1>
        <h2 id="end-message" style="color: var(--primary-blue); font-size: 2rem; margin: 1rem; text-align: center; max-width: 80%;"></h2>
        <div style="display: flex; gap: 1rem;">
             <button class="big-btn btn-exit" onclick="exitGame()">Salir</button>
             <button class="big-btn" onclick="location.reload()">Reiniciar</button>
        </div>
    </div>

    <div class="puzzle-game-container" id="game-ui" style="display:none;">
        <h1 class="game-title">${titleSpans}</h1>
        <div class="stats-bar">
            <div class="stats-group">
                <div class="stat-item"><i data-lucide="timer"></i> <span id="timer">0:00</span></div>
                <div class="stat-item"><i data-lucide="trophy"></i> <span id="score">0</span> pts</div>
            </div>
            <button class="nav-action-btn btn-exit" onclick="checkResultAndFinish()">
                <i data-lucide="log-out"></i> Finalizar
            </button>
        </div>
        <div class="game-wrapper">
             <div class="game-area">
                <div class="puzzle-container" id="puzzle-panel" style="min-width: 200px; min-height: 200px;"></div>
                <div class="puzzle-container" id="puzzle-board"></div>
             </div>
        </div>
    </div>

    <script>
        ${gameLogicJS}
        lucide.createIcons();
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY (REINSERTADO PARA CORREGIR EL ERROR) ---
const Summary = ({ config, imageSrc, onBack }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    const [jsZipReady, setJsZipReady] = useState(false);

    const location = useLocation();
    const state = location.state;
    
    // Mock Data para evitar fallos si location.state viene vacío
    const MOCK_DATA = {
        selectedAreas: ['Arte', 'Lógica'],
        selectedSkills: ['Percepción Visual', 'Resolución de Problemas'],
        gameDetails: {
          gameName: "Rompecabezas Visual",
          description: "Arma la imagen arrastrando las piezas a su lugar correcto.",
          version: "1.0.0",
          date: new Date().toISOString()
        },
        selectedPlatforms: ['web']
    };

    const { 
        selectedAreas = MOCK_DATA.selectedAreas, 
        selectedSkills = MOCK_DATA.selectedSkills, 
        gameDetails = MOCK_DATA.gameDetails, 
        selectedPlatforms = MOCK_DATA.selectedPlatforms
    } = state || MOCK_DATA;

    // Cargar JSZip dinámicamente
    useEffect(() => {
        if (window.JSZip) { setJsZipReady(true); return; }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.async = true;
        script.onload = () => setJsZipReady(true);
        document.body.appendChild(script);
        return () => { if(document.body.contains(script)) document.body.removeChild(script); }
    }, []);

    const handleDownloadZip = () => {
        if (isGenerating || !jsZipReady) return; 
        setIsGenerating(true); setProgress(0); setStatusText("Iniciando...");

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 5; 
            if (currentProgress >= 90) {
                clearInterval(interval);
                setStatusText("Empaquetando...");
                generateAndDownloadZip();
            } else {
                setStatusText(currentProgress < 50 ? "Procesando imagen..." : "Generando código...");
                setProgress(currentProgress);
            }
        }, 150); 
    };

    const generateAndDownloadZip = async () => {
        try {
            const zip = new window.JSZip();
            const htmlContent = generatePuzzleCode(config, gameDetails, selectedPlatforms, imageSrc);
            
            // NOMBRE DEL ARCHIVO: Rompecabezas.html
            zip.file("Rompecabezas.html", htmlContent);
            
            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rompecabezas-${config.name.toLowerCase()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setProgress(100); setStatusText("¡Listo!");
            setTimeout(() => { setIsGenerating(false); setProgress(0); }, 2000);
        } catch (error) {
            console.error(error);
            setStatusText("Error al generar");
            setIsGenerating(false);
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
            <style>{summaryStyles}</style>
            <h2 style={{color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <CheckCircle size={32} color="#2a9d8f" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu rompecabezas está listo. Revisa los detalles y descárgalo.</p>
            
            <h1 className="selection-title">Resumen de la Configuración</h1>
            
            <div className="summary-details" style={{maxWidth: '800px', margin: '0 auto'}}>
                {/* Grid de Info General */}
                <div className="info-grid">
                    <div className="info-card" style={{alignItems: 'center', textAlign: 'center'}}>
                        <div className="info-card-header"><Tag size={16}/> Nombre</div>
                        <div className="info-card-value">{gameDetails.gameName}</div>
                    </div>
                    <div className="info-card" style={{alignItems: 'center', textAlign: 'center'}}>
                        <div className="info-card-header"><Layers size={16}/> Versión</div>
                        <div className="info-card-value">{gameDetails.version}</div>
                    </div>
                    <div className="info-card full-width" style={{alignItems: 'center', textAlign: 'center'}}>
                         <div className="info-card-header"><FileText size={16}/> Descripción</div>
                         <div className="info-card-value" style={{fontSize: '1rem'}}>{gameDetails.description}</div>
                    </div>
                    <div className="info-card" style={{alignItems: 'center', textAlign: 'center'}}>
                         <div className="info-card-header"><Calendar size={16}/> Fecha</div>
                         <div className="info-card-value">{formatDate(gameDetails.date)}</div>
                    </div>
                    <div className="info-card" style={{alignItems: 'center', textAlign: 'center'}}>
                         <div className="info-card-header"><Monitor size={16}/> Plataforma</div>
                         <div className="info-card-value">{selectedPlatforms[0] || 'Web'}</div>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />
               
                               {/* --- AQUI SE APLICA LA ESTRUCTURA DE DOS COLUMNAS COMO EN SUMMARY --- */}
                               {/* Modificado para asegurar 2 columnas horizontales */}
                               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                                   <div className="info-card" style={{borderLeft: '4px solid #3b82f6'}}>
                                       <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                                           <Shapes size={20} color="#3b82f6"/> Áreas Seleccionadas
                                       </h4>
                                       {selectedAreas?.length > 0 ? (
                                           <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
                                               {selectedAreas.map(areaId => (
                                                   <span key={areaId} style={{ 
                                                       display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                                       padding: '0.5rem 0.75rem', background: '#eff6ff', 
                                                       borderRadius: '0.5rem', fontSize: '0.95rem', color: '#1e40af' 
                                                   }}>
                                                       <img 
                                                           src={getAreaIcon(areaId)} 
                                                           alt=""
                                                           style={{ width: '20px', height: '20px', borderRadius:'4px' }}
                                                       />
                                                       {getAreaName(areaId)}
                                                   </span>
                                               ))}
                                           </div>
                                       ) : (
                                           <p style={{ color: '#64748b', fontStyle: 'italic' }}>No hay áreas seleccionadas.</p>
                                       )}
                                   
                    </div>
                    <div className="info-card" style={{borderLeft: '4px solid #8b5cf6'}}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                            <Puzzle size={20} color="#8b5cf6"/> Habilidades
                        </h4>
                        <ul style={{paddingLeft: '1.2rem', margin: 0, color: '#334155'}}>
                            {selectedSkills.map(s => <li key={s} style={{marginBottom:'0.4rem'}}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Parámetros del Juego */}
            <div className="summary-card" style={{marginTop: '2.5rem'}}>
                <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#0077b6'}}>
                    Parámetros del Rompecabezas
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b'}}><Type size={18}/> Dificultad:</span>
                        <strong style={{color: '#0077b6'}}>{config.name} ({config.difficulty}x{config.difficulty})</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b'}}><Clock size={18}/> Tiempo:</span>
                        <strong style={{color: '#0077b6'}}>{config.time} seg.</strong>
                    </div>
                </div>

                {/* Previsualización Imagen */}
                <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <strong style={{marginBottom: '0.75rem', color: '#334155'}}>Imagen Seleccionada:</strong>
                    <img src={imageSrc} alt="Preview" style={{maxWidth: '200px', borderRadius: '8px', border: '1px solid #ddd'}}/>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={onBack} disabled={isGenerating}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            {/* Sección Descarga */}
            <div className="download-section">
                <div style={{textAlign: 'center', width: '100%', maxWidth: '600px'}}>
                    <h3 style={{color: '#0077b6', marginBottom: '0.5rem'}}>Descargar Paquete</h3>
                    <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Genera el archivo .zip listo para usar en su computadora.</p>
                    
                    {isGenerating && (
                        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>{statusText}</span><span>{progress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: '#0077b6', transition: 'width 0.3s ease-out' }}></div>
                            </div>
                        </div>
                    )}
                </div>
                <button 
                    className="btn-primary btn-success" 
                    onClick={handleDownloadZip}
                    disabled={isGenerating || !jsZipReady}
                    style={{ minWidth: '200px', padding: '1rem 2rem' }}
                >
                    {isGenerating ? "Generando..." : <><Download size={18}/> Generar (.zip)</>}
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE VISTA PREVIA ---
const PuzzlePreview = ({ imageSrc, level, onBack }) => {
  const { difficulty, time: timeLimit } = level;
  const [board, setBoard] = useState([]);
  const [panelPieces, setPanelPieces] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const draggedItem = useRef(null);
  const timerIntervalRef = useRef(null);

  const initializeGame = () => {
    clearInterval(timerIntervalRef.current);
    const totalPieces = difficulty * difficulty;
    const allPieces = Array.from({ length: totalPieces }, (_, i) => ({ id: i, originalIndex: i }));
    setBoard(Array(totalPieces).fill({ piece: null, isCorrect: null }));
    setPanelPieces(allPieces.sort(() => Math.random() - 0.5));
    setTimeLeft(timeLimit);
    setScore(0);
    setIsGameActive(false);
  };

  useEffect(() => {
    if (isGameActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsGameActive(false);
            window.Swal.fire({
              icon: 'warning', title: '¡Tiempo Agotado!', confirmButtonText: 'Reiniciar', showCancelButton: true, cancelButtonText: 'Salir'
            }).then(result => { if (result.isConfirmed) initializeGame(); else onBack(); });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isGameActive, onBack]);

  useEffect(() => { initializeGame(); }, [difficulty]);

  const getPieceBGStyle = (piece) => {
    const row = Math.floor(piece.originalIndex / difficulty);
    const col = piece.originalIndex % difficulty;
    return {
      backgroundImage: `url(${imageSrc})`, backgroundPosition: `${-col * 100}% ${-row * 100}%`, backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
    };
  };

  const handleDragStart = (piece, origin, originIndex) => { draggedItem.current = { piece, origin, originIndex }; };
  
  const handleDropOnBoard = (targetIndex) => {
    if (!isGameActive || !draggedItem.current || board[targetIndex].piece) return;
    const { piece, origin, originIndex } = draggedItem.current;
    const newBoard = [...board];
    newBoard[targetIndex] = { piece: piece, isCorrect: piece.originalIndex === targetIndex };
    if (origin === 'panel') setPanelPieces(panelPieces.filter(p => p.id !== piece.id));
    else newBoard[originIndex] = { piece: null, isCorrect: null };
    setBoard(newBoard);
    checkCompletion(newBoard);
  };

  const handleDropOnPanel = () => {
    if (!isGameActive || !draggedItem.current || draggedItem.current.origin === 'panel') return;
    const { piece, originIndex } = draggedItem.current;
    const newBoard = [...board];
    newBoard[originIndex] = { piece: null, isCorrect: null };
    setBoard(newBoard);
    setPanelPieces([...panelPieces, piece]);
  };
    
  const checkCompletion = (currentBoard) => {
    if (currentBoard.every(slot => slot.piece && slot.isCorrect)) {
      clearInterval(timerIntervalRef.current);
      setIsGameActive(false);
      setScore(10); // Update score to 10
      window.Swal.fire({ icon: 'success', title: '¡Excelente!', text: 'Juego completado. Puntaje: 10' }).then(() => onBack());
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${minutes}:${rem < 10 ? '0' : ''}${rem} min.`;
  };

  return (
    <div className="puzzle-game-container">
      <div className="rules-header">
        <h3 style={{margin:'0 0 0.5rem 0'}}>Reglas Básicas</h3>
        <p style={{margin:0}}>Ordena las piezas arrastrándolas al tablero para formar la imagen.</p>
      </div>
      
      <div className="stats-bar">
          <div className="stats-group">
            <div className="stat-item"><Timer size={24}/> {formatTime(timeLeft)}</div>
            <div className="stat-item"><Trophy size={24}/> {score} pts</div>
          </div>
          
          <button onClick={onBack} className="nav-action-btn" style={{minWidth: '120px', padding: '0.5rem 1rem'}}>
              <ArrowLeft size={18}/> Salir
          </button>
      </div>

      <div className="game-wrapper">
        <div className="game-area" style={{ opacity: isGameActive ? 1 : 0.7 }}>
            {!isGameActive && (
             <div className="overlay" style={{position:'absolute', borderRadius:'8px', zIndex: 10, background: 'rgba(255,255,255,0.7)'}}>
               <button onClick={() => setIsGameActive(true)} className="big-btn">
                  <Play size={24} /> Comenzar Juego
               </button>
             </div>
           )}
          <div className="puzzle-pieces-container" style={{gridTemplateColumns: `repeat(${difficulty}, 1fr)`, width: `${difficulty * 60 + 10}px`, minHeight: `${difficulty * 60 + 10}px`}} onDrop={handleDropOnPanel} onDragOver={(e) => e.preventDefault()}>
            {panelPieces.map((piece) => (
              <div key={piece.id} className="puzzle-piece" style={{...getPieceBGStyle(piece), width:'60px', height:'60px'}} draggable={isGameActive} onDragStart={() => handleDragStart(piece, 'panel', -1)} />
            ))}
          </div>
          <div className="puzzle-board" style={{gridTemplateColumns: `repeat(${difficulty}, 1fr)`, width: '400px', height: '400px'}}>
            {board.map((slot, index) => (
                <div key={index} className="puzzle-slot" onDrop={() => handleDropOnBoard(index)} onDragOver={(e) => e.preventDefault()}>
                  {slot.piece && <div className={`puzzle-piece ${slot.isCorrect ? 'correct-placement' : 'incorrect-placement'}`} style={{...getPieceBGStyle(slot.piece), width:'100%', height:'100%'}} draggable={isGameActive} onDragStart={() => handleDragStart(slot.piece, 'board', index)} />}
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Rompecabezas = () => {
  const [view, setView] = useState('home'); 
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [levelKey, setLevelKey] = useState('basico');
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0,0);
    if(!document.getElementById('sweetalert-script')) {
        const s = document.createElement('script'); s.id = 'sweetalert-script';
        s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11'; document.head.appendChild(s);
    }
  }, [view]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        window.Swal?.fire({ icon: 'error', title: 'Formato inválido', text: 'Solo imágenes JPG, PNG, GIF.' });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setImageSrc(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setImageSrc(null); setFileName('');
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const goToSummary = () => {
    setView('summary');
    navigate('/settings?view=summary', { replace: true, state: location.state });
  };

  return (
    <div className="main-container">
      <GlobalStyles />

      {view === 'summary' && (
          <Summary 
            config={LEVELS[levelKey]} 
            imageSrc={imageSrc} 
            onBack={() => setView('home')} 
          />
      )}

      {view === 'preview' && (
          <div style={{width: '100%'}}>
              <h1 className="game-title">
                {'Vista Previa'.split('').map((char, index) => <span key={index}>{char === ' ' ? '\u00A0' : char}</span>)}
              </h1>
              <PuzzlePreview 
                imageSrc={imageSrc} 
                level={LEVELS[levelKey]} 
                onBack={() => setView('home')} 
              />
          </div>
      )}

      {view === 'home' && (
        <div className="level-select-container">
          <h1 className="game-title">
            {'Rompecabezas'.split('').map((char, index) => <span key={index}>{char}</span>)}
          </h1>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', flexGrow: 1 }}>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', color: 'var(--dark-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={18}/> Nivel de Dificultad:
                </label>
                <select value={levelKey} onChange={(e) => setLevelKey(e.target.value)} className="custom-select">
                  {Object.keys(LEVELS).map(key => (
                    <option key={key} value={key}>
                      {LEVELS[key].name} ({LEVELS[key].difficulty}x{LEVELS[key].difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', color: 'var(--dark-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={18}/> Imagen del Rompecabezas:
                </label>
                <label htmlFor="image-upload-input" className="file-input-label">
                    <span style={{color: fileName ? '#2a9d8f' : '#6c757d', fontWeight: fileName ? 'bold' : 'normal'}}>
                        {fileName || 'Seleccionar archivo...'}
                    </span>
                    <Upload size={20} color="var(--primary-blue)"/>
                </label>
                <input type="file" id="image-upload-input" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                
                {imageSrc && (
                    <button onClick={removeImage} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <Trash2 size={16}/> Eliminar imagen actual
                    </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafafa', border: '2px dashed #ddd', borderRadius: '1rem', padding: '1rem', minHeight: '300px' }}>
              {imageSrc ? (
                <img src={imageSrc} alt="Previsualización" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#aaa' }}>
                    <ImageIcon size={64} style={{marginBottom: '1rem', opacity: 0.5}}/>
                    <p>Sube una imagen para ver la vista previa</p>
                </div>
              )}
            </div>
          </div>

          <div style={{display:'flex', gap:'1rem', marginTop:'auto', paddingTop: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button onClick={() => navigate(-1)} className="nav-action-btn">
                    <ArrowLeft size={20}/> Anterior
                </button>
                
                <button 
                    onClick={() => setView('preview')} 
                    disabled={!imageSrc} 
                    className="nav-action-btn"
                >
                    <i data-lucide="play"></i> Vista Previa
                </button>
                
                <button 
                    onClick={goToSummary} 
                    disabled={!imageSrc} 
                    className="nav-action-btn"
                    style={{ backgroundColor: !imageSrc ? 'var(--gray-secondary)' : 'var(--primary-blue)' }}
                >
                    <CheckCircle size={20}/> Terminar Configuración
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Rompecabezas;