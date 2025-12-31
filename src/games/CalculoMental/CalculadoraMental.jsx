import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GrLinkNext } from "react-icons/gr";
import Summary from './Summary';

// --- DATOS DE EJERCICIOS (Integrados en el archivo) ---
const exerciseData = [
    {
        "nivel": "basico",
        "operation": "3,+2,-1,+4,-2",
        "options": [
            { "text": "6", "isCorrect": true },
            { "text": "5", "isCorrect": false },
            { "text": "7", "isCorrect": false }
        ]
    },
    {
        "nivel": "basico",
        "operation": "5,+3,-2,+1,-4",
        "options": [
            { "text": "3", "isCorrect": true },
            { "text": "2", "isCorrect": false },
            { "text": "4", "isCorrect": false }
        ]
    },
    {
        "nivel": "basico",
        "operation": "7,-2,+5,-3,+1",
        "options": [
            { "text": "8", "isCorrect": true },
            { "text": "7", "isCorrect": false },
            { "text": "9", "isCorrect": false }
        ]
    },
    {
        "nivel": "intermedio",
        "operation": "20,÷2,+5,-3,+4,-2,+6,-1,+3,-4",
        "options": [
            { "text": "23", "isCorrect": true },
            { "text": "21", "isCorrect": false },
            { "text": "25", "isCorrect": false }
        ]
    },
    {
        "nivel": "intermedio",
        "operation": "15,÷3,+9,-4,+6,-2,+5,-3,+4,-1",
        "options": [
            { "text": "26", "isCorrect": true },
            { "text": "24", "isCorrect": false },
            { "text": "28", "isCorrect": false }
        ]
    },
    {
        "nivel": "avanzado",
        "operation": "8,×2,+5,-3,÷2,+4,×3,-2,+6,÷2,+7,-5,×2,+1,-4",
        "options": [
            { "text": "38", "isCorrect": true },
            { "text": "40", "isCorrect": false },
            { "text": "36", "isCorrect": false }
        ]
    },
    {
        "nivel": "avanzado",
        "operation": "12,×3,-6,÷2,+8,×2,-4,+7,÷2,+5,-3,×2,+6,-2,+4",
        "options": [
            { "text": "53", "isCorrect": true },
            { "text": "51", "isCorrect": false },
            { "text": "55", "isCorrect": false }
        ]
    }
];

const IconArrowBack = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
        <path d="M249.38 256L370.06 135.32a16.79 16.79 0 10-23.74-23.74L213.78 244.14a16.8 16.8 0 000 23.74l132.54 132.54a16.79 16.79 0 0023.74-23.74z"></path>
    </svg>
);
const IconConfigure = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311a1.464 1.464 0 0 1-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c-1.4-.413-1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z"></path>
    </svg>
);

const App = () => {
    // --- ESTADOS DEL COMPONENTE ---
    const [gameState, setGameState] = useState('config'); // config, welcome, playing, answering, finished, summary
    const [config, setConfig] = useState({ level: 'basico', exerciseCount: 1 });
    const [gameData, setGameData] = useState({ exercises: [], currentStep: 0, score: 0 });
    const [operationText, setOperationText] = useState('');
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [availableCount, setAvailableCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const levels = [...new Set(exerciseData.map(ej => ej.nivel))];

    // --- EFECTOS ---
    useEffect(() => {
        // FIX: Cargar dinámicamente el script de SweetAlert2 para asegurar que las modales funcionen.
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Limpiar el script al desmontar el componente para evitar fugas de memoria.
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

    useEffect(() => {
        const filtered = exerciseData.filter(ej => ej.nivel === config.level);
        setAvailableCount(filtered.length);
        if (config.exerciseCount > filtered.length) {
            setConfig(prev => ({ ...prev, exerciseCount: filtered.length || 1 }));
        }
    }, [config.level]);

    const goToSummary = () => {
        setGameState('summary');
        // Actualizar la URL para que el ProgressBar muestre 100% PERO manteniendo el state
        navigate('/settings?view=summary', {
            replace: true,
            state: {
                ...location.state, // Mantener el state existente
                gameType: "calculoMental",
                gameConfig: {
                    level: config.level,
                    exerciseCount: config.exerciseCount,
                }
            }
        });
    };

    const returnToConfig = () => {
        setGameState('config');
    };

    // --- LÓGICA DEL JUEGO ---

    const handleShowPreview = () => {
        setGameState('welcome');
    };

    const handleStartGame = () => {
        const filteredExercises = exerciseData.filter(ej => ej.nivel === config.level);
        const selectedExercises = filteredExercises.sort(() => Math.random() - 0.5).slice(0, config.exerciseCount);

        if (selectedExercises.length > 0) {
            setGameData({ exercises: selectedExercises, currentStep: 0, score: 0 });
            displayAROperation(0, selectedExercises);
        } else {
            window.Swal?.fire('Error', 'No hay ejercicios disponibles para este nivel.', 'error');
            setGameState('config');
        }
    };

    const displayAROperation = (step, exercises) => {
        setGameState('playing');
        setSelectedOption(null);
        setShuffledOptions([]);
        setOperationText('');

        const currentExercise = exercises[step];
        const operationString = currentExercise.operation.replace(/,/g, '');
        const parts = operationString.match(/(\d+|[+\-×÷*/])/g) || [];
        let i = 0;

        const interval = setInterval(() => {
            if (i < parts.length) {
                setOperationText(parts[i]);
                i++;
            } else {
                clearInterval(interval);
                setOperationText('¿Listo? ¡Puedes responder!');
                setShuffledOptions([...currentExercise.options].sort(() => Math.random() - 0.5));
                setGameState('answering');
            }
        }, 800); // Tiempo de visualización de cada número
    };

    const handleValidate = () => {
        if (!selectedOption) {
            window.Swal?.fire('Atención', 'Por favor, selecciona una opción.', 'warning');
            return;
        }

        const isCorrect = selectedOption.isCorrect;
        // Lógica de puntuación: 10 puntos por respuesta correcta.
        const newScore = isCorrect ? gameData.score + 10 : gameData.score;
        setGameData(prev => ({ ...prev, score: newScore }));

        const isLastQuestion = gameData.currentStep === gameData.exercises.length - 1;

        if (isCorrect) {
            window.Swal?.fire({
                title: '¡Correcto, Has obtenido!',
                html: '<strong style="color: #28a745; font-size: 1.5rem;">10 Puntos</strong>',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: isLastQuestion ? 'Ver Resultado' : 'Siguiente juego',
                cancelButtonText: 'Finalizar juego',
                confirmButtonColor: '#007bff',
                cancelButtonColor: '#6c757d',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleNextStep();
                } else {
                    handleBackToGenerator();
                }
            });
        } else {
            window.Swal?.fire({
                title: '¡Error!',
                text: 'Intenta nuevamente.',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Reiniciar juego',
                cancelButtonText: 'Finalizar juego',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleBackToGenerator(true); // Reinicia
                } else {
                    handleBackToGenerator(); // Finaliza
                }
            });
        }
    };

    const handleNextStep = () => {
        const nextStep = gameData.currentStep + 1;
        if (nextStep < gameData.exercises.length) {
            setGameData(prev => ({ ...prev, currentStep: nextStep }));
            displayAROperation(nextStep, gameData.exercises);
        } else {
            setGameState('finished');
            window.Swal?.fire({
                title: 'Juego Completado',
                html: `Puntuación Final: <strong style="font-size: 1.5rem;">${gameData.score + (selectedOption.isCorrect ? 10 : 0)}</strong>`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Terminar Configuración',
                cancelButtonText: 'Volver a Jugar',
            }).then((result) => {
                if (result.isConfirmed) {
                    goToSummary();
                } else {
                    handleBackToGenerator(true);
                }
            });
        }
    };

    const handleBackToGenerator = (restart = false) => {
        setGameState(restart ? 'welcome' : 'config');
        setOperationText('');
        setSelectedOption(null);
        setGameData({ exercises: [], currentStep: 0, score: 0 });
        if (restart) {
            handleStartGame();
        }
    };

    // --- RENDERIZADO DE VISTAS ---

    const renderPreviewArea = () => {
        switch (gameState) {
            case 'welcome':
                return (
                    <div className="game-container welcome">
                        <h2>Bienvenido al juego de Cálculo Mental</h2>
                        <p>Observa como se juega</p>
                        <button className="game-btn primary" onClick={handleStartGame}>Iniciar juego</button>
                    </div>
                );
            case 'playing':
                return (
                    <div className="game-container playing">
                        <div className="operation-display">{operationText}</div>
                        <div className="score">Puntuación: {gameData.score}</div>
                    </div>
                );
            case 'answering':
                return (
                    <div className="game-container answering">
                        <div className="operation-display">{operationText}</div>
                        <div className="options-grid">
                            {shuffledOptions.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <button className="game-btn success" onClick={handleValidate} disabled={!selectedOption}>Validar Resultado</button>
                        <div className="score">Puntuación: {gameData.score}</div>
                    </div>
                );

            case 'config':
            default:
                return <div className="game-container placeholder">Selecciona tus opciones y presiona "Vista Previa" para comenzar.</div>;
        }
    };

    const AnimatedTitle = () => (
        <div className="animated-title-container">
            <h1 className="animated-title">
                {'Cálculo Mental'.split('').map((char, index) => (
                    <span key={index} style={{ animationDelay: `${index * 0.07}s` }}>
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </h1>
            <div className="floating-icons">
                <span className="icon-1">+</span>
                <span className="icon-2">×</span>
                <span className="icon-3">-</span>
                <span className="icon-4">÷</span>
            </div>
        </div>
    );

    // Si estamos en el estado 'summary', renderizar solo el componente Summary
    if (gameState === 'summary') {
        return (
            <Summary
                config={{
                    level: config.level,
                    exerciseCount: config.exerciseCount,
                }}
                onBack={returnToConfig}
            />
        );
    }

    return (
        <>
            {/* --- ESTILOS CSS (Integrados) --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
                
                :root {
                    --primary-color: #007bff;
                    --secondary-color: #6c757d;
                    --success-color: #28a745;
                    --danger-color: #dc3545;
                    --light-color: #f8f9fa;
                    --dark-color: #343a40;
                    --bg-color: #e9ecef;
                    --font-family: 'Poppins', sans-serif;
                }

                

                .app-layout {
                    display: flex;
                    gap: 2rem;
                    width: 100%;
                    max-width: 1200px;
                    margin-bottom: 2rem;
                }

                .config-panel, .preview-panel {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }

                .config-panel {
                    flex: 1;
                }

                .preview-panel {
                    flex: 2;
                    display: flex;
                    flex-direction: column;
                }
                
                h2 {
                    color: var(--primary-color);
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                /* --- Título Animado --- */
                .animated-title-container {
                    position: relative;
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: center;
                }

                .animated-title {
                    display: flex;
                    justify-content: center;
                    color: var(--primary-color);
                    margin: 0;
                    font-weight: 700;
                    font-size: 2.2rem;
                }

                .animated-title span {
                    display: inline-block;
                    opacity: 0;
                    transform: scale(0.5) translateY(50px);
                    animation: popIn 0.6s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes popIn {
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .floating-icons span {
                    position: absolute;
                    color: var(--primary-color);
                    opacity: 0.3;
                    font-size: 1.5rem;
                    font-weight: 700;
                    animation: float 4s ease-in-out infinite;
                }

                .floating-icons .icon-1 { top: -20px; left: 10%; animation-delay: 0s; }
                .floating-icons .icon-2 { top: 0; right: 10%; animation-delay: 1s; }
                .floating-icons .icon-3 { bottom: 0px; left: 20%; animation-delay: 2s; }
                .floating-icons .icon-4 { bottom: -10px; right: 20%; animation-delay: 3s; }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }


                .form-section {
                    margin-bottom: 1.5rem;
                }

                .form-section label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                
                select, input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ced4da;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-family: var(--font-family);
                }

                .main-btn {
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    background-color: var(--primary-color);
                    color: white;
                    transition: background-color 0.3s;
                }
                .main-btn:hover {
                    background-color: #0056b3;
                }

                .game-container {
                    border: 2px dashed var(--primary-color);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    background-color: var(--light-color);
                }

                .game-container.placeholder {
                    color: var(--secondary-color);
                }
                
                .game-container.welcome h2 { margin-bottom: 0.5rem; }
                .game-container.welcome p { margin-bottom: 2rem; color: var(--secondary-color); }

                .operation-display {
                    font-size: 4rem;
                    font-weight: 700;
                    color: var(--dark-color);
                    margin-bottom: 2rem;
                    min-height: 80px;
                }

                .score {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: auto;
                    color: var(--primary-color);
                }

                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    width: 100%;
                    max-width: 400px;
                    margin-bottom: 2rem;
                }

                .option-btn {
                    padding: 1.5rem;
                    font-size: 1.5rem;
                    border: 2px solid #ced4da;
                    border-radius: 8px;
                    background-color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--dark-color); /* FIX: Asegura que el texto sea visible. */
                }

                .option-btn:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }

                .option-btn.selected {
                    background-color: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .game-btn {
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .game-btn.primary { background-color: var(--primary-color); color: white; }
                .game-btn.primary:hover { background-color: #0056b3; }
                .game-btn.success { background-color: var(--success-color); color: white; }
                .game-btn.success:hover { background-color: #1e7e34; }
                .game-btn.success:disabled { background-color: #6c757d; cursor: not-allowed; }

                /* SweetAlert2 Customizations */
                .swal2-title {
                    font-family: var(--font-family);
                }
                .swal2-html-container {
                    font-family: var(--font-family);
                }
            `}</style>

            {/* --- HTML ESTRUCTURA --- */}
            <div className="app-layout">
                <div className="config-panel">
                    <AnimatedTitle />
                    <div className="form-section">
                        <label htmlFor="level-select">Seleccione el nivel de dificultad:</label>
                        <select id="level-select" value={config.level} onChange={(e) => setConfig({ ...config, level: e.target.value })}>
                            {levels.map(level => (
                                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-section">
                        <label htmlFor="exercise-count">Seleccione el número de ejercicios a realizar:</label>
                        <input
                            type="number"
                            id="exercise-count"
                            value={config.exerciseCount}
                            onChange={(e) => setConfig({ ...config, exerciseCount: Math.max(1, Math.min(availableCount, parseInt(e.target.value) || 1)) })}
                            min="1"
                            max={availableCount}
                            disabled={availableCount === 0}
                        />
                    </div>
                    <button id="preview-btn" className="main-btn" onClick={handleShowPreview}>
                        Vista Previa
                    </button>
                </div>
                <div className="preview-panel">
                    <h2>Vista Previa:</h2>
                    {renderPreviewArea()}
                </div>
            </div>
            <div className="nav-footer">
                <button className="no-rounded-button" onClick={() => navigate(-1)}><IconArrowBack /> Anterior </button>
                <button className="no-rounded-button" onClick={goToSummary}><IconConfigure /> Terminar Configuración <GrLinkNext /></button>
            </div>
        </>
    );
};

export default App;
