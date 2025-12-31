import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { 
  ArrowLeft, Download, Package, CheckCircle, X, Clock, Tag, 
  Home, FileText, Calendar, Monitor, Puzzle, Grid, Layers, 
  Shapes, Type, List, Image as ImageIcon, UploadCloud, 
  Trash2, Play, Info, Timer, Star, RotateCcw, HelpCircle
} from 'lucide-react';

// --- UTILERÍA: Cargar scripts externos ---
const useExternalScripts = (urls) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
                const script = document.createElement('script');
                script.src = url; script.async = true;
                script.onload = resolve; script.onerror = reject;
                document.body.appendChild(script);
            });
        };
        Promise.all(urls.map(loadScript)).then(() => setLoaded(true)).catch(err => console.error(err));
    }, [urls]);
    return loaded;
};

// --- ESTILOS ORIGINALES (Para Configuración y Vista Previa) ---
const CustomStyles = () => (
    <style>
        {`
            /* === ESTILOS GENERALES (ORIGINALES MEMORAMA) === */
            :root {
                --primary-color: #0077b6;
                --primary-hover: #4338ca;
                --secondary-color: #64748b;
                --bg-color: #f8fafc;
                --card-bg: #ffffff;
                --border-color: #e2e8f0;
                --success-color: #0077b6;
                --text-main: #1e293b;
                --text-muted: #64748b;
                --accent-blue: #3b82f6;
                --accent-purple: #8b5cf6;
            }

            /* === TÍTULO === */
            .memorama-title {
                background: linear-gradient(90deg, #4f46e5, #ec4899, #f59e0b, #4f46e5);
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: gradient-flow 5s ease-in-out infinite;
                font-size: 3rem;
                line-height: 1.3; 
                padding-bottom: 0.2em;
                font-weight: 900;
                margin-bottom: 1.5rem;
                text-align: center;
                letter-spacing: -0.02em;
            }
            @media (min-width: 768px) { .memorama-title { font-size: 3.75rem; } }
            @keyframes gradient-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* === ESTILOS DE CARTA (CARD) === */
            .card { perspective: 1000px; width: 6rem; height: 6rem; cursor: pointer; }
            @media (min-width: 768px) { .card { width: 8rem; height: 8rem; } }

            .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
            .card.is-flipped .card-inner { transform: rotateY(180deg); }

            .card-front, .card-back {
                position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden;
                border-radius: 0.75rem; overflow: hidden; border: 2px solid #cbd5e1;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .card-front { background: linear-gradient(135deg, #e0f2fe, #bfdbfe); display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 800; font-size: 1.125rem; letter-spacing: 0.05em; }
            .card-back { background-color: white; transform: rotateY(180deg); display: flex; align-items: center; justify-content: center; }
            .card-back img { width: 100%; height: 100%; object-fit: cover; }

            /* === PANTALLA DE CONFIGURACIÓN (SetupScreen) === */
            .setup-card-container {
                background: var(--card-bg); 
                max-width: 1000px; 
                margin: 0 auto; 
                padding: 2.5rem;
                border-radius: 1.5rem; 
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
                border: 1px solid var(--border-color);
            }
            .setup-title { 
                font-size: 1.5rem; 
                font-weight: 800; 
                color: #0077b6; 
                margin-bottom: 2rem; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 0.75rem; 
            }
            .form-group { margin-bottom: 2rem; }
            .form-label { display: block; font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 0.75rem; }
            .form-select {
                width: 100%; padding: 0.875rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; background-color: #f8fafc;
                color: #1e293b; font-size: 1rem; cursor: pointer; appearance: none;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em;
            }

            .upload-area {
                border: 2px dashed #cbd5e1; border-radius: 1rem; padding: 3rem 2rem; text-align: center; cursor: pointer;
                transition: all 0.3s ease; background-color: #f8fafc; display: flex; flex-direction: column; align-items: center; gap: 1rem;
            }
            .upload-area:hover { border-color: var(--primary-color); background-color: #eef2ff; }
            
            /* === CAJA DE PREVISUALIZACIÓN Y CONTADOR (CORREGIDO FINAL) === */
            .image-preview-box { 
                width: 100%; 
                padding: 1.5rem; 
                border: 1px solid #e2e8f0; 
                border-radius: 1rem; 
                background-color: #ffffff; 
                min-height: 120px; 
                display: flex; 
                flex-wrap: wrap; 
                gap: 1rem; 
            }
            
            /* HEADER DE SELECCIÓN: Alinea Título y Contador */
            .upload-header-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem; /* Espacio antes de la caja */
                width: 100%;
                position: relative; /* Asegura contexto local */
            }

            /* Renombramos la clase para evitar caché de estilos anteriores */
            .counter-badge {
                position: static; /* Forzamos posición estática para que fluya en el flex */
                background-color: #e0f2fe;
                color: #0077b6;
                padding: 0.4rem 0.8rem;
                border-radius: 0.5rem;
                font-size: 0.9rem;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 1px solid #bae6fd;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                white-space: nowrap;
            }

            .preview-image-wrapper { width: 5.5rem; height: 5.5rem; border-radius: 0.75rem; overflow: hidden; cursor: pointer; position: relative; border: 2px solid transparent; }
            .preview-image-wrapper.selected { border-color: var(--primary-color); transform: scale(1.05); }
            .preview-image { width: 100%; height: 100%; object-fit: cover; }
            
            .button-container { display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-top: 2.5rem; justify-content: center; }
            @media (min-width: 640px) { .button-container { flex-direction: row; } }
            
            .btn { 
                padding: 0.875rem 1.75rem; 
                border-radius: 0.75rem; 
                font-weight: 600; 
                cursor: pointer; 
                display: inline-flex; 
                align-items: center; 
                gap: 0.6rem; 
                font-size: 1rem; 
                border: 1px solid transparent; 
                white-space: nowrap; 
            }
            
            /* ESTILO PARA BOTONES DESACTIVADOS (Gris uniforme) */
            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                background-color: #cbd5e1 !important;
                color: #64748b !important;
                border-color: transparent !important;
                box-shadow: none;
            }

            .btn-secondary { border-color: #e2e8f0; color: #64748b; background-color: white; }
            .btn-primary { background-color: var(--primary-color); color: #ffffff; }
            .btn-success { background-color: var(--success-color); color: white; }

            /* === PANTALLA DE JUEGO (GameScreen) === */
            .game-stats-header {
                background: white; padding: 1.25rem 2rem; border-radius: 1rem; margin-bottom: 2rem;
                display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
                gap: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
            }
            .stats-item { font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem; }
            .stats-label { font-weight: 700; color: #475569; text-transform: uppercase; font-size: 0.875rem; }
            .stats-value { font-weight: 600; color: #1e293b; }
            .game-instructions { text-align: center; color: #64748b; margin-bottom: 2rem; font-size: 1.1rem; }
            .preview-controls { display: flex; gap: 1rem; justify-content: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
        `}
    </style>
);

// --- ESTILOS NUEVOS (SOLO PARA SUMMARY) ---
const summaryStyles = `
    .summary-screen {
        font-family: 'Nunito', sans-serif;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem;
        background: #ffffff;
        color: #1f2937;
        border-radius: 1.5rem;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
    }
    .selection-title {
        text-align: center;
        color: #0077b6;
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
    .btn-blue {
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
        background: #0077b6;
        color: white;
        font-size: 1rem;
    }
    .btn-blue:hover:not(:disabled) {
        background: #004a73;
        transform: translateY(-1px);
    }
    .btn-blue:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    /* Grid Helpers */
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; alignItems: center; text-align: center; }
    
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
`;

// --- CONFIGURACIÓN DE NIVELES ---
const DIFFICULTY_LEVELS = {
    'Básico': { pairs: 3, time: 15, name: 'Básico: 3 imágenes - Tiempo 15 segundos' },
    'Intermedio': { pairs: 4, time: 20, name: 'Intermedio: 4 imágenes - Tiempo 20 segundos' },
    'Avanzado': { pairs: 5, time: 30, name: 'Avanzado: 5 imágenes - Tiempo 30 segundos' }
};

// --- Función para barajar las cartas ---
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// --- Componente de Carta (ORIGINAL) ---
const Card = ({ card, onCardClick }) => {
    const handleClick = () => {
        if (!card.isFlipped && !card.isMatched) {
            onCardClick(card);
        }
    };

    return (
        <div 
            className={`card ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}
            onClick={handleClick}
        >
            <div className="card-inner">
                <div className="card-front">
                    <span>STEAM-G</span>
                </div>
                <div className="card-back">
                    <img src={card.imageUrl} alt="Carta de memorama" />
                </div>
            </div>
        </div>
    );
};

// --- Componente Pantalla de Configuración (MODIFICADO) ---
const SetupScreen = ({ onStartGame, onFinish, initialDifficulty = 'Básico', initialImages = [], initialSelected = [] }) => {
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [images, setImages] = useState(initialImages);
    const [selectedImages, setSelectedImages] = useState(initialSelected);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const requiredImages = DIFFICULTY_LEVELS[difficulty].pairs;
    const isReady = !loading && images.length >= requiredImages && selectedImages.length === requiredImages;

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
        setSelectedImages([]);
        setError(null);
    };

    const handleUploadClick = () => fileInputRef.current && fileInputRef.current.click();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.name.endsWith('.zip')) {
            setError('Por favor, sube un archivo .zip válido.');
            return;
        }
        setLoading(true); setError(null); setImages([]); setSelectedImages([]);
        try {
            const zip = await window.JSZip.loadAsync(file);
            const imagePromises = [];
            let imageIdCounter = 0;
            zip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir && /\.(jpe?g|png|gif|webp)$/i.test(zipEntry.name)) {
                    const promise = zipEntry.async('base64').then(base64Data => {
                        const extension = zipEntry.name.split('.').pop().toLowerCase();
                        let mimeType = 'image/jpeg';
                        if (extension === 'png') mimeType = 'image/png';
                        else if (extension === 'gif') mimeType = 'image/gif';
                        else if (extension === 'webp') mimeType = 'image/webp';
                        const url = `data:${mimeType};base64,${base64Data}`;
                        return { id: imageIdCounter++, url, name: zipEntry.name };
                    });
                    imagePromises.push(promise);
                }
            });
            const loadedImages = await Promise.all(imagePromises);
            setImages(loadedImages);
            if (loadedImages.length === 0) setError('El archivo .zip no contiene imágenes válidas.');
            else if (loadedImages.length < requiredImages) setError(`El .zip solo tiene ${loadedImages.length} imágenes. Se necesitan al menos ${requiredImages}.`);
        } catch (err) {
            console.error("Error al leer el ZIP:", err);
            setError('Hubo un error al procesar el archivo .zip.');
        } finally {
            setLoading(false); event.target.value = null; 
        }
    };

    const handleClearImages = () => {
        setImages([]); setSelectedImages([]); setError(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleImageClick = (image) => {
        setError(null);
        const isSelected = selectedImages.some(img => img.id === image.id);
        if (isSelected) setSelectedImages(prev => prev.filter(img => img.id !== image.id));
        else if (selectedImages.length < requiredImages) setSelectedImages(prev => [...prev, image]);
        else setError(`Solo puedes seleccionar ${requiredImages} imágenes para el nivel ${difficulty}.`);
    };

    const handleStartClick = () => {
        if (!isReady) {
            setError(`Debes seleccionar exactamente ${requiredImages} imágenes.`);
            return;
        }
        onStartGame(difficulty, selectedImages, images);
    };

    const handleFinishClick = () => {
        if (!isReady) {
            setError(`Debes seleccionar exactamente ${requiredImages} imágenes.`);
            return;
        }
        onFinish(difficulty, selectedImages, images);
    };
    
    return (
        <div className="setup-card-container">
            <h2 className="setup-title"><Grid size={28} color="#0077b6"/> Configuración del Juego</h2>
            <div className="form-group">
                <label htmlFor="difficulty" className="form-label">Seleccione el nivel de dificultad:</label>
                <select id="difficulty" value={difficulty} onChange={handleDifficultyChange} className="form-select">
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Subir imágenes del juego</label>
                <div className="upload-area" onClick={handleUploadClick}>
                    <UploadCloud size={64} className="upload-icon" />
                    <div><p className="upload-text">Cargar imágenes (Debe agregar las imágenes en archivo .zip)</p></div>
                    <input type="file" ref={fileInputRef} className="hidden" style={{display:'none'}} accept=".zip" onChange={handleFileChange}/>
                </div>
            </div>
            
            {/* SECCIÓN CORREGIDA: Header de selección con distribución Flex */}
            <div className="form-group">
                <div className="upload-header-row">
                    <label className="form-label" style={{marginBottom: 0}}>Archivos subidos ({images.length})</label>
                    {images.length > 0 && (
                        <div className="counter-badge">
                            <CheckCircle size={16} /> Imágenes seleccionadas: {selectedImages.length} / {requiredImages}
                        </div>
                    )}
                </div>
                
                <div className="image-preview-box">
                    {loading && <p className="status-text">Procesando archivo ZIP...</p>}
                    {!loading && images.length === 0 && !error && <div className="status-text"><ImageIcon size={32} /> <p>Aquí puedes visualizar las imágenes que seleccionaste.</p></div>}
                    
                    {images.map(img => {
                        const isSelected = selectedImages.some(selImg => selImg.id === img.id);
                        return (
                            <div key={img.id} className={`preview-image-wrapper ${isSelected ? 'selected' : ''}`} onClick={() => handleImageClick(img)}>
                                <img src={img.url} alt={img.name} className="preview-image" />
                                {isSelected && <div style={{position:'absolute',top:2,right:2,background:'#0077b6',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center'}}><CheckCircle size={14} color="white"/></div>}
                            </div>
                        );
                    })}
                    {error && <div className="error-text" style={{width:'100%',padding:'0.5rem',background:'#fef2f2',borderRadius:'0.5rem',color:'#ef4444'}}><X size={18}/> {error}</div>}
                </div>
            </div>

            <div className="button-container">
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                    <ArrowLeft size={18} /> Anterior
                </button>
                <button onClick={handleClearImages} className="btn btn-primary" disabled={images.length === 0}>
                    <Trash2 size={18}/> Eliminar Imágenes
                </button>
                <button onClick={handleStartClick} disabled={!isReady} className="btn btn-primary">
                    Vista Previa <Play size={18}/>
                </button>
                <button onClick={handleFinishClick} disabled={!isReady} className="btn btn-success">
                    Terminar Configuración <CheckCircle size={18}/>
                </button>
            </div>
        </div>
    );
};

// --- Componente Pantalla de Juego (MODIFICADO: Sin botón Terminar) ---
const GameScreen = ({ difficulty, images, onGameEnd, onBack }) => {
    const gameConfig = DIFFICULTY_LEVELS[difficulty];
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameConfig.time);
    const [isChecking, setIsChecking] = useState(false);
    const timerRef = useRef(null);
    const gameEndedRef = useRef(false);

    useEffect(() => {
        const gameCards = images.flatMap(img => {
            const cardBase = { imageId: img.id, imageUrl: img.url, isFlipped: false, isMatched: false };
            return [{ ...cardBase, id: `${img.id}-a` }, { ...cardBase, id: `${img.id}-b` }];
        });
        setCards(shuffleArray(gameCards));
        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [images, gameConfig]);

    useEffect(() => {
        if (timeLeft === 0 && !gameEndedRef.current) {
            gameEndedRef.current = true;
            clearInterval(timerRef.current);
            window.Swal.fire({ title: '¡Tiempo agotado!', text: `Tu puntuación: ${score}.`, icon: 'warning', confirmButtonText: 'Reiniciar' }).then(onGameEnd);
        }
    }, [timeLeft, score, onGameEnd]);

    useEffect(() => {
        if (flippedCards.length === 2 && !gameEndedRef.current) {
            setIsChecking(true);
            const [firstCard, secondCard] = flippedCards;
            if (firstCard.imageId === secondCard.imageId && firstCard.id !== secondCard.id) {
                setTimeout(() => {
                    setScore(prev => prev + 10);
                    setCards(prev => prev.map(c => c.imageId === firstCard.imageId ? { ...c, isMatched: true } : c));
                    window.Swal.fire({ title: '¡Muy bien!', icon: 'success', timer: 1000, showConfirmButton: false });
                    setFlippedCards([]); setIsChecking(false);
                }, 500);
            } else {
                setTimeout(() => {
                    window.Swal.fire({ title: 'Incorrecto', icon: 'error', timer: 1000, showConfirmButton: false });
                    setTimeout(() => {
                        setCards(prev => prev.map(c => !c.isMatched && (c.id === firstCard.id || c.id === secondCard.id) ? { ...c, isFlipped: false } : c));
                        setFlippedCards([]); setIsChecking(false);
                    }, 1000);
                }, 1000);
            }
        }
    }, [flippedCards]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched) && !gameEndedRef.current) {
            gameEndedRef.current = true;
            clearInterval(timerRef.current);
            window.Swal.fire({ title: '¡Felicidades!', html: `Total: <strong>${score} Puntos</strong>`, icon: 'success', confirmButtonText: 'Finalizar Juego' }).then(onGameEnd);
        }
    }, [cards, score, onGameEnd]);

    const handleCardClick = (clickedCard) => {
        if (isChecking || flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched || gameEndedRef.current) return;
        if (flippedCards.length === 1 && flippedCards[0].id === clickedCard.id) return;
        setCards(prev => prev.map(c => c.id === clickedCard.id ? { ...c, isFlipped: true } : c));
        setFlippedCards(prev => [...prev, { ...clickedCard, isFlipped: true }]);
    };
    
    return (
        <div className="w-full">
            <div className="game-stats-header">
                <div className="stats-item"><span className="stats-label"><Grid size={18}/> Nivel:</span><span className="stats-value">{difficulty}</span></div>
                <div className="stats-item"><span className="stats-label"><Clock size={18}/> Tiempo:</span><span className="stats-value">{Math.floor(timeLeft/60).toString().padStart(2,'0')}:{ (timeLeft%60).toString().padStart(2,'0') }</span></div>
                <div className="stats-item"><span className="stats-label"><CheckCircle size={18}/> Puntaje:</span><span className="stats-value">{score}</span></div>
            </div>
            <p className="game-instructions">Encuentra todos los pares de cartas antes de que se acabe el tiempo.</p>
            <div className="p-4" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: `repeat(${gameConfig.pairs === 3 ? 3 : (gameConfig.pairs === 4 ? 4 : 5)}, minmax(0, 1fr))`, maxWidth: gameConfig.pairs === 3 ? '450px' : (gameConfig.pairs === 4 ? '600px' : '800px'), margin: '0 auto', justifyItems: 'center' }}>
                {cards.map(card => <Card key={card.id} card={card} onCardClick={handleCardClick} />)}
            </div>
            <div className="preview-controls">
                <button onClick={onBack} className="btn btn-primary"><ArrowLeft size={18} /> Volver</button>
            </div>
        </div>
    );
};

// --- GENERADOR HTML (MODIFICADO: INCLUYE BOTONES INFO/SALIR Y RETRASO) ---
const generateMemoramaCode = (difficulty, images, gameDetails, selectedPlatforms) => {
    const config = DIFFICULTY_LEVELS[difficulty];
    const imagesJson = JSON.stringify(images);
    
    const formattedDate = gameDetails.date 
        ? new Date(gameDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Fecha no especificada';
    
    const icons = {
        grid: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
        clock: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`
    };

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Memorama'}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* === ESTILOS EXACTOS DE LA VISTA PREVIA + EXTRAS === */
        :root {
            --primary-color: #0077b6;
            --primary-hover: #4338ca;
            --secondary-color: #64748b;
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
            --success-color: #0077b6;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --red-exit: #ef4444;
        }

        body { font-family: 'Nunito', sans-serif; background-color: var(--bg-color); color: var(--text-main); margin: 0; padding: 20px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }

        .card { perspective: 1000px; width: 6rem; height: 6rem; cursor: pointer; position: relative; }
        @media (min-width: 768px) { .card { width: 8rem; height: 8rem; } }

        .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .card.is-flipped .card-inner { transform: rotateY(180deg); }
        .card.is-matched .card-inner { transform: rotateY(180deg); }

        .card-front, .card-back {
            position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden;
            border-radius: 0.75rem; overflow: hidden; border: 2px solid #cbd5e1;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .card-front { background: linear-gradient(135deg, #e0f2fe, #bfdbfe); display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 800; font-size: 1.125rem; letter-spacing: 0.05em; }
        .card-back { background-color: white; transform: rotateY(180deg); display: flex; align-items: center; justify-content: center; }
        .card-back img { width: 100%; height: 100%; object-fit: cover; }

        .game-stats-header {
            background: white; padding: 1.25rem 2rem; border-radius: 1rem; margin-bottom: 2rem;
            display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
            gap: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
            width: 100%; max-width: 800px; box-sizing: border-box;
        }
        .stats-item { font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem; }
        .stats-label { font-weight: 700; color: #475569; text-transform: uppercase; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; }
        .stats-value { font-weight: 600; color: #1e293b; }
        
        .game-instructions { text-align: center; color: #64748b; margin-bottom: 2rem; font-size: 1.1rem; }

        .memorama-grid { display: grid; gap: 1rem; margin: 0 auto; justify-items: center; }
        
        .control-btn { 
            padding: 0.875rem 1.75rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; 
            display: inline-flex; justify-content: center; align-items: center; gap: 0.6rem; 
            font-size: 1rem; border: none; background-color: var(--primary-color); color: #ffffff;
            margin-top: 2rem;
        }
        .control-btn:hover { opacity: 0.9; }

        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box; }
        .hidden { display: none !important; opacity: 0; pointer-events: none; }
        
        .overlay h1 { color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1rem; font-weight: 900; text-align: center; }
        .overlay p { color: var(--text-muted); font-size: 1.2rem; margin-bottom: 2rem; }
        
        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary-color); color: white; border: none; border-radius: 0.75rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; margin: 0.5rem; }
        .big-btn:hover { transform: translateY(-2px); }
        
        .btn-secondary { background: white; color: var(--primary-color); border: 2px solid var(--primary-color); }
        .btn-exit { background: var(--secondary-color); color: white; }
        .btn-exit:hover { background: #475569; }

        .countdown-number { font-size: 8rem; font-weight: 900; color: var(--primary-color); animation: popIn 0.5s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        /* Modal Info */
        .info-modal-content { background: white; padding: 2.5rem; border-radius: 1.5rem; max-width: 600px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; position: relative; text-align: center; }
        .info-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0; text-align: left; }
        .info-item { background: #f8fafc; padding: 0.8rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; display: block; }
        .info-val { font-size: 1rem; color: #334155; font-weight: 600; }
        .info-desc { grid-column: 1 / -1; font-size: 0.95rem; color: #475569; line-height: 1.5; margin-top: 1rem; }
        .close-info-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .close-info-btn:hover { color: var(--red-exit); }

        /* === TÍTULO ANIMADO === */
        .memorama-title {
            background: linear-gradient(90deg, #4f46e5, #ec4899, #f59e0b, #4f46e5);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: gradient-flow 5s ease-in-out infinite;
            /* CORRECCIÓN: Ajuste de line-height y padding en el HTML generado */
            font-size: 3rem;
            line-height: 1.3;
            padding-bottom: 0.2em;
            font-weight: 900;
            margin-bottom: 0.5rem;
            text-align: center;
            letter-spacing: -0.02em;
        }
        @media (min-width: 768px) { .memorama-title { font-size: 3.75rem; } }
        @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    </style>
</head>
<body>
    <!-- PANTALLA INICIO -->
    <div id="start-screen" class="overlay">
        <h1>${gameDetails.gameName || 'Memorama'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; margin-bottom: 2rem; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.05em;">
            Nivel: ${difficulty}
        </div>
        <p>Encuentra los pares antes de que acabe el tiempo.</p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <button class="big-btn" onclick="startGameSequence()">▶ Iniciar Juego</button>
            <button class="big-btn btn-secondary" onclick="toggleInfo(true)">ℹ Información</button>
        </div>
    </div>

    <!-- CUENTA REGRESIVA -->
    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>

    <!-- MODAL INFO -->
    <div id="info-overlay" class="overlay hidden" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 100;">
        <div class="info-modal-content">
            <button class="close-info-btn" onclick="toggleInfo(false)">&times;</button>
            <h2 style="color:var(--primary-color); margin:0;">Información</h2>
            <div class="info-details-grid">
                <div class="info-item"><span class="info-label">Juego</span><span class="info-val">${gameDetails.gameName}</span></div>
                <div class="info-item"><span class="info-label">Versión</span><span class="info-val">${gameDetails.version}</span></div>
                <div class="info-item"><span class="info-label">Dificultad</span><span class="info-val">${difficulty}</span></div>
                <div class="info-item"><span class="info-label">Tiempo</span><span class="info-val">${config.time}s</span></div>
            </div>
            <h3 style="color:var(--primary-color); font-size:1.1rem; margin:1.5rem 0 0.5rem 0;">Descripción</h3>
            <div class="info-desc">${gameDetails.description}</div>
            <button class="big-btn" style="margin-top:1.5rem; font-size:1rem;" onclick="toggleInfo(false)">Cerrar</button>
        </div>
    </div>

    <!-- PANTALLA FINAL -->
    <div id="end-screen" class="overlay hidden">
        <h1 id="end-title" style="font-size:3rem;">Juego Terminado</h1>
        <h2 style="color:var(--text-main); font-size:2rem; margin:1rem 0;">Puntaje Final: <span id="final-score" style="color:var(--primary-color)">0</span></h2>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
            <button class="big-btn btn-exit" onclick="exitGame()">Finalizar Juego</button>
            <button class="big-btn" onclick="location.reload()">Volver a Jugar</button>
        </div>
    </div>

    <!-- JUEGO UI -->
    <div class="game-layout hidden" id="game-ui" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
        
        <h1 class="memorama-title">MEMORAMA</h1>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0077b6; margin-bottom: 1.5rem;">Nivel: ${difficulty}</h2>

        <div class="game-stats-header">
            <div class="stats-item"><span class="stats-label">${icons.grid} Nivel:</span><span class="stats-value">${difficulty}</span></div>
            <div class="stats-item"><span class="stats-label">${icons.clock} Tiempo:</span><span class="stats-value" id="timer-display">00:00</span></div>
            <div class="stats-item"><span class="stats-label">${icons.check} Puntaje:</span><span class="stats-value" id="score">0</span></div>
        </div>
        <p class="game-instructions">Encuentra todos los pares de cartas antes de que se acabe el tiempo.</p>
        <div class="memorama-grid" id="grid-container" style="
            grid-template-columns: repeat(${config.pairs === 3 ? 3 : (config.pairs === 4 ? 4 : 5)}, minmax(0, 1fr));
            max-width: ${config.pairs === 3 ? '450px' : (config.pairs === 4 ? '600px' : '800px')};
        "></div>
        <button class="control-btn" onclick="finishGame(false)">Terminar Juego</button>
    </div>

    <script>
        const INITIAL_IMAGES = ${imagesJson};
        const GAME_CONFIG = ${JSON.stringify(config)};
        let state = { score: 0, timeLeft: GAME_CONFIG.time, timer: null, cards: [], flipped: [], checking: false, matchedCount: 0 };

        function toggleInfo(show) {
            const modal = document.getElementById('info-overlay');
            if(show) { modal.classList.remove('hidden'); modal.style.display='flex'; }
            else { modal.classList.add('hidden'); setTimeout(()=>modal.style.display='none',300); }
        }

        function exitGame() { 
            window.close(); 
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;font-family:sans-serif;text-align:center;"><h1>Juego Finalizado</h1><p>Ya puedes cerrar esta pestaña.</p></div>'; 
        }

        function startGameSequence() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 3;
            const display = document.getElementById('countdown-display');
            display.innerText = count;
            const interval = setInterval(() => {
                count--;
                if(count > 0) {
                    display.innerText = count;
                    display.style.animation = 'none';
                    display.offsetHeight; display.style.animation = 'popIn 0.5s ease-out';
                } else {
                    clearInterval(interval);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    startGame();
                }
            }, 1000);
        }

        function startGame() {
            document.getElementById('game-ui').classList.remove('hidden');
            document.getElementById('game-ui').style.display = 'flex';
            initBoard();
            startTimer();
        }

        function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

        function initBoard() {
            const gameCards = [];
            INITIAL_IMAGES.forEach(img => {
                gameCards.push({ id: img.id + '-a', imgId: img.id, url: img.url });
                gameCards.push({ id: img.id + '-b', imgId: img.id, url: img.url });
            });
            state.cards = shuffle(gameCards);
            const grid = document.getElementById('grid-container');
            grid.innerHTML = '';
            state.cards.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = 'card'; 
                cardEl.id = card.id;
                cardEl.innerHTML = \`
                    <div class="card-inner">
                        <div class="card-front"><span>STEAM-G</span></div>
                        <div class="card-back"><img src="\${card.url}" /></div>
                    </div>
                \`;
                cardEl.onclick = () => handleCardClick(card, cardEl);
                grid.appendChild(cardEl);
            });
            updateTimerDisplay();
        }

        function handleCardClick(cardData, cardEl) {
            if(state.checking || cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched') || state.timeLeft <= 0) return;
            
            cardEl.classList.add('is-flipped');
            state.flipped.push({ data: cardData, el: cardEl });

            if(state.flipped.length === 2) {
                state.checking = true;
                checkMatch();
            }
        }

        function checkMatch() {
            const [c1, c2] = state.flipped;
            if(c1.data.imgId === c2.data.imgId) {
                setTimeout(() => {
                    state.score += 10;
                    document.getElementById('score').innerText = state.score;
                    c1.el.classList.add('is-matched');
                    c2.el.classList.add('is-matched');
                    state.matchedCount++;
                    state.flipped = [];
                    state.checking = false;
                    Swal.fire({ icon: 'success', title: '¡Bien!', timer: 800, showConfirmButton: false });
                    if(state.matchedCount === GAME_CONFIG.pairs) finishGame(true);
                }, 700);
            } else {
                setTimeout(() => {
                    Swal.fire({ icon: 'error', title: 'Incorrecto', timer: 800, showConfirmButton: false });
                    setTimeout(() => {
                        c1.el.classList.remove('is-flipped');
                        c2.el.classList.remove('is-flipped');
                        state.flipped = [];
                        state.checking = false;
                    }, 800);
                }, 1000);
            }
        }

        function updateTimerDisplay() {
            const min = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
            const sec = (state.timeLeft % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').innerText = min + ':' + sec;
        }

        function startTimer() {
            updateTimerDisplay();
            state.timer = setInterval(() => {
                state.timeLeft--;
                updateTimerDisplay();
                if(state.timeLeft <= 0) finishGame(false);
            }, 1000);
        }

        function finishGame(win) {
            clearInterval(state.timer);
            document.getElementById('game-ui').classList.add('hidden');
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('end-title').innerText = win ? "¡Felicidades!" : "Tiempo Agotado";
            document.getElementById('final-score').innerText = state.score;
        }
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY (ESTILO ACERTIJO - NUEVO) ---
const Summary = ({ difficulty, images, onReset, onBack }) => {
    // Estados para la descarga (inline, sin modal, igual a Acertijo)
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    const [jsZipReady, setJsZipReady] = useState(false);
    
    const location = useLocation();
    const state = location.state;

    // Datos Mock o Reales desde location.state
    const MOCK_DATA = {
        selectedAreas: ['Ciencia', 'Lógica'],
        selectedSkills: ['Memoria Visual', 'Atención', 'Concentración'],
        gameDetails: {
          gameName: "Memorama Educativo",
          description: "Juego de memoria donde debes encontrar los pares correspondientes.",
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

    // Cargar JSZip dinámicamente si no existe
    useEffect(() => {
        if(window.JSZip) { setJsZipReady(true); return; }
        const s = document.createElement('script'); 
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=()=>setJsZipReady(true); 
        document.body.appendChild(s);
    }, []);

    // Helpers
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
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-ES',{year:'numeric',month:'long',day:'numeric'}) : 'No definida';

    // Manejo de Descarga (Inline)
    const handleDownload = () => {
        if(isGenerating || !jsZipReady) return;
        setIsGenerating(true); setProgress(0); setStatusText("Iniciando...");
        
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10;
            if(p > 90) { clearInterval(interval); generateZip(); }
            else { setProgress(Math.floor(p)); setStatusText(p<40 ? "Generando HTML..." : "Comprimiendo imágenes..."); }
        }, 200);
    };

    const generateZip = async () => {
        try {
            const zip = new window.JSZip();
            const html = generateMemoramaCode(difficulty, images, gameDetails, selectedPlatforms);
            zip.file("Memorama.html", html); // Nombre solicitado: Memorama.html
            
            const blob = await zip.generateAsync({type:"blob"});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Memorama-${difficulty}.zip`;
            link.click();
            
            setProgress(100); setStatusText("¡Listo!");
            setTimeout(() => { setIsGenerating(false); setProgress(0); }, 2000);
        } catch(e) { console.error(e); setIsGenerating(false); }
    };

    return (
        <div className="summary-screen">
            <style>{summaryStyles}</style>

            <h2 style={{color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <CheckCircle size={32} color="#22c55e" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu juego ha sido configurado correctamente.</p>
            
            <h1 className="selection-title">Resumen de Configuración</h1>

            {/* CORRECCIÓN: Aumentado el ancho interno de 800px a 1100px */}
            <div style={{maxWidth:'1100px', margin:'0 auto'}}>
                {/* GRID DE DETALLES PRINCIPALES */}
                <div className="info-grid">
                    <div className="info-card"><div className="info-card-header"><Tag size={16}/> Nombre</div><div className="info-card-value">{gameDetails.gameName}</div></div>
                    <div className="info-card"><div className="info-card-header"><Layers size={16}/> Versión</div><div className="info-card-value">{gameDetails.version}</div></div>
                    <div className="info-card full-width"><div className="info-card-header"><FileText size={16}/> Descripción</div><div className="info-card-value" style={{fontSize:'1rem'}}>{gameDetails.description}</div></div>
                    <div className="info-card"><div className="info-card-header"><Calendar size={16}/> Fecha</div><div className="info-card-value">{formatDate(gameDetails.date)}</div></div>
                    <div className="info-card"><div className="info-card-header"><Monitor size={16}/> Plataformas</div><div className="info-card-value">{selectedPlatforms?.length>0?selectedPlatforms.join(', '):'Web'}</div></div>
                </div>

                <hr style={{border:'none', borderTop:'1px solid #e2e8f0', margin:'2.5rem 0'}}/>

                {/* AREAS Y HABILIDADES (Estilo Acertijo) */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'2rem'}}>
                    <div className="info-card" style={{borderLeft:'4px solid #3b82f6', alignItems:'flex-start'}}>
                        <h4 style={{display:'flex', gap:'0.5rem', color:'#0077b6', margin:'0 0 1rem 0'}}><Shapes size={20} color="#3b82f6"/> Áreas</h4>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                            {selectedAreas?.map(a=><span key={a} style={{background:'#eff6ff', color:'#1e40af', padding:'0.4rem', borderRadius:'0.5rem', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'5px'}}><img src={getAreaIcon(a)} width="16"/>{getAreaName(a)}</span>)}
                        </div>
                    </div>
                    <div className="info-card" style={{borderLeft:'4px solid #8b5cf6', alignItems:'flex-start', textAlign: 'left'}}>
                        <h4 style={{display:'flex', gap:'0.5rem', color:'#0077b6', margin:'0 0 1rem 0'}}><Puzzle size={20} color="#8b5cf6"/> Habilidades</h4>
                        <ul style={{paddingLeft:'1.2rem', margin:0, color:'#334155'}}>{selectedSkills?.map(s=><li key={s}>{s}</li>)}</ul>
                    </div>
                </div>
            </div>

            {/* DETALLES ESPECÍFICOS DEL MEMORAMA */}
            <div className="summary-card">
                <h3 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', color:'#0077b6'}}>Parámetros del Juego</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem'}}>
                    <div className="summary-row" style={{flexDirection:'row', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'#f8fafc', borderRadius:'8px'}}>
                        <Grid size={18} color="#64748b"/> Dificultad: <strong style={{color:'#0077b6'}}>{difficulty}</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection:'row', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'#f8fafc', borderRadius:'8px'}}>
                        <Clock size={18} color="#64748b"/> Tiempo: <strong style={{color:'#0077b6'}}>{DIFFICULTY_LEVELS[difficulty].time} segundos</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection:'row', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'#f8fafc', borderRadius:'8px'}}>
                        <List size={18} color="#64748b"/> Pares: <strong style={{color:'#0077b6'}}>{DIFFICULTY_LEVELS[difficulty].pairs}</strong>
                    </div>
                </div>
                
                <div style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #eee'}}>
                    <p style={{marginBottom:'0.5rem', fontWeight:'bold', color:'#334155'}}>Imágenes Cargadas:</p>
                    <div style={{display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem'}}>
                        {images.map((img,i)=><img key={i} src={img.url} style={{width:'40px', height:'40px', borderRadius:'4px', border:'1px solid #eee', objectFit:'cover'}} alt="thumb"/>)}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-blue" onClick={onBack} disabled={isGenerating} style={{opacity: isGenerating?0.6:1}}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            {/* SECCIÓN DE DESCARGA (Estilo Acertijo) */}
            <div className="download-section">
                <div style={{textAlign:'center', width:'100%', maxWidth:'600px'}}>
                    <h3 style={{color:'#0077b6'}}>Descargar Paquete del Juego</h3>
                    <p style={{color:'#64748b', marginBottom:'1.5rem'}}>Genera el archivo .zip listo para ser descargado en su computadora.</p>
                    
                    {isGenerating && (
                        <div style={{width:'100%', margin:'0 auto 1rem'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.5rem'}}>
                                <span>{statusText}</span><span>{progress}%</span>
                            </div>
                            <div style={{height:'10px', background:'#e2e8f0', borderRadius:'5px', overflow:'hidden'}}>
                                <div style={{width:`${progress}%`, height:'100%', background:'#0077b6', transition:'width 0.3s'}}></div>
                            </div>
                        </div>
                    )}
                </div>
                
                <button 
                    className="btn-blue" 
                    onClick={handleDownload} 
                    disabled={isGenerating || !jsZipReady} 
                    style={{minWidth:'200px', backgroundColor: (isGenerating||!jsZipReady)?'#94a3b8':'#0077b6'}}
                >
                    {isGenerating ? 'Generando...' : <><Download size={18}/> Generar (.zip)</>}
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function GeneradorMemorama() {
    const libsLoaded = useExternalScripts([
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11'
    ]);
    const navigate = useNavigate();
    const location = useLocation();

    // Estados
    const [gameScreen, setGameScreen] = useState('setup'); 
    const [difficulty, setDifficulty] = useState('Básico'); // Iniciar con valor
    const [gameImages, setGameImages] = useState([]);
    
    // NUEVO: Estado para persistir todas las imágenes cargadas (no solo las seleccionadas)
    const [uploadedImages, setUploadedImages] = useState([]);

    // Scroll to top effect when screen changes or component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [gameScreen]);

    // Modificado: Acepta también todas las imágenes cargadas para guardarlas
    const handleStartPreview = (selectedDifficulty, selectedImages, allImages) => {
        setDifficulty(selectedDifficulty);
        setGameImages(selectedImages);
        setUploadedImages(allImages); // Guardamos la colección completa
        setGameScreen('play');
    };

    // NUEVO: Handler para terminar configuración directamente desde Setup
    const handleFinishFromSetup = (selectedDifficulty, selectedImages, allImages) => {
        setDifficulty(selectedDifficulty);
        setGameImages(selectedImages);
        setUploadedImages(allImages);
        setGameScreen('summary');
        navigate('/settings?view=summary', { 
            replace: true,
            state: location.state
        });
    };

    const handleBackToSetup = () => {
        setGameScreen('setup');
    };

    // Nuevo handler para regresar a settings desde Summary
    const handleBackFromSummary = () => {
        setGameScreen('setup'); 
        navigate('/settings', { state: location.state, replace: true });
        window.scrollTo(0, 0);
    };

    const handleFinishConfiguration = () => {
        setGameScreen('summary');
        navigate('/settings?view=summary', { 
            replace: true,
            state: location.state
        });
    };

    const handleReset = () => {
        setGameScreen('setup');
        setDifficulty('Básico');
        setGameImages([]);
        setUploadedImages([]); // Limpiar todo si el usuario quiere reiniciar explícitamente
    };

    if (!libsLoaded) {
        return (
            <div className="w-full flex justify-center items-center h-screen flex-col">
                <h1 className="text-xl font-bold mb-4">Cargando recursos...</h1>
            </div>
        );
    }

    return (
        <div className="w-full">
            <CustomStyles />
            
            <h1 className="memorama-title">
                MEMORAMA
            </h1>
            
            <div className="w-full">
                {gameScreen === 'setup' && (
                    <SetupScreen 
                        onStartGame={handleStartPreview}
                        onFinish={handleFinishFromSetup}
                        // Pasamos el estado guardado al volver a montar el componente
                        initialDifficulty={difficulty}
                        initialImages={uploadedImages}
                        initialSelected={gameImages}
                    />
                )}
                
                {gameScreen === 'play' && (
                    <GameScreen 
                        difficulty={difficulty} 
                        images={gameImages} 
                        onGameEnd={handleBackToSetup}
                        onBack={handleBackToSetup}
                    />
                )}

                {gameScreen === 'summary' && (
                    <Summary 
                        difficulty={difficulty} 
                        images={gameImages}
                        onReset={handleReset}
                        onBack={handleBackFromSummary}
                    />
                )}
            </div>
        </div>
    );
}