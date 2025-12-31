import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
    ArrowLeft, CheckCircle, FileText, Calendar,
    Monitor, Shapes, Puzzle, List, Clock, Tag, Layers, Star, Smartphone, Globe
} from 'lucide-react';

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
    .selection-title { text-align: center; color: #005f92; margin-bottom: 2rem; font-size: 2rem; font-weight: 700; }
    .rules-text { text-align: center; color: #6b7280; margin-bottom: 2rem; font-size: 1.1rem; }
    .summary-card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-top: 2rem; }
    .summary-row { display: flex; flex-direction: column; gap: 0.5rem; }
    .download-section { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-top: 3rem; padding: 2rem; background: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0; }
    .btn-success { background: #005f92; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .btn-success:hover:not(:disabled) { background: #004a73; }
    .btn-success:disabled { opacity: 0.6; cursor: not-allowed; }

    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; }
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
`;

// --- GENERADOR HTML PARA ORDENAMIENTO (Basado en Acertijo pero lógica de Ordenar) ---
const generateGameCode = (config, gameDetails, selectedPlatforms) => {
    if (!config) config = { difficulty: "Básico", timeLimit: 300, exercises: [] };

    const formattedDate = gameDetails.date
        ? new Date(gameDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Fecha no especificada';

    const platformsString = selectedPlatforms && selectedPlatforms.length > 0
        ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
        : 'Web';

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Juego de Ordenamiento'} - ${config.difficulty}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #0077b6; --dark: #023e8a; --light: #e0f7fa; --bg: #f0f2f5; --white: #ffffff; --green: #2a9d8f; --red: #e63946; --secondary: #1f2937; }
        body { font-family: 'Nunito', sans-serif; background: var(--bg); color: #212529; margin: 0; padding: 20px; display: flex; flex-direction: column; min-height: 100vh; }

        .main-wrapper { max-width: 1000px; margin: 0 auto; width: 100%; }

        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box; }
        .hidden { display: none !important; opacity: 0; pointer-events: none; }

        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .btn-info { background: white; color: var(--primary); border: 2px solid var(--primary); }
        .btn-restart { background: var(--secondary); color: white; }

        .game-header { display: flex; flex-wrap: wrap; justify-content: space-around; background-color: var(--dark); color: white; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header-item { font-size: 1.1rem; padding: 0.25rem 0.5rem; }
        .header-item b { color: var(--light); }

        .card { background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 1.5rem; text-align: center; }

        /* Drag and Drop Styles */
        .dnd-container { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: start; margin-top: 1.5rem; }
        .arrow-separator { display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: #718096; padding-top: 5rem; }
        .dnd-list { display: flex; flex-direction: column; gap: 0.75rem; min-height: 200px; }
        .dnd-item { padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 500; background: white; user-select: none; }
        .dnd-item.static { background-color: #f8f9fa; color: #4a5568; }
        .dnd-item.interactive { cursor: grab; border: 1px dashed #a0aec0; display: flex; align-items: center; }
        .dnd-item.interactive:hover { border-color: var(--primary); border-style: solid; }
        .dnd-item.dragging { opacity: 0.5; background: var(--light); border: 2px solid var(--primary); }
        .drag-handle { font-weight: 700; color: #a0aec0; margin-right: 0.75rem; }

        .memory-list li { font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--primary); font-weight: 600; text-align: left; }

        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary); animation: popIn 0.5s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        /* Animation for Title */
        @keyframes titleFloat {
            0% { transform: translateY(0px); text-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            50% { transform: translateY(-5px); text-shadow: 0 15px 25px rgba(0,0,0,0.2); }
            100% { transform: translateY(0px); text-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        }
        .game-title-anim {
            text-align: center;
            font-family: 'Merriweather', serif;
            color: var(--dark);
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            margin-top: 0;
            animation: titleFloat 3s ease-in-out infinite;
            background: linear-gradient(120deg, var(--dark), var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Modal Info */
        .info-modal-content { background: white; padding: 2.5rem; border-radius: 1rem; max-width: 600px; width: 90%; position: relative; border: 1px solid #e5e7eb; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .info-header-modal { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .info-title { font-size: 1.8rem; color: var(--primary); margin: 0; font-weight: 800; }
        .info-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .info-item { background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 0.25rem; }
        .info-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
        .info-desc { grid-column: 1 / -1; background: #fff; padding: 0; border: none; }
        .close-info-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }

        @media(max-width: 768px) {
            .dnd-container { grid-template-columns: 1fr; }
            .arrow-separator { transform: rotate(90deg); padding: 1rem 0; }
            .info-details-grid { grid-template-columns: 1fr; }
            .game-title-anim { font-size: 1.8rem; }
            .action-buttons { flex-direction: column; }
        }
    </style>
</head>
<body>
    <!-- PANTALLA DE INICIO -->
    <div id="start-screen" class="overlay">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; text-align: center;">${gameDetails.gameName || 'Ordenamiento'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; margin-bottom: 2rem;">
            Nivel: ${config.difficulty}
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <button class="big-btn" onclick="startGameSequence()">▶ Iniciar Juego</button>
            <button class="big-btn btn-info" onclick="toggleInfo(true)">ℹ Información</button>
        </div>
    </div>

    <!-- CUENTA REGRESIVA -->
    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>

    <!-- PANTALLA FINAL -->
    <div id="end-screen" class="overlay hidden">
        <h1 style="color:var(--secondary); font-size:3rem;">Juego Terminado</h1>
        <h2 style="color:var(--primary); font-size:2rem; margin:1rem 0;">Puntaje Final: <span id="final-score">0</span></h2>
        <div style="display:flex; gap:1rem;">
             <button class="big-btn" style="background: var(--secondary);" onclick="window.close()">Salir</button>
             <button class="big-btn" onclick="location.reload()">Jugar de Nuevo</button>
        </div>
    </div>

    <!-- MODAL INFORMACION -->
    <div id="info-overlay" class="overlay hidden" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 100;">
        <div class="info-modal-content">
            <button class="close-info-btn" onclick="toggleInfo(false)">&times;</button>
            <div class="info-header-modal">
                <h2 class="info-title">${gameDetails.gameName || 'Ordenamiento'}</h2>
                <div style="color: #64748b; font-size: 0.9rem;">Configurado desde Steam-G</div>
            </div>
            <div class="info-details-grid">
                <div class="info-item"><span class="info-label">Versión</span><span class="info-value">${gameDetails.version || '1.0.0'}</span></div>
                <div class="info-item"><span class="info-label">Fecha</span><span class="info-value">${formattedDate}</span></div>
                <div class="info-item"><span class="info-label">Dificultad</span><span class="info-value">${config.difficulty}</span></div>
                <div class="info-item"><span class="info-label">Plataformas</span><span class="info-value">${platformsString}</span></div>
                <div class="info-item info-desc">
                    <span class="info-label">Descripción</span>
                    <p style="color:#475569; line-height:1.6;">${gameDetails.description || 'Ejercicio de ordenamiento lógico.'}</p>
                </div>
            </div>
            <div style="text-align: center;"><button class="big-btn" style="padding: 0.5rem 2rem; font-size: 1rem;" onclick="toggleInfo(false)">Cerrar</button></div>
        </div>
    </div>

    <!-- UI DEL JUEGO -->
    <div id="game-ui" class="main-wrapper hidden">
        <!-- TITULO ANIMADO -->
        <h1 class="game-title-anim">Ordenamiento de Información</h1>

        <div class="game-header">
            <div class="header-item">Nivel: <b>${config.difficulty}</b></div>
            <div class="header-item">Tiempo: <b id="timer-display">05:00</b></div>
            <div class="header-item">Progreso: <b id="progress-display">1 / ${config.exercises.length}</b></div>
            <div class="header-item">Puntos: <b id="score-display">0</b></div>
        </div>

        <div id="memory-view" class="card hidden">
            <h1 style="color:var(--primary); margin-bottom:0.5rem;" id="mem-title">Título</h1>
            <p id="mem-desc" style="color:#666; margin-bottom:1rem;"></p>
            <p style="color:var(--red); font-weight:bold;">¡Memoriza el orden! <span id="mem-timer">5</span>s</p>
            <div style="background:#f0f9ff; padding:1rem; border:2px dashed var(--primary); border-radius:1rem; text-align:left; display:inline-block;">
                <ol id="mem-list" class="memory-list"></ol>
            </div>
        </div>

        <div id="play-view" class="hidden">
            <div class="card">
                <h2 id="play-title" style="color:var(--primary); margin:0;">Título</h2>
                <p id="play-desc" style="color:#666;">Descripción</p>
            </div>

            <div class="dnd-container">
                <div class="dnd-column">
                    <h3 style="text-align:center; color:#4a5568;">Pasos Desordenados</h3>
                    <div class="dnd-list card" style="background:#f7fafc;">
                        <!-- Static visual reference only showing items existed, but logical work is on right -->
                         <div id="static-list-container"></div>
                    </div>
                </div>
                <div class="arrow-separator">→</div>
                <div class="dnd-column">
                    <h3 style="text-align:center; color:var(--primary);">Ordena Aquí</h3>
                    <div id="user-list" class="dnd-list card"></div>
                </div>
            </div>

            <div class="action-buttons" style="margin-top:2rem; display:flex; justify-content:center; gap: 1rem;">
                <button class="big-btn btn-restart" onclick="location.reload()">Finalizar Juego</button>
                <button class="big-btn" onclick="checkSolution()">¡Verificar Orden!</button>
            </div>
        </div>
    </div>

    <script>
        const config = ${JSON.stringify(config)};
        let state = { currentIdx: 0, score: 0, timeLeft: config.timeLimit, timerId: null, userOrder: [] };

        // --- LOGICA GENERAL ---
        function toggleInfo(show) {
            const el = document.getElementById('info-overlay');
            if(show) { el.classList.remove('hidden'); el.style.display = 'flex'; }
            else { el.classList.add('hidden'); setTimeout(()=>el.style.display='none', 300); }
        }

        function startGameSequence() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 5;
            const display = document.getElementById('countdown-display');
            display.innerText = count;
            const int = setInterval(() => {
                count--;
                if(count > 0) {
                    display.innerText = count;
                    display.style.animation = 'none';
                    display.offsetHeight;
                    display.style.animation = 'popIn 0.5s ease-out';
                } else {
                    clearInterval(int);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    initGame();
                }
            }, 1000);
        }

        function formatTime(s) {
            const m = Math.floor(s/60).toString().padStart(2,'0');
            const sec = (s%60).toString().padStart(2,'0');
            return m + ':' + sec;
        }

        function initGame() {
            document.getElementById('game-ui').classList.remove('hidden');
            state.timerId = setInterval(() => {
                state.timeLeft--;
                document.getElementById('timer-display').innerText = formatTime(state.timeLeft);
                if(state.timeLeft <= 0) endGame();
            }, 1000);
            loadExercise();
        }

        function loadExercise() {
            const ex = config.exercises[state.currentIdx];
            document.getElementById('progress-display').innerText = (state.currentIdx + 1) + ' / ' + config.exercises.length;

            // Memory Phase
            document.getElementById('play-view').classList.add('hidden');
            document.getElementById('memory-view').classList.remove('hidden');

            document.getElementById('mem-title').innerText = ex.title;
            document.getElementById('mem-desc').innerText = ex.description;
            const memList = document.getElementById('mem-list');
            memList.innerHTML = '';
            ex.steps.forEach(s => {
                const li = document.createElement('li');
                li.innerText = s;
                memList.appendChild(li);
            });

            let memTime = 5;
            document.getElementById('mem-timer').innerText = memTime;
            const memInt = setInterval(() => {
                memTime--;
                document.getElementById('mem-timer').innerText = memTime;
                if(memTime <= 0) {
                    clearInterval(memInt);
                    startPlayPhase(ex);
                }
            }, 1000);
        }

        function startPlayPhase(ex) {
            document.getElementById('memory-view').classList.add('hidden');
            document.getElementById('play-view').classList.remove('hidden');

            document.getElementById('play-title').innerText = ex.title;
            document.getElementById('play-desc').innerText = ex.description;

            // Prepare Drag and Drop Lists
            // 1. Static list (shuffled just for show)
            const shuffledStatic = [...ex.steps].sort(() => Math.random() - 0.5);
            const staticContainer = document.getElementById('static-list-container');
            staticContainer.innerHTML = '';
            shuffledStatic.forEach(s => {
                const d = document.createElement('div');
                d.className = 'dnd-item static';
                d.innerText = s;
                staticContainer.appendChild(d);
            });

            // 2. Interactive list (shuffled)
            // Ensure it's not solved by chance
            let shuffledUser = [...ex.steps].sort(() => Math.random() - 0.5);
            while(JSON.stringify(shuffledUser) === JSON.stringify(ex.steps)) {
                 shuffledUser = [...ex.steps].sort(() => Math.random() - 0.5);
            }
            state.userOrder = shuffledUser; // Keep track via data, render via DOM
            renderUserList();
        }

        // --- DRAG AND DROP LOGIC (Vanilla JS) ---
        let draggedItemIdx = null;

        function renderUserList() {
            const container = document.getElementById('user-list');
            container.innerHTML = '';
            state.userOrder.forEach((itemText, idx) => {
                const el = document.createElement('div');
                el.className = 'dnd-item interactive';
                el.draggable = true;
                el.innerHTML = '<span class="drag-handle">::</span> ' + itemText;

                el.addEventListener('dragstart', (e) => {
                    draggedItemIdx = idx;
                    el.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                el.addEventListener('dragend', () => {
                    el.classList.remove('dragging');
                    draggedItemIdx = null;
                });

                el.addEventListener('dragover', (e) => e.preventDefault());

                el.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    if (draggedItemIdx === null || draggedItemIdx === idx) return;

                    // Reorder array
                    const item = state.userOrder.splice(draggedItemIdx, 1)[0];
                    state.userOrder.splice(idx, 0, item);
                    draggedItemIdx = idx; // Update index
                    renderUserList(); // Re-render immediately
                });

                container.appendChild(el);
            });
        }

        function checkSolution() {
            const ex = config.exercises[state.currentIdx];
            const isCorrect = JSON.stringify(state.userOrder) === JSON.stringify(ex.steps);

            if(isCorrect) {
                state.score += 10;
                document.getElementById('score-display').innerText = state.score;
                Swal.fire({ title: '¡Correcto!', icon: 'success', timer: 1500, showConfirmButton: false })
                .then(() => {
                    state.currentIdx++;
                    if(state.currentIdx < config.exercises.length) {
                        loadExercise();
                    } else {
                        endGame();
                    }
                });
            } else {
                Swal.fire({ title: 'Incorrecto', text: 'El orden no es correcto. Inténtalo de nuevo.', icon: 'error' });
            }
        }

        function endGame() {
            clearInterval(state.timerId);
            document.getElementById('game-ui').classList.add('hidden');
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('final-score').innerText = state.score;
        }

        lucide.createIcons();
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY (Adaptado de Acertijo) ---
const Summary = ({ config, onBack }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    const [jsZipReady, setJsZipReady] = useState(false);
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const location = useLocation();
    const state = location.state || {}; // Evitar crash si state es null

    // Datos Mock por defecto si no vienen del state
    const {
        selectedAreas = ['Lógica'],
        selectedSkills = ['Ordenamiento', 'Memoria Secuencial'],
        gameDetails = {
          gameName: "Ordenamiento de Información",
          description: "Organiza los pasos lógicos de diferentes procesos.",
          version: "1.0.0",
          date: new Date().toISOString()
        },
        selectedPlatforms = ['web']
    } = state;

    useEffect(() => {
        if (window.JSZip) {
            setJsZipReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.async = true;
        script.onload = () => setJsZipReady(true);
        document.body.appendChild(script);
        return () => { if(document.body.contains(script)) document.body.removeChild(script); }
    }, []);

    const handleDownloadZip = () => {
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
                setProgress(currentProgress);
                if (currentProgress > 40) setStatusText("Generando HTML...");
            }
        }, 200);
    };

    const generateAndDownloadZip = async () => {
        try {
            const zip = new window.JSZip();
            const htmlContent = generateGameCode(config, gameDetails, selectedPlatforms);

            // NOMBRE DEL ARCHIVO SOLICITADO
            zip.file("OrdenarInformacion.html", htmlContent);

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ordenamiento-${config.difficulty.toLowerCase()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setProgress(100);
            setStatusText("¡Descarga iniciada!");
            setTimeout(() => { setIsGenerating(false); setProgress(0); }, 2000);
        } catch (error) {
            console.error(error);
            setStatusText("Error al generar.");
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

            const baseZipUrl = '/templates/ordenar-img/android-base.zip';
            const configPath = 'android/app/src/main/assets/public/config/reorder-config.json';

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
                ejercicios: Array.isArray(config.exercises)
                    ? config.exercises.map((e) => ({
                        id: e.id,
                        title: e.title,
                        description: e.description,
                        steps: e.steps || []
                    }))
                    : [],
                timeLimit: config.timeLimit || 300,
                nombreApp: gameDetails?.gameName || 'Ordenamiento de Información',
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
            const nombreArchivo = `android-ordenamiento-${configData.nivel || 'juego'}.zip`
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
            <style>{summaryStyles}</style>
            <h2 style={{color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <CheckCircle size={32} color="#22c55e" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu juego ha sido configurado correctamente. Revisa los detalles y descárgalo.</p>

            <h1 className="selection-title">Resumen de la Configuración</h1>

        <div className="summary-details" style={{maxWidth: '800px', margin: '0 auto'}}>
                <div className="info-grid">
                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Tag size={16} /> Nombre del Juego</div>
                        <div className="info-card-value">{gameDetails.gameName || 'No disponible'}</div>
                    </div>

                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Layers size={16} /> Versión</div>
                        <div className="info-card-value">{gameDetails.version || '1.0.0'}</div>
                    </div>

                    <div className="info-card full-width" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><FileText size={16} /> Descripción</div>
                        <div className="info-card-value" style={{fontSize: '1rem', lineHeight: '1.5'}}>
                            {gameDetails.description || 'Sin descripción.'}
                        </div>
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
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b'}}><Star size={18}/> Dificultad:</span>
                        <strong style={{fontSize: '1.1rem',color: '#0077b6'}}>{config.difficulty}</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b'}}><Clock size={18}/> Tiempo:</span>
                        <strong style={{fontSize: '1.1rem', color: '#0077b6'}}>{config.timeLimit}s</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b'}}><List size={18}/> Ejercicios:</span>
                        <strong style={{fontSize: '1.1rem', color: '#0077b6'}}>{config.exercises.length}</strong>
                    </div>
                </div>

                <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9'}}>
                    <strong style={{display:'block', marginBottom:'0.75rem', color: '#334155'}}>Ejercicios seleccionados:</strong>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {config.exercises.map(e => (
                            <span key={e.id} style={{ background:'white', padding:'6px 12px', borderRadius:'20px', fontSize:'0.9rem', border: '1px solid #e2e8f0', color: '#475569' }}>
                                {e.title}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-success" onClick={onBack} disabled={isGenerating} style={{background: 'var(--primary-blue)'}}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            <div className="download-section">
                <div style={{width: '100%', maxWidth: '600px', textAlign: 'center'}}>
                    <h3 style={{color: '#0077b6', marginBottom: '0.5rem'}}>Descargar Paquete del Juego</h3>
                    <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Selecciona la plataforma para la cual deseas generar el paquete.</p>

                    {/* Barra de progreso Web */}
                    {isGenerating && (
                        <div style={{marginBottom: '1.5rem'}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
                                <span>{statusText}</span><span>{progress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '7px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#005f92', transition: 'width 0.3s ease-out' }}></div>
                            </div>
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
