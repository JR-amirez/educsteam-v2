import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
    ArrowLeft, CheckCircle, Layers, Tag, FileText,
    Calendar, Monitor, Shapes, Puzzle, Type, Clock, List, Smartphone, Globe
} from 'lucide-react';

// --- ESTILOS CSS PARA SUMMARY ---
const summaryStyles = `
    .summary-screen {
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        background: #ffffff;
        color: #1f2937;
        border-radius: 1.5rem;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
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
        flex-direction: column;
        gap: 0.5rem;
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
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
`;

// --- GENERADOR DE HTML PARA DIAGRAMAS ---
const generateFlowchartHTML = (config, gameDetails, selectedPlatforms) => {
    const formattedDate = gameDetails.date ? new Date(gameDetails.date).toLocaleDateString('es-ES') : 'Fecha no especificada';
    const platformsString = selectedPlatforms?.length > 0 ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') : 'Web';

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Diagramas de Flujo'} - ${config.difficulty}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700;800&display=swap');

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

        body { font-family: 'Nunito', sans-serif; background: #f3f4f6; margin: 0; padding: 20px; display: flex; justify-content: center; min-height: 100vh; color: var(--dark-gray); }
        .container { max-width: 1200px; width: 100%; display: flex; flex-direction: column; gap: 20px; }

        /* Grid Layout */
        .game-grid-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .game-grid-layout { grid-template-columns: 1fr 2fr; } }

        /* Header Badges */
        .header { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: var(--shadow-card); margin-bottom: 1rem; }
        .header-badge { padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 100px; text-align: center; display: flex; align-items: center; justify-content: center; }

        /* Panels */
        .panel { background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-card); }

        /* Draggable Items */
        .option-container { min-height: 150px; background: var(--soft-white); border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem; }
        .draggable-item { background: white; border: 2px solid #cbd5e1; padding: 1rem; border-radius: 0.8rem; cursor: grab; text-align: center; font-weight: 600; color: var(--dark-gray); user-select: none; transition: transform 0.1s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .draggable-item:active { cursor: grabbing; transform: scale(0.98); }

        /* Flowchart Elements */
        .flow-node-endpoint { background-color: var(--primary-blue); color: white; padding: 12px 30px; border-radius: 2rem; font-weight: 700; display: inline-block; min-width: 120px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .flow-arrow-static { font-size: 24px; color: var(--gray-secondary); margin: 5px 0; text-align: center; line-height: 1; }

        /* Shapes */
        .flow-shape-process { width: 90%; height: 4.5rem; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 0.8rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; border: 2px solid #64748b; background: white; margin: 0 auto; font-weight: 600; }
        .flow-shape-data { width: 90%; height: 4.5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; border: 2px solid #64748b; background: white; transform: skew(-15deg); margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-weight: 600; }
        .flow-text { transform: skew(15deg); pointer-events: none; padding: 5px; font-size: 0.9rem; text-align: center; }
        .flow-slot-empty { width: 100%; height: 4.5rem; border: 2px dashed #cbd5e1; background-color: #f8fafc; display: flex; align-items: center; justify-content: center; border-radius: 0.8rem; margin: 0 auto; color: #94a3b8; font-weight: 600; }
        .slot-container { width: 100%; min-height: 5rem; display: flex; justify-content: center; align-items: center; }

        /* Title Animation */
        @keyframes flow-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-title {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(270deg, #0077b6, #023e8a, #00b4d8, #023e8a, #0077b6);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: flow-text 8s ease infinite;
            text-align: center;
            margin-bottom: 2rem;
            font-family: 'Merriweather', serif;
        }

        /* Buttons */
        .btn-game-action {
            width: 100%;
            padding: 1rem;
            border-radius: 0.8rem;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            border: none;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            color: white;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-game-action:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-validate { background-color: var(--primary-blue); box-shadow: 0 4px 15px rgba(0, 119, 182, 0.3); }
        .btn-terminate { background-color: var(--danger-red); box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3); }

        /* Overlays & Modals */
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; padding: 20px; transition: opacity 0.3s; }
        .hidden { display: none !important; opacity: 0; pointer-events: none; }

        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0.5rem; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); }
        .btn-info { background: white; color: var(--primary-blue); border: 2px solid var(--primary-blue); }
        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary-blue); animation: popIn 0.5s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        /* End Screen Modal */
        .end-modal-content {
            background: white; padding: 3rem; border-radius: 1.5rem; text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
            max-width: 500px; width: 90%; border: 1px solid #e5e7eb;
        }
        .end-title { font-family: 'Merriweather', serif; font-size: 2.5rem; color: var(--dark-blue); margin-bottom: 1rem; }
        .end-score { font-size: 1.5rem; color: var(--gray-secondary); margin-bottom: 2rem; }
        .end-score span { color: var(--primary-blue); font-weight: 800; font-size: 2.5rem; }
        .end-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    </style>
</head>
<body>
    <!-- Start Screen -->
    <div id="start-screen" class="overlay">
        <h1 class="animated-title">${gameDetails.gameName || 'Diagramas de Flujo'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700; margin-bottom: 2rem; font-size: 1.1rem;">
            Nivel: ${config.difficulty}
        </div>
        <p style="color: #64748b; margin-bottom: 2rem; font-size: 1.2rem;">Ordena los pasos correctamente para resolver los problemas.</p>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <button class="big-btn" onclick="startCountdown()">▶ Iniciar Juego</button>
            <button class="big-btn btn-info" onclick="toggleInfo(true)">ℹ Información</button>
        </div>
    </div>

    <!-- Countdown Screen -->
    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>

    <!-- End Screen Overlay -->
    <div id="end-screen" class="overlay hidden">
        <div class="end-modal-content">
            <h1 id="end-title" class="end-title">Juego Terminado</h1>
            <p class="end-score">Puntuación final: <span id="final-score">0</span></p>
            <div class="end-buttons">
                <button class="big-btn" onclick="location.reload()">Volver a Jugar</button>
                <button class="big-btn" style="background: var(--danger-red);" onclick="exitGame()">Salir del Juego</button>
            </div>
        </div>
    </div>

    <!-- Game UI -->
    <div id="game-ui" class="container hidden">
        <h1 class="animated-title" style="font-size: 2.5rem; margin-bottom: 1rem;">Diagramas de Flujo</h1>

        <div class="header">
            <div class="header-badge" style="background:var(--primary-blue)">Nivel: ${config.difficulty}</div>
            <div class="header-badge" style="background:#374151">Tiempo: <span id="timer">${config.timeLimit}</span>s</div>
            <div class="header-badge" style="background:var(--primary-blue)">Desafío: <span id="progress">1</span>/${config.problems.length}</div>
            <div class="header-badge" style="background:var(--success-green)">Puntos: <span id="score">0</span></div>
        </div>

        <div class="game-grid-layout">
            <!-- Left Panel -->
            <div class="panel" style="height: fit-content;">
                <h3 style="color: var(--dark-gray); font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem; font-family: 'Merriweather', serif;">Problemática:</h3>
                <p id="problem-title" style="color: var(--primary-blue); font-weight: 700; font-size: 1.2rem; margin-bottom: 1rem;"></p>
                <p style="color:var(--gray-secondary); font-size:1rem; margin-bottom:1.5rem; line-height:1.6;">
                    Arrastra los recuadros con los datos de abajo hacia el diagrama de flujo de la derecha, para colocarlos en el orden correcto y resolver la problemática.
                </p>
                <div id="options-container" class="option-container" ondrop="drop(event, 'options')" ondragover="allowDrop(event)">
                    <!-- Options injected here -->
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="btn-game-action btn-validate" onclick="checkAnswer()">Validar Respuesta</button>
                    <button class="btn-game-action btn-terminate" onclick="endGame(false)">Terminar Juego</button>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="panel" style="display:flex; justify-content:center; background:white;">
                <div style="width: 100%; max-width: 450px; display: flex; flex-direction: column; alignItems: center;">
                    <div class="flow-node-endpoint" style="margin-bottom: 0.5rem;">Inicio</div>

                    <div id="flowchart-slots" style="width: 100%;">
                        <!-- Slots injected here -->
                    </div>

                    <div class="flow-arrow-static">↓</div>
                    <div class="flow-node-endpoint" style="margin-top: 0.5rem;">Fin</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const config = ${JSON.stringify(config)};
        let state = { currentIdx: 0, score: 0, timeLeft: config.timeLimit, timerInterval: null };
        let currentProblem = null;

        function startCountdown() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 5;
            const el = document.getElementById('countdown-display');
            const int = setInterval(() => {
                count--;
                el.innerText = count;
                el.style.animation = 'none';
                el.offsetHeight; /* trigger reflow */
                el.style.animation = 'popIn 0.5s ease-out';
                if(count <= 0) {
                    clearInterval(int);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    startGame();
                }
            }, 1000);
        }

        function startGame() {
            document.getElementById('game-ui').classList.remove('hidden');
            loadProblem();
            state.timerInterval = setInterval(() => {
                state.timeLeft--;
                document.getElementById('timer').innerText = formatTime(state.timeLeft);
                if(state.timeLeft <= 0) {
                    clearInterval(state.timerInterval);
                    Swal.fire({ title: 'Tiempo agotado', icon: 'error' }).then(() => endGame(false));
                }
            }, 1000);
        }

        function formatTime(s) {
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return m.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0');
        }

        function loadProblem() {
            if(state.currentIdx >= config.problems.length) {
                endGame(true);
                return;
            }
            currentProblem = config.problems[state.currentIdx];
            document.getElementById('problem-title').innerText = currentProblem.titulo;
            document.getElementById('progress').innerText = state.currentIdx + 1;

            // Render Options
            const optsContainer = document.getElementById('options-container');
            optsContainer.innerHTML = '';
            const shuffledOpts = [...currentProblem.opciones].sort(() => Math.random() - 0.5);
            shuffledOpts.forEach((opt, i) => {
                const el = document.createElement('div');
                el.className = 'draggable-item';
                el.draggable = true;
                el.innerText = opt;
                el.id = 'opt-' + i + '-' + Date.now();
                el.ondragstart = drag;
                optsContainer.appendChild(el);
            });

            // Render Slots
            const slotsContainer = document.getElementById('flowchart-slots');
            slotsContainer.innerHTML = '';
            currentProblem.solucion.forEach((_, i) => {
                const html = \`
                    <div class="flow-arrow-static">↓</div>
                    <div class="slot-container" ondrop="drop(event, 'slot')" ondragover="allowDrop(event)">
                        <div class="flow-slot-empty" id="slot-\${i}" data-filled="false">
                            Arrastra aquí
                        </div>
                    </div>
                \`;
                slotsContainer.innerHTML += html;
            });
        }

        function allowDrop(ev) { ev.preventDefault(); }
        function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

        function drop(ev, targetType) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedEl = document.getElementById(data);
            let target = ev.target;

            if (targetType === 'slot') {
                if (!target.classList.contains('flow-slot-empty') && !target.classList.contains('flow-shape-process') && !target.classList.contains('flow-shape-data')) {
                     const parent = target.closest('[id^="slot-"]');
                     if(parent) target = parent; else return;
                }

                if(target.getAttribute('data-filled') === 'true') {
                    const existing = target.querySelector('.draggable-item');
                    if(existing) document.getElementById('options-container').appendChild(existing);
                }

                const slotIndex = target.id.split('-')[1];
                const isDataShape = currentProblem.plantilla[slotIndex] === 1;

                target.className = isDataShape ? 'flow-shape-data' : 'flow-shape-process';
                target.innerHTML = '';
                target.appendChild(draggedEl);
                target.setAttribute('data-filled', 'true');

                if(isDataShape) draggedEl.classList.add('flow-text');
                else draggedEl.classList.remove('flow-text');

            } else {
                document.getElementById('options-container').appendChild(draggedEl);
                draggedEl.classList.remove('flow-text');
            }
        }

        // Reset slot style on drag out
        document.addEventListener('dragend', function(event) {
             const slots = document.querySelectorAll('[id^="slot-"]');
             slots.forEach(slot => {
                 if(slot.children.length === 0 || (slot.children.length === 1 && slot.innerText === 'Arrastra aquí')) {
                     slot.className = 'flow-slot-empty';
                     slot.innerHTML = 'Arrastra aquí';
                     slot.setAttribute('data-filled', 'false');
                 }
             });
        });

        function checkAnswer() {
            const slots = document.querySelectorAll('[id^="slot-"]');
            let userAns = [];
            let allFilled = true;
            slots.forEach(slot => {
                const item = slot.querySelector('.draggable-item');
                if(!item) allFilled = false;
                else userAns.push(item.innerText);
            });

            if(!allFilled) {
                Swal.fire('¡Espera!', 'Llena todos los espacios.', 'warning');
                return;
            }

            if(JSON.stringify(userAns) === JSON.stringify(currentProblem.solucion)) {
                state.score += 10;
                document.getElementById('score').innerText = state.score;
                Swal.fire({ icon: 'success', title: '¡Correcto!', timer: 1000, showConfirmButton: false }).then(() => {
                    state.currentIdx++;
                    loadProblem();
                });
            } else {
                Swal.fire('Incorrecto', 'Inténtalo de nuevo.', 'error');
            }
        }

        function endGame(completed) {
            clearInterval(state.timerInterval);
            document.getElementById('game-ui').classList.add('hidden');

            const titleEl = document.getElementById('end-title');
            titleEl.innerText = completed ? '¡Felicidades!' : 'Juego Terminado';
            titleEl.style.color = completed ? 'var(--success-green)' : 'var(--danger-red)';

            document.getElementById('final-score').innerText = state.score;
            document.getElementById('end-screen').classList.remove('hidden');
        }

        function exitGame() {
            window.close();
            // Fallback
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;font-family:sans-serif;"><h1>Gracias por jugar</h1><p>Puedes cerrar esta pestaña.</p></div>';
        }
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY ---
const Summary = ({ config, onBack }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    const [jsZipReady, setJsZipReady] = useState(false);

    // Estados para Android
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const location = useLocation();
    const state = location.state || {};

    // Datos simulados si no vienen del router
    const MOCK_DATA = {
        selectedAreas: ['Tecnología', 'Ingeniería'],
        selectedSkills: ['Lógica', 'Secuenciación'],
        gameDetails: {
          gameName: "Juego de Diagramas",
          description: "Ordena los procesos lógicos correctamente.",
          version: "1.0.0",
          date: new Date().toISOString()
        },
        selectedPlatforms: ['android']
    };

    const {
        selectedAreas = MOCK_DATA.selectedAreas,
        selectedSkills = MOCK_DATA.selectedSkills,
        gameDetails = state.gameDetails || MOCK_DATA.gameDetails,
        selectedPlatforms = MOCK_DATA.selectedPlatforms
    } = state;

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

    // Cargar JSZip
    useEffect(() => {
        if (window.JSZip) { setJsZipReady(true); return; }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.async = true;
        script.onload = () => setJsZipReady(true);
        script.onerror = () => setErrorMsg("Error cargando librería ZIP");
        document.body.appendChild(script);
        return () => { if(document.body.contains(script)) document.body.removeChild(script); }
    }, []);

    const handleDownloadZip = () => {
        if (isGenerating || !jsZipReady) return;
        setIsGenerating(true); setProgress(0); setStatusText("Iniciando...");
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 2;
            if (currentProgress >= 90) {
                clearInterval(interval); setStatusText("Procesando recursos..."); generateAndDownloadZip();
            } else {
                if (currentProgress > 30) setStatusText("Generando código HTML...");
                setProgress(currentProgress);
            }
        }, 200);
    };

    const generateAndDownloadZip = async () => {
        try {
            const zip = new window.JSZip();
            const htmlContent = generateFlowchartHTML(config, gameDetails, selectedPlatforms);
            zip.file("DiagramasFlujo.html", htmlContent);

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            const fileName = `diagramas-flujo-${config.difficulty}.zip`
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .toLowerCase();
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setProgress(100); setStatusText("¡Descarga iniciada!");
            setTimeout(() => { setIsGenerating(false); setProgress(0); }, 2000);
        } catch (error) {
            console.error("Error:", error); setStatusText("Error al generar."); setIsGenerating(false);
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

            const baseZipUrl = '/templates/diagramas-flujo/android-base.zip';
            const configPath = 'android/app/src/main/assets/public/config/diagramas-config.json';

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

            // Mapear la dificultad
            const nivelMap = {
                'Básico': 'basico',
                'Intermedio': 'intermedio',
                'Avanzado': 'avanzado',
            };

            // Construir el JSON de configuración
            const configData = {
                nivel: nivelMap[config.difficulty] || 'basico',
                diagramas: Array.isArray(config.selectedDiagrams)
                    ? config.selectedDiagrams.map((d) => ({
                        id: d.id,
                        nombre: d.nombre,
                        pasos: d.pasos || []
                    }))
                    : [],
                nombreApp: gameDetails?.gameName || 'Diagramas de Flujo',
                version: gameDetails?.version || '1.0.0',
                descripcion: gameDetails?.description || '',
                fecha: gameDetails?.date || new Date().toISOString(),
                plataformas: Array.isArray(selectedPlatforms)
                    ? selectedPlatforms
                    : ['android'],
            };

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
            const nombreArchivo = `android-diagramas-flujo-${configData.nivel || 'juego'}.zip`
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

    return (
        <div className="summary-screen">
            <style>{summaryStyles}</style>
            <h2 style={{color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <CheckCircle size={32} color="#22c55e" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu juego ha sido configurado correctamente. Revisa los detalles y descárgalo.</p>

            <h1 className="selection-title">Resumen de la Configuración</h1>

            <div className="summary-details" style={{maxWidth: '800px', margin: '0 auto'}}>
                <div className="info-grid">
                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header"><Tag size={16} /> Nombre del Juego</div>
                        <div className="info-card-value">{gameDetails.gameName || 'Diagramas de Flujo'}</div>
                    </div>
                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header"><Layers size={16} /> Versión</div>
                        <div className="info-card-value">{gameDetails.version || '1.0.0'}</div>
                    </div>
                    <div className="info-card full-width" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header"><FileText size={16} /> Descripción</div>
                        <div className="info-card-value" style={{fontSize: '1rem', lineHeight: '1.5'}}>{gameDetails.description || 'Juego de lógica y ordenamiento de procesos.'}</div>
                    </div>
                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                      <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Calendar size={16} /> Fecha de Creación</div>
                        <div className="info-card-value">{formatDate(gameDetails.date)}</div>
                        </div>

                        <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Monitor size={16} /> Plataformas</div>
                          <div className="info-card-value">
                              {selectedPlatforms?.length > 0
                              ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
                           : 'No seleccionadas'}
                  </div>
                  </div>
                </div>


                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />
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
                                            <Puzzle size={20} color="#8b5cf6"/> Habilidades Seleccionadas
                                        </h4>
                                        {selectedSkills?.length > 0 ? (
                                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155' }}>
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

            <div className="summary-card">
                <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#0077b6'}}>Parámetros del Juego</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px'}}>
                        <Type size={18} color="#64748b"/> <span>Dificultad:</span> <strong style={{color:'#0077b6'}}>{config.difficulty}</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px'}}>
                        <Clock size={18} color="#64748b"/> <span>Tiempo:</span> <strong style={{color:'#0077b6'}}>{config.timeLimit}s</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px'}}>
                        <List size={18} color="#64748b"/> <span>Problemas:</span> <strong style={{color:'#0077b6'}}>{config.problems?.length || 0}</strong>
                    </div>
                </div>
                {config.problems && config.problems.length > 0 && (
                    <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9'}}>
                        <strong style={{display:'block', marginBottom:'0.75rem', color: '#334155'}}>Problemáticas seleccionadas:</strong>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                            {config.problems.map(p => <span key={p.id} style={{background:'white', border:'1px solid #e2e8f0', padding:'6px 12px', borderRadius:'20px', fontSize:'0.9rem', color: '#475569'}}>{p.titulo}</span>)}
                        </div>
                    </div>
                )}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={onBack} disabled={isGenerating || isGeneratingAndroid}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            <div className="download-section">
                <div style={{textAlign: 'center', maxWidth: '700px'}}>
                    <h3 style={{color: '#0077b6', marginBottom: '0.5rem'}}>Descargar Paquetes del Juego</h3>
                    <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Genera los archivos .zip listos para ser descargados en su computadora.</p>

                    {/* Indicador de generación Web */}
                    {isGenerating && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>{statusText}</span><span>{progress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '7px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#005f92', transition: 'width 0.3s' }}></div>
                            </div>
                        </div>
                    )}

                    {/* Indicador de generación Android */}
                    {isGeneratingAndroid && (
                        <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe'}}>
                            <p style={{color: '#1e40af', margin: 0, fontWeight: '500'}}>
                                ⏳ Generando paquete Android... La descarga iniciará automáticamente.
                            </p>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {errorMsg && (
                        <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fecaca'}} role="alert">
                            <p style={{color: '#991b1b', margin: 0, fontWeight: '500'}}>
                                ❌ Error: {errorMsg}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {/* Botón Web (HTML) */}
                    <button
                        className="btn-primary btn-success"
                        onClick={handleDownloadZip}
                        disabled={isGenerating || !jsZipReady || isGeneratingAndroid}
                        style={{
                            minWidth: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            cursor: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 'not-allowed' : 'pointer',
                            opacity: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 0.8 : 1
                        }}
                    >
                        {(isGenerating || !jsZipReady) ? (!jsZipReady ? "Cargando librería..." : "Generando...") : <><Globe size={18} /> Web (HTML)</>}
                    </button>

                    {/* Botón Android */}
                    <button
                        className="btn-primary"
                        onClick={generarAndroidZipConConfig}
                        disabled={isGeneratingAndroid || !jsZipReady || isGenerating}
                        style={{
                            minWidth: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            backgroundColor: '#3ddc84',
                            cursor: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 'not-allowed' : 'pointer',
                            opacity: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 0.8 : 1
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

                <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', textAlign: 'center'}}>
                    <strong>Web:</strong> Archivo HTML listo para abrir en navegador.
                    {' '}<strong>Android:</strong> Proyecto React Native listo para compilar en Android Studio.
                </p>
            </div>
        </div>
    );
};

export default Summary;
