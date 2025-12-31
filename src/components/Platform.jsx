import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Componentes de iconos SVG (sin cambios) ---
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
const IconGamepad = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M421.1 64H90.9C40.7 64 0 104.7 0 154.9V357.1C0 407.3 40.7 448 90.9 448H421.1C471.3 448 512 407.3 512 357.1V154.9C512 104.7 471.3 64 421.1 64zM160 288h-32v-32h-32v-64h32V160h32v32h32v64h-32v32zm192 32c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>;
const IconCodeBranch = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.5-5.4 32.8-14.2 47.2-20.3 32.5-51.5 53.6-88.6 57.8-1.2 6-2.5 11.9-4.2 17.6-18.3 59.5-77.3 93.4-138.5 75.1-61.2-18.3-95.1-77.3-76.8-138.5 18.3-61.2 77.3-95.1 138.5-76.8 4.2 1.2 8.3 2.5 12.3 4.2.1-17.1.1-34.2 0-51.3-4.2-1.2-8.3-2.5-12.3-4.2C35.8 256 1.9 197 20.2 135.8 38.5 74.6 97.5 40.7 158.7 59.1c54.3 16.2 87.7 67.8 81.3 121.3-.3 1.1-.6 2.2-1 3.3 14.2-4.1 28.9-6.7 44-7.5 1-.6 2-1.2 3-1.8 20.3-11.4 34.2-31.5 38.2-53.9C360.7 211.1 384 179.6 384 144zM64 240c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm256-96c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40z"></path></svg>;
const IconFile = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM336 480H48V48h160v104c0 13.3 10.7 24 24 24h104v204z"></path></svg>;

const Platform = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const selectedGame = state?.selectedGame;

    // --- NUEVO CÓDIGO AÑADIDO ---
    // Fuerza el scroll al inicio (top) cada vez que se carga este componente
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // ----------------------------

    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    
    // --- ESTADO RESTAURADO ---
    // Volvemos a un único estado para el formulario, como en el código original
    const [formData, setFormData] = useState({
        gameName: '',
        version: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    // Volvemos a un único estado de errores
    const [errors, setErrors] = useState({});
    
    // Estado para la pestaña activa (esto es solo visual)
    const [activeTab, setActiveTab] = useState('');

    // Efecto para actualizar la pestaña activa cuando cambian las plataformas
    useEffect(() => {
        if (selectedPlatforms.length === 0) {
            setActiveTab('');
        } else if (!selectedPlatforms.includes(activeTab)) {
            // Si la pestaña activa fue eliminada, selecciona la primera de la lista
            setActiveTab(selectedPlatforms[0]);
        }
    }, [selectedPlatforms, activeTab]);

    const togglePlatform = (platform) => {
        const isSelected = selectedPlatforms.includes(platform);
        let newSelectedPlatforms;

        if (isSelected) {
            // Eliminar plataforma
            newSelectedPlatforms = selectedPlatforms.filter(p => p !== platform);
            setSelectedPlatforms(newSelectedPlatforms);
        } else {
            // Añadir plataforma
            newSelectedPlatforms = [...selectedPlatforms, platform];
            setSelectedPlatforms(newSelectedPlatforms);
            // Establecer la nueva plataforma como la pestaña activa
            setActiveTab(platform);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Actualizar el único estado 'formData'
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error para ese campo específico
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Vuelve a ser 'validateForm' (singular)
    const validateForm = () => {
        const newErrors = {};
        if (!formData.gameName.trim()) newErrors.gameName = 'El nombre del juego es obligatorio.';
        if (!formData.version.trim()) newErrors.version = 'La versión del juego es obligatoria.';
        return newErrors;
    };

    const handleContinue = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        // --- NAVEGACIÓN CORREGIDA ---
        // Volvemos a enviar 'gameDetails' con el 'formData' único.
        // Esto debería arreglar el bug de "datos no disponibles".
        navigate('/settings', {
            state: {
                ...state,
                selectedPlatforms,
                gameDetails: formData, 
            }
        });
    };

    if (!selectedGame) {
        return (
            <div className="screen-container">
                <div className="selection-container">
                    <h2 className="selection-title">No se ha seleccionado ninguna actividad</h2>
                    {/* ... (código de "no seleccionado" sin cambios) ... */}
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container">
            <div className="selection-container">
                <h2 className="selection-title">Selecciona plataforma(s) para</h2>
                
                <div className="selected-game-info">
                    <h3>{selectedGame.name}</h3>
                    <p className="game-area">{selectedGame.area}</p>
                </div>

                {selectedPlatforms.length > 0 && (
                    <div className="platforms-selected-count">
                        {selectedPlatforms.length} plataforma(s) seleccionada(s)
                    </div>
                )}

                <div className="platform-options">
                    {['web', 'android', 'ios'].map(platform => (
                        <div key={platform} className="platform-btn-wrapper">
                            <button
                                className={`platform-btn ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
                                onClick={() => togglePlatform(platform)}
                            >
                                <span className="platform-icon">
                                    {platform === 'web' ? '🌍' : platform === 'ios' ? '📳' : '📱'}
                                </span>
                                <span className="platform-name">
                                    {platform === 'web' ? 'Web' : platform === 'ios' ? 'iOS' : 'Android'}
                                </span>
                            </button>
                            {selectedPlatforms.includes(platform) && (
                                <span className="selection-counter">✓</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- INICIO: Formulario de Usuario (con Tabs) --- */}
                {selectedPlatforms.length > 0 && (
                    <div className="user-form-container">
                        
                        {/* 1. RENDER TABS (si hay 2 o más) */}
                        {selectedPlatforms.length >= 2 && (
                            <div className="tabs-container">
                                {selectedPlatforms.map(platform => (
                                    <button
                                        key={platform}
                                        className={`tab-btn ${activeTab === platform ? 'active' : ''}`}
                                        onClick={() => setActiveTab(platform)}
                                    >
                                        <span className="platform-icon" style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                                            {platform === 'web' ? '🌍' : platform === 'ios' ? '📳' : '📱'}
                                        </span>
                                        <span className="platform-name">
                                            {platform === 'web' ? 'Web' : platform === 'ios' ? 'iOS' : 'Android'}
                                        </span>
                                        {/* El indicador de error ahora mira el 'errors' único, 
                                            pero solo si la pestaña está activa (para evitar confusión) */}
                                        {activeTab === platform && Object.keys(errors).length > 0 && (
                                            <span className="tab-error-indicator">!</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* 2. RENDER FORM (ahora usa 'formData' único) */}
                        <div className="form-content">
                            <h3 className="form-title">
                                {selectedPlatforms.length >= 2 
                                    ? `Detalles para ${activeTab === 'web' ? 'Web' : activeTab === 'ios' ? 'iOS' : 'Android'}` 
                                    : 'Detalles del Juego'}
                            </h3>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="gameName"><IconGamepad /> Nombre del Juego</label>
                                    <input 
                                        type="text" id="gameName" name="gameName" 
                                        value={formData.gameName} // Usa formData
                                        onChange={handleInputChange} 
                                        placeholder="Ej: Nombre del Juego" 
                                    />
                                    {errors.gameName && <span className="error-message">{errors.gameName}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="version"><IconCodeBranch /> Versión del Juego</label>
                                    <input 
                                        type="text" id="version" name="version" 
                                        value={formData.version} // Usa formData
                                        onChange={handleInputChange} 
                                        placeholder="Ej: 1.0.0" 
                                    />
                                    {errors.version && <span className="error-message">{errors.version}</span>}
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="description"><IconFile /> Descripción del juego</label>
                                    <textarea 
                                        id="description" name="description" 
                                        value={formData.description} // Usa formData
                                        onChange={handleInputChange} 
                                        placeholder="Añade una breve descripción sobre el objetivo del juego..." rows="3"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* --- FIN: Formulario de Usuario --- */}

                <div className="action-buttons">
                    <button className="no-rounded-button" onClick={() => navigate(-1)}>
                        <IconArrowBack />
                        Anterior
                    </button>
                    <button
                        className="no-rounded-button"
                        disabled={selectedPlatforms.length === 0}
                        onClick={handleContinue}
                    >
                        <IconConfigure />
                        Configurar ({selectedPlatforms.length}) 
                    </button>
                </div>
            </div>
            
            {/* Estilos... (sin cambios respecto a la versión anterior, ya incluyen los tabs) */}
            <style>{`
                .screen-container { padding: 20px; font-family: sans-serif; background-color: #f0f2f5; }
                .selection-container { max-width: 800px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .selection-title { text-align: center; color: #333; margin-bottom: 2rem; }
                .selected-game-info { text-align: center; margin-bottom: 20px; background-color: #e9f5ff; padding: 15px; border-radius: 8px; border-left: 5px solid #007bff; }
                .selected-game-info h3 { margin: 0; color: #0056b3; }
                .selected-game-info .game-area { margin: 5px 0 0; color: #555; }
                .platforms-selected-count { text-align: center; margin-bottom: 10px; color: #555; font-style: italic; }
                .platform-options { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; }
                .platform-btn-wrapper { position: relative; }
                .platform-btn { display: flex; flex-direction: column; align-items: center; padding: 15px 25px; border: 2px solid #ddd; border-radius: 8px; background: #fff; cursor: pointer; transition: all 0.2s; }
                .platform-btn.selected { border-color: #0077b6; background: #e7f3ff; transform: translateY(-3px); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .platform-icon { font-size: 2.5rem; }
                .platform-name { margin-top: 10px; font-weight: bold; }
                .selection-counter { position: absolute; top: -8px; right: -8px; background: #28a745; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; }
                
                .user-form-container { width: 100%; margin-top: 2.5rem; padding: 0; /* Padding se mueve al content */ background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; box-sizing: border-box; overflow: hidden; /* Para contener los bordes de las tabs */ }
                
                /* --- ESTILOS PARA TABS --- */
                .tabs-container { display: flex; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; }
                .tab-btn { padding: 12px 18px; background: none; border: none; cursor: pointer; font-size: 1rem; color: #555; position: relative; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; border-bottom: 3px solid transparent; transition: all 0.2s; }
                .tab-btn .platform-name { margin-top: 0; }
                .tab-btn:hover { background-color: #dee2e6; }
                .tab-btn.active { color: #007bff; background: #fff; border-bottom: 3px solid #007bff; font-weight: bold; }
                .tab-error-indicator { position: absolute; top: 5px; right: 5px; background: #dc3545; color: white; width: 16px; height: 16px; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                .form-content { padding: 1.5rem; /* Padding que antes estaba en .user-form-container */ }
                /* --- FIN ESTILOS --- */

                .form-title { margin-top: 0; margin-bottom: 1.5rem; color: #333; text-align: center; font-size: 1.5rem; }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { margin-bottom: 0.5rem; font-weight: 500; color: #555; display: flex; align-items: center; gap: 0.5rem; }
                .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); }
                .error-message { color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; }
                
                .action-buttons { margin-top: 2.5rem; display: flex; justify-content: space-between; gap: 1rem; }
                .no-rounded-button { padding: 12px 24px; border-radius: 8px; border: none; font-size: 1rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .no-rounded-button:first-of-type { background-color: #0077b6; color: white; }
                .no-rounded-button:first-of-type:hover { background-color: #0077b6; }
                .no-rounded-button:last-of-type { background-color: #0077b6; color: white; }
                .no-rounded-button:last-of-type:hover { background-color: #0077b6; }
                .no-rounded-button:disabled { background: #e9ecef; color: #6c757d; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default Platform;