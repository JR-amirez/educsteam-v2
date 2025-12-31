import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
    ArrowLeft,
    CheckCircle,
    Tag,
    Smartphone,
    Globe,
    FileText,
    Calendar,
    Monitor,
    Puzzle,
    Layers,
    Shapes,
    Grid,
    Type,
    Hash
} from 'lucide-react';

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
        justify-content: flex-start;
        white-space: nowrap;
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

// --- CONFIGURACIÓN DE PLANTILLA ANDROID PARA SUDOKU ---
const ANDROID_GAME_CONFIG = {
    baseZipUrl: '/templates/sudoku/android-base.zip',
    configPath: 'android/app/src/main/assets/public/config/sudoku-config.json',
    buildConfigData: ({ gameConfig, gameDetails, selectedPlatforms }) => {
        // Mapear el tamaño del nivel a su nombre
        const nivelMap = {
            3: 'basico',
            6: 'intermedio',
            9: 'avanzado',
        };

        // Mapear el tipo de contenido
        const tipoContenidoMap = {
            numbers: 'numeros',
            letters: 'letras',
            fractions: 'fracciones',
        };

        return {
            nivel: nivelMap[gameConfig?.levelSize] || 'basico',
            tamano: gameConfig?.levelSize || 3,
            tipoContenido: tipoContenidoMap[gameConfig?.contentType] || 'numeros',
            nombreApp: gameDetails?.gameName || 'Juego de Sudoku',
            version: gameDetails?.version || '1.0.0',
            descripcion: gameDetails?.description || '',
            fecha: gameDetails?.date || new Date().toISOString(),
            plataformas: Array.isArray(selectedPlatforms)
                ? selectedPlatforms
                : ['android'],
        };
    },
};

// --- COMPONENTE SUMMARY (PRINCIPAL) ---
const Summary = ({ config = {}, onBack }) => {
    // Estados para controlar la descarga de Android
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    // Estado para verificar si JSZip está listo
    const [jsZipReady, setJsZipReady] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(-1));
    const state = location.state || null;

    // --- DATOS DE RESPALDO PARA PREVIEW ---
    const MOCK_DATA = {
        selectedAreas: ['math'],
        selectedSkills: ['Lógica', 'Resolución de problemas'],
        gameDetails: {
            gameName: "Sudoku (Preview)",
            description: "Juego de lógica y razonamiento matemático.",
            version: "1.0.0",
            date: new Date().toISOString()
        },
        selectedPlatforms: ['web', 'mobile']
    };

    const data = state ?? MOCK_DATA;

    // Config del juego: usamos state.gameConfig o el prop config
    const gameConfig = state?.gameConfig || config || {};

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
            setErrorMsg("Error cargando librería ZIP");
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, []);

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
            const nombreArchivo = `android-sudoku-${configData.nivel || 'juego'}.zip`
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

    // Obtener el nombre del nivel basado en el tamaño
    const getLevelName = (size) => {
        const levels = {
            3: 'Básico (3x3)',
            6: 'Intermedio (6x6)',
            9: 'Avanzado (9x9)'
        };
        return levels[size] || `${size}x${size}`;
    };

    // Obtener el nombre del tipo de contenido
    const getContentTypeName = (type) => {
        const types = {
            numbers: 'Números del 1 al 9',
            letters: 'Letras de A a Z',
            fractions: 'Fracciones equivalentes'
        };
        return types[type] || type;
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
                        <div className="info-card-value">{gameDetails.gameName || 'Sudoku'}</div>
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
                            <Grid size={18} /> Nivel:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {getLevelName(gameConfig.levelSize)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Type size={18} /> Tipo de Contenido:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {getContentTypeName(gameConfig.contentType)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Hash size={18} /> Tamaño de Cuadrícula:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {gameConfig.levelSize}x{gameConfig.levelSize}
                        </strong>
                    </div>
                </div>

                {/* Botón "Volver a Editar" */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={handleBack} disabled={isGeneratingAndroid} style={{ opacity: isGeneratingAndroid ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    {/* Botón para Android */}
                    <button
                        className="btn-primary"
                        onClick={generarAndroidZipConConfig}
                        disabled={isGeneratingAndroid || !jsZipReady}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(40, 165, 238, 0.39)',
                            minWidth: '200px', justifyContent: 'center',
                            cursor: (isGeneratingAndroid || !jsZipReady) ? 'not-allowed' : 'pointer',
                            opacity: (isGeneratingAndroid || !jsZipReady) ? 0.6 : 1,
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
                    <strong>Android:</strong> Proyecto React Native listo para compilar en Android Studio.
                </p>
            </div>
        </div>
    );
};

export default Summary;
