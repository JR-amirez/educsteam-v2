import React, { useState, useEffect, useCallback, useMemo } from 'react';
// No necesitas importar Swal si se carga desde el CDN
import Swal from 'sweetalert2'; 

// --- COMPONENTES SVG DE MANDALAS ---
// Para este ejemplo, creo mandalas SVG simples.
// En una aplicación real, estos podrían ser mucho más complejos.

const Mandala1 = ({ onFill, fillState, showNumbers, solution }) => {
  const paths = [
    { id: 'p1', d: 'M50,50 h100 v100 h-100 z', textPos: { x: 100, y: 100 } },
    { id: 'p2', d: 'M150,50 h100 v100 h-100 z', textPos: { x: 200, y: 100 } },
    { id: 'p3', d: 'M50,150 h100 v100 h-100 z', textPos: { x: 100, y: 200 } },
    { id: 'p4', d: 'M150,150 h100 v100 h-100 z', textPos: { x: 200, y: 200 } },
    { id: 'p5', d: 'M100,100 h100 v100 h-100 z', textPos: { x: 150, y: 150 } },
  ];
  
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full bg-white border-2 border-gray-300 rounded-lg">
      <g>
        {paths.map(p => (
          <path
            key={p.id}
            d={p.d}
            fill={fillState[p.id] || '#FFFFFF'}
            stroke="#333"
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-150 hover:opacity-80"
            onClick={() => onFill(p.id)}
          />
        ))}
        {showNumbers && solution && paths.map(p => (
           <text key={`t-${p.id}`} x={p.textPos.x} y={p.textPos.y} textAnchor="middle" dominantBaseline="middle" fill="#000" pointerEvents="none" fontSize="20px" fontWeight="bold" className="select-none">
             {solution[p.id] || '?'}
           </text>
        ))}
      </g>
    </svg>
  );
};

// --- NUEVA PLANTILLA GEOMÉTRICA ---
const MandalaGeometria = ({ onFill, fillState, showNumbers, solution }) => {
  const paths = [
    // Polígono central (hexágono)
    { id: 'p1', d: 'M150,70 L225,110 L225,190 L150,230 L75,190 L75,110 Z', textPos: { x: 150, y: 150 } },
    // Formas alrededor
    { id: 'p2', d: 'M75,110 L150,70 L150,30 L75,70 Z', textPos: { x: 112.5, y: 70 } }, // Arriba-Izquierda
    { id: 'p3', d: 'M150,70 L225,110 L225,70 L150,30 Z', textPos: { x: 187.5, y: 70 } }, // Arriba-Derecha
    { id: 'p4', d: 'M225,110 L225,190 L275,150 Z', textPos: { x: 241, y: 150 } }, // Derecha
    { id: 'p5', d: 'M225,190 L150,230 L150,270 L225,230 Z', textPos: { x: 187.5, y: 230 } }, // Abajo-Derecha
    { id: 'p6', d: 'M150,230 L75,190 L75,230 L150,270 Z', textPos: { x: 112.5, y: 230 } }, // Abajo-Izquierda
    { id: 'p7', d: 'M75,190 L75,110 L25,150 Z', textPos: { x: 58, y: 150 } }, // Izquierda
  ];
  
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full bg-white border-2 border-gray-300 rounded-lg">
      <g>
        {paths.map(p => (
          <path
            key={p.id}
            d={p.d}
            fill={fillState[p.id] || '#FFFFFF'}
            stroke="#333"
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-150 hover:opacity-80"
            onClick={() => onFill(p.id)}
          />
        ))}
        {showNumbers && solution && paths.map(p => (
           <text key={`t-${p.id}`} x={p.textPos.x} y={p.textPos.y} textAnchor="middle" dominantBaseline="middle" fill="#000" pointerEvents="none" fontSize="20px" fontWeight="bold" className="select-none">
             {solution[p.id] || '?'}
           </text>
        ))}
      </g>
    </svg>
  );
};

// --- NUEVA PLANTILLA OCTÁGONO ---
const MandalaOctagono = ({ onFill, fillState, showNumbers, solution }) => {
  const paths = [
    // Centro (Octágono)
    { id: 'p1', d: 'M110,70 L190,70 L230,110 L230,190 L190,230 L110,230 L70,190 L70,110 Z', textPos: { x: 150, y: 150 } },
    // 4 Triángulos
    { id: 'p2', d: 'M110,70 L190,70 L150,20 Z', textPos: { x: 150, y: 60 } }, // Arriba
    { id: 'p3', d: 'M230,110 L230,190 L280,150 Z', textPos: { x: 245, y: 150 } }, // Derecha
    { id: 'p4', d: 'M190,230 L110,230 L150,280 Z', textPos: { x: 150, y: 240 } }, // Abajo
    { id: 'p5', d: 'M70,190 L70,110 L20,150 Z', textPos: { x: 55, y: 150 } }, // Izquierda
  ];
  
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full bg-white border-2 border-gray-300 rounded-lg">
      <g>
        {paths.map(p => (
          <path
            key={p.id}
            d={p.d}
            fill={fillState[p.id] || '#FFFFFF'}
            stroke="#333"
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-150 hover:opacity-80"
            onClick={() => onFill(p.id)}
          />
        ))}
        {showNumbers && solution && paths.map(p => (
           <text key={`t-${p.id}`} x={p.textPos.x} y={p.textPos.y} textAnchor="middle" dominantBaseline="middle" fill="#000" pointerEvents="none" fontSize="20px" fontWeight="bold" className="select-none">
             {solution[p.id] || '?'}
           </text>
        ))}
      </g>
    </svg>
  );
};


// --- DATOS DE MANDALAS ---

const MANDALA_DATA = {
  // --- Básico ---
  'm1': {
    id: 'm1',
    name: 'Cubo Básico',
    level: 'Básico',
    component: Mandala1,
    colors: [
      { id: '1', hex: '#DC0000' }, // Rojo
      { id: '2', hex: '#0D6EFD' }, // Azul
      { id: '3', hex: '#35A80B' }, // Verde
    ],
    solution: { p1: '1', p2: '2', p3: '2', p4: '1', p5: '3' }
  },
  'm2': {
    id: 'm2',
    name: 'Geometría',
    level: 'Básico',
    component: MandalaGeometria, 
    colors: [
      { id: '1', hex: '#FFC107' }, // Amarillo
      { id: '2', hex: '#800080' }, // Morado
      { id: '3', hex: '#FF69B4' }, // Rosa
      { id: '4', hex: '#66C8FF' }, // Azul claro
    ],
    solution: { p1: '1', p2: '2', p3: '2', p4: '3', p5: '4', p6: '4', p7: '3' } 
  },
  'm3': { id: 'm3', name: 'Octágono Básico', level: 'Básico', component: MandalaOctagono, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' } ], solution: { p1: '1', p2: '2', p3: '3', p4: '2', p5: '3' } }, 
  'm4': { id: 'm4', name: 'Geometría 2', level: 'Básico', component: MandalaGeometria, colors: [ { id: '1', hex: '#FFC107' }, { id: '2', hex: '#800080' }, { id: '3', hex: '#FF69B4' }, { id: '4', hex: '#66C8FF' } ], solution: { p1: '4', p2: '3', p3: '3', p4: '2', p5: '1', p6: '1', p7: '2' } }, 
  'm5': { id: 'm5', name: 'Mandala 5 Básico', level: 'Básico', component: Mandala1, colors: [ { id: '1', hex: '#35A80B' }, { id: '2', hex: '#FF69B4' }, { id: '3', hex: '#66C8FF' } ], solution: { p1: '3', p2: '2', p3: '2', p4: '3', p5: '1' } }, 

  // --- Intermedio ---
  'm6': {
    id: 'm6',
    name: 'Cubo Intermedio',
    level: 'Intermedio',
    component: Mandala1,
    colors: [
      { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' },
      { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' },
    ],
    solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5' }
  },
  'm7': { id: 'm7', name: 'Geometría Intermedia', level: 'Intermedio', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' } ], solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5', p6: '2', p7: '4' } }, 
  'm8': { id: 'm8', name: 'Octágono Intermedio', level: 'Intermedio', component: MandalaOctagono, colors: [ { id: '1', hex: '#FF69B4' }, { id: '2', hex: '#66C8FF' }, { id: '3', hex: '#800080' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#35A80B' } ], solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5' } }, 
  'm9': { id: 'm9', name: 'Geometría 4', level: 'Intermedio', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' } ], solution: { p1: '5', p2: '4', p3: '3', p4: '2', p5: '1', p6: '4', p7: '2' } }, 
  'm10': { id: 'm10', name: 'Mandala 5 Intermedio', level: 'Intermedio', component: Mandala1, colors: [ { id: '1', hex: '#FFC107' }, { id: '2', hex: '#800080' }, { id: '3', hex: '#FF69B4' }, { id: '4', hex: '#66C8FF' }, { id: '5', hex: '#0D6EFD' } ], solution: { p1: '5', p2: '4', p3: '3', p4: '2', p5: '1' } },
  'm11': { id: 'm11', name: 'Geometría 6', level: 'Intermedio', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' } ], solution: { p1: '3', p2: '1', p3: '1', p4: '5', p5: '2', p6: '2', p7: '4' } }, 

  // --- Avanzado ---
  'm12': {
    id: 'm12',
    name: 'Geometría Avanzada',
    level: 'Avanzado',
    component: MandalaGeometria, 
    colors: [
      { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' },
      { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' },
      { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' },
    ],
    solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5', p6: '6', p7: '7' } 
  },
  'm13': { id: 'm13', name: 'Mandala 2 Avanzado', level: 'Avanzado', component: Mandala1, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5' } }, 
  'm14': { id: 'm14', name: 'Geometría 3 Avanzada', level: 'Avanzado', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '8', p2: '7', p3: '6', p4: '5', p5: '4', p6: '3', p7: '2' } }, 
  'm15': { id: 'm15', name: 'Octágono Avanzado', level: 'Avanzado', component: MandalaOctagono, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '1', p2: '2', p3: '3', p4: '4', p5: '5' } }, 
  'm16': { id: 'm16', name: 'Geometría 5 Avanzada', level: 'Avanzado', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '1', p2: '3', p3: '5', p4: '7', p5: '2', p6: '4', p7: '6' } }, 
  'm17': { id: 'm17', name: 'Octágono 2 Avanzado', level: 'Avanzado', component: MandalaOctagono, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '8', p2: '7', p3: '6', p4: '5', p5: '4' } }, 
  'm18': { id: 'm18', name: 'Geometría 7 Avanzada', level: 'Avanzado', component: MandalaGeometria, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '2', p2: '2', p3: '4', p4: '4', p5: '6', p6: '6', p7: '8' } }, 
  'm19': { id: 'm19', name: 'Mandala 8 Avanzado', level: 'Avanzado', component: Mandala1, colors: [ { id: '1', hex: '#DC0000' }, { id: '2', hex: '#0D6EFD' }, { id: '3', hex: '#35A80B' }, { id: '4', hex: '#FFC107' }, { id: '5', hex: '#800080' }, { id: '6', hex: '#FF69B4' }, { id: '7', hex: '#66C8FF' }, { id: '8', hex: '#FF9F1C' } ], solution: { p1: '2', p2: '1', p3: '4', p4: '3', p5: '6' } },
};

const GAME_SETTINGS = {
  'Básico': {
    maxMandalas: 3,
    time: 300, // 5 minutos
    mandalasAvailable: ['m1', 'm2', 'm3', 'm4', 'm5'],
  },
  'Intermedio': {
    maxMandalas: 4,
    time: 600, // 10 minutos
    mandalasAvailable: ['m6', 'm7', 'm8', 'm9', 'm10', 'm11'],
  },
  'Avanzado': {
    maxMandalas: 5,
    time: 900, // 15 minutos
    mandalasAvailable: ['m12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19'],
  },
};

// --- COMPONENTES DE UI ---

const AnimatedTitle = () => {
  // Estilos en línea para la animación de neón, para mantenerlo en un solo archivo.
  // IMPORTANTE: En un proyecto real, estas animaciones irían en un archivo CSS global.
  const style = `
    @keyframes neon-flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        text-shadow: 
          0 0 5px #00F0FF, /* Cian */
          0 0 10px #00F0FF,
          0 0 20px #00F0FF,
          0 0 40px #FF00E1, /* Magenta */
          0 0 80px #FF00E1,
          0 0 90px #00F0FF,
          0 0 100px #FF00E1,
          0 0 150px #00F0FF;
        color: #FFFFFF;
      }
      20%, 24%, 55% {        
        text-shadow: none;
        color: #888888; /* Color tenue durante el "apagado" */
      }
    }

    .neon-title {
      font-family: 'Press Start 2P', cursive; /* Asegúrate de importar esta fuente en tu HTML global */
      font-size: 3.5rem;
      text-align: center;
      margin-bottom: 2rem;
      letter-spacing: 2px;
      font-weight: 700;
      animation: neon-flicker 2.5s infinite alternate; /* Animación más sutil */
    }
    
    /* Fallback por si la fuente no carga */
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    body { font-family: 'Inter', sans-serif; } /* Asegúrate de que Inter también esté disponible */
  `;
  
  return (
    <>
      <style>{style}</style>
      <h1 className="neon-title">PixelArt</h1>
    </>
  );
};

const SetupScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('Básico');
  const [selectedMandalas, setSelectedMandalas] = useState([]);

  const settings = GAME_SETTINGS[difficulty];
  const availableMandalas = settings.mandalasAvailable.map(id => MANDALA_DATA[id]).filter(Boolean);

  const toggleMandala = (id) => {
    setSelectedMandalas(prev => {
      if (prev.includes(id)) {
        return prev.filter(mId => mId !== id);
      }
      if (prev.length < settings.maxMandalas) {
        return [...prev, id];
      }
      return prev;
    });
  };
  
  const canStart = selectedMandalas.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-2xl">
      <AnimatedTitle />
      
      {/* Selector de Dificultad */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Selecciona el nivel de dificultad:</h2>
        <div className="flex justify-center space-x-4">
          {['Básico', 'Intermedio', 'Avanzado'].map(level => (
            <button
              key={level}
              onClick={() => {
                setDifficulty(level);
                setSelectedMandalas([]); // Resetear selección al cambiar dificultad
              }}
              className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300
                ${difficulty === level 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 shadow-md hover:bg-gray-50'
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Mandalas a Seleccionar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Selecciona los mandalas a realizar (Máximo {settings.maxMandalas}):
        </h2>
        <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 h-48 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {availableMandalas.length > 0 ? availableMandalas.map(mandala => (
              <button
                key={mandala.id}
                onClick={() => toggleMandala(mandala.id)}
                className={`border-4 rounded-lg overflow-hidden transition-all duration-200 text-center
                  ${selectedMandalas.includes(mandala.id) 
                    ? 'border-blue-500 scale-105 shadow-xl' 
                    : 'border-transparent hover:border-gray-300 bg-white'
                  }`}
              >
                {/* Visualización del Mandala */}
                <div className="w-full h-20 p-1 pointer-events-none"> 
                  {mandala.component ? (
                    <mandala.component 
                      onFill={() => {}} // No-op for preview
                      fillState={{}}     // Empty state for preview
                      showNumbers={false}  // No numbers in preview
                      solution={mandala.solution} // Pasa la solución para que se rendericen los números
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                       <span className="text-xxs text-gray-600 p-1">Sin vista previa</span>
                    </div>
                  )}
                </div>
                <span className="block text-xs text-gray-700 p-1 truncate">{mandala.name}</span>
              </button>
            )) : (
              <p className="text-gray-500 col-span-full text-center">Datos de mandalas no cargados para este nivel.</p>
            )}
          </div>
        </div>
      </div>

      {/* Mandalas Seleccionados */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Mandalas seleccionados: {selectedMandalas.length} / {settings.maxMandalas}</h2>
        <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 h-32 overflow-y-auto">
          {selectedMandalas.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {selectedMandalas.map(id => {
                const mandala = MANDALA_DATA[id];
                return (
                  <div key={id} className="w-24 h-24 bg-white rounded-lg p-1 shadow-sm border border-gray-200 text-center">
                    {mandala?.component ? (
                       <div className="w-full h-16 pointer-events-none">
                         <mandala.component 
                           onFill={() => {}} 
                           fillState={{}} 
                           showNumbers={false} 
                           solution={mandala.solution} // Pasa la solución para que se rendericen los números
                         />
                       </div>
                    ) : (
                      <div className="w-full h-16 bg-gray-200"></div>
                    )}
                    <span className="text-xs text-gray-600 text-center truncate">{mandala?.name || 'Error'}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center pt-6">Ningún mandala seleccionado.</p>
          )}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-between">
        <button
          className="px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold shadow-md hover:bg-gray-600 transition-all cursor-not-allowed opacity-50"
          disabled
        >
          Anterior
        </button>
        <button
          onClick={() => onStartGame(difficulty, selectedMandalas)}
          disabled={!canStart}
          className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all
            ${canStart 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Siguiente (Iniciar Juego)
        </button>
      </div>
    </div>
  );
};

// --- Función de Ayuda para el Contraste de Texto ---
function getContrastingTextColor(hex) {
  if (!hex) return '#000000';
  try {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    // Fórmula YIQ para luminancia
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF'; // Negro sobre claro, Blanco sobre oscuro
  } catch (e) {
    console.error("Error parsing hex color:", hex, e);
    return '#000000';
  }
}


const GameScreen = ({ difficulty, mandalaIds, onBackToSetup }) => {
  const [currentMandalaIndex, setCurrentMandalaIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SETTINGS[difficulty].time);
  const [selectedColor, setSelectedColor] = useState(null); // { id, hex }
  const [fillState, setFillState] = useState({}); // { p1: '#hex', p2: '#hex' }
  const [isPaused, setIsPaused] = useState(false);

  const currentMandala = useMemo(() => {
    const id = mandalaIds[currentMandalaIndex];
    return MANDALA_DATA[id];
  }, [currentMandalaIndex, mandalaIds]);

  const MandalaComponent = currentMandala?.component;
  const mandalaSolution = currentMandala?.solution;
  const mandalaColors = currentMandala?.colors;
  
  // Timer Effect
  useEffect(() => {
    if (isPaused || !window.Swal) return;

    if (timeLeft <= 0) {
      Swal.fire({
        title: '¡Tiempo agotado!',
        text: '¡Casi lo logras! Revisa los colores y vuelve a intentarlo',
        icon: 'error',
        confirmButtonText: 'Reiniciar Nivel',
      }).then(() => {
        // Reiniciar este nivel (no el juego completo)
        setFillState({});
        setSelectedColor(null);
        setTimeLeft(GAME_SETTINGS[difficulty].time);
      });
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isPaused, difficulty]);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const handleFill = (pathId) => {
    if (!selectedColor) {
        // Opcional: mostrar un aviso para seleccionar un color
        console.warn("No color selected");
        return;
    }
    setFillState(prev => ({
      ...prev,
      [pathId]: selectedColor.hex,
    }));
  };
  
  const checkSolution = () => {
    if (!mandalaSolution || !mandalaColors) return;
    
    setIsPaused(true); // Pausar el timer
    
    const colorMap = mandalaColors.reduce((acc, c) => {
        acc[c.id] = c.hex;
        return acc;
    }, {});
    
    let isCorrect = true;
    for (const pathId in mandalaSolution) {
        const correctColorId = mandalaSolution[pathId];
        const correctHex = colorMap[correctColorId];
        const userHex = fillState[pathId];
        
        if (userHex !== correctHex) {
            isCorrect = false;
            break;
        }
    }
    
    // Verificar que todas las partes estén pintadas
    const totalPaths = Object.keys(mandalaSolution).length;
    const paintedPaths = Object.keys(fillState).length;
    // Esta lógica simple asume que el usuario no puede "despintar" a blanco
    // y que solo se pintan las partes de la solución.
    // Una lógica más robusta contaría solo las llaves de fillState que están en mandalaSolution.
    
    if (!isCorrect || paintedPaths < totalPaths) {
      // --- INCORRECTO ---
      Swal.fire({
        title: '¡Casi lo logras!',
        text: 'Revisa los colores y vuelve a intentarlo',
        icon: 'warning',
        confirmButtonText: 'Seguir intentando',
      }).then(() => {
        setIsPaused(false); // Reanudar timer
      });
    } else {
      // --- CORRECTO ---
      const newScore = score + 10;
      setScore(newScore);
      
      const isLastMandala = currentMandalaIndex === mandalaIds.length - 1;
      
      if (isLastMandala) {
        // --- JUEGO TERMINADO ---
        Swal.fire({
          title: '¡Felicidades, lo lograste!',
          html: `Total: <b>${newScore} Puntos</b>`,
          icon: 'success',
          confirmButtonText: 'Volver al Inicio',
        }).then(() => {
          onBackToSetup();
        });
      } else {
        // --- SIGUIENTE MANDALA ---
        Swal.fire({
          title: '¡Tu mente y tus colores están en perfecto equilibrio!',
          html: `¡Has obtenido! <b>10 Puntos</b>`,
          icon: 'success',
          confirmButtonText: 'Siguiente Mandala',
         }).then(() => {
            // Pasar al siguiente
            setCurrentMandalaIndex(i => i + 1);
            setFillState({});
            setSelectedColor(null);
            setIsPaused(false);
         });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-gray-200 rounded-xl shadow-2xl">
      {/* Barra de Estado Superior */}
      <div className="flex flex-wrap justify-between items-center gap-2 md:gap-4 mb-4">
        <div className="flex-1 min-w-max px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md text-center">
          <span className="font-bold">Nivel:</span> {difficulty}
        </div>
        <div className="flex-1 min-w-max px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <span className="font-bold">Tiempo:</span> {formatTime(timeLeft)}
        </div>
        <div className="flex-1 min-w-max px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md text-center">
          <span className="font-bold">Mandala:</span> {currentMandalaIndex + 1} / {mandalaIds.length}
        </div>
        <div className="flex-1 min-w-max px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <span className="font-bold">Puntuación:</span> {score}
        </div>
      </div>

      {/* Título del Mandala */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{currentMandala?.name || 'Mandala'}</h2>
        <p className="text-gray-600">Figuras geométricas. Cada número en la plantilla corresponde a un color específico.</p>
      </div>

      {/* Área de Trabajo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Área de trabajo (Mandala) */}
        <div className="lg:col-span-2 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Área de trabajo</h3>
          <div className="aspect-w-1 aspect-h-1">
            {MandalaComponent ? (
              <MandalaComponent onFill={handleFill} fillState={fillState} showNumbers={true} solution={mandalaSolution} />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center text-red-500">
                Error al cargar el mandala.
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Paleta y Selección */}
        <div className="flex flex-col gap-6">
          {/* Color Seleccionado */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Color seleccionado</h3>
            <div 
                className="w-full h-20 rounded-lg border-2 border-gray-300 shadow-md transition-all"
                style={{ backgroundColor: selectedColor?.hex || '#FFFFFF' }}
            >
                {!selectedColor && (
                    <span className="flex items-center justify-center h-full text-gray-500">Ninguno</span>
                )}
            </div>
          </div>

          {/* Paleta de Colores */}
          <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Paleta de colores</h3>
            <div className="grid grid-cols-3 gap-3">
              {mandalaColors && mandalaColors.length > 0 ? mandalaColors.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`p-2 rounded-lg shadow-sm transition-all duration-200
                    ${selectedColor?.id === color.id 
                        ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' 
                        : 'hover:scale-105'
                    }`}
                >
                  <div 
                    className="w-full h-12 rounded relative flex items-center justify-center" 
                    style={{ backgroundColor: color.hex }}
                  >
                    <span 
                      className="text-2xl font-bold select-none" 
                      style={{ color: getContrastingTextColor(color.hex) }}
                    >
                      {color.id}
                    </span>
                  </div>
                  <span className="block text-center text-xs text-gray-500 mt-1">{color.hex}</span>
                </button>
              )) : (
                <p className="text-gray-500 col-span-full">No hay colores.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones de Acción */}
      <div className="mt-6 flex justify-between">
         <button
          onClick={onBackToSetup}
          className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-all"
        >
          Salir del Juego
        </button>
         <button
          onClick={checkSolution}
          className="px-8 py-4 rounded-lg bg-green-600 text-white text-xl font-bold shadow-lg hover:bg-green-700 transition-all transform hover:scale-105"
        >
          ¡Verificar!
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (EXPORTACIÓN) ---

export default function PixelArtGame() {
  const [screen, setScreen] = useState('setup'); // 'setup' | 'game'
  const [gameConfig, setGameConfig] = useState(null); // { difficulty, mandalaIds }

  // Carga manual de CSS equivalente a Tailwind.
  // ESTO ES UNA SOLUCIÓN DE EMERGENCIA PARA UN ENTORNO ESPECÍFICO.
  // En un proyecto real de React, configurarías Tailwind CSS con PostCSS
  // para que se compile correctamente.
  const manualTailwindCss = `
    /* Base styles (preflight) - algunos reseteos básicos */
    html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: sans-serif; }
    body { margin: 0; line-height: inherit; }
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
    
    /* Fuentes y Utilidades de texto */
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-white { color: #fff; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-800 { color: #1f2937; }
    .text-red-500 { color: #ef4444; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-xxs { font-size: 0.65rem; line-height: 0.8rem; } /* Custom size */
    .text-center { text-align: center; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .leading-normal { line-height: 1.5; }

    /* Layout y Spacing */
    .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .flex-1 { flex: 1 1 0%; } /* CORRECCIÓN: Agregado */
    .flex-col { flex-direction: column; } /* CORRECCIÓN: Agregado */
    .flex-wrap { flex-wrap: wrap; } /* CORRECCIÓN: Agregado */
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-right: 0; margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse))); }
    .gap-2 { gap: 0.5rem; } /* CORRECCIÓN: Agregado */
    .gap-3 { gap: 0.75rem; } /* CORRECCIÓN: Agregado */
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-6 { margin-top: 1.5rem; }
    .p-1 { padding: 0.25rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-10 { padding: 2.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .pt-6 { padding-top: 1.5rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .w-full { width: 100%; }
    .max-w-4xl { max-width: 56rem; } /* 896px */
    .max-w-6xl { max-width: 72rem; } /* 1152px */
    .min-w-max { min-width: max-content; } /* CORRECCIÓN: Agregado */
    .h-full { height: 100%; }
    .h-12 { height: 3rem; }
    .h-16 { height: 4rem; }
    .h-20 { height: 5rem; }
    .h-32 { height: 8rem; }
    .h-48 { height: 12rem; }
    .aspect-w-1 { --tw-aspect-w: 1; position: relative; } /* CORRECCIÓN: Agregado position: relative */
    .aspect-h-1 { --tw-aspect-h: 1; }
    .aspect-w-1::before { content: ""; display: block; padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%); }
    .aspect-w-1 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
    .overflow-y-auto { overflow-y: auto; }
    .overflow-hidden { overflow: hidden; }
    .relative { position: relative; }
    
    /* Fondos y Bordes */
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .from-gray-700 { --tw-gradient-from: #374151; --tw-gradient-to: rgba(55, 65, 81, 0); }
    .via-gray-900 { --tw-gradient-to: rgba(17, 24, 39, 0); --tw-gradient-via: #111827; }
    .to-black { --tw-gradient-to: #000; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-white { background-color: #fff; }
    .bg-gray-200 { background-color: #e5e7eb; }
    .bg-blue-600 { background-color: #2563eb; }
    .bg-blue-700 { background-color: #1d4ed8; }
    .bg-gray-800 { background-color: #1f2937; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-green-600 { background-color: #10b981; }
    .bg-gray-400 { background-color: #9ca3af; }
    .bg-red-600 { background-color: #dc2626; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded { border-radius: 0.25rem; }
    .border-2 { border-width: 2px; }
    .border-4 { border-width: 4px; }
    .border-gray-300 { border-color: #d1d5db; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-blue-500 { border-color: #3b82f6; }
    .border-transparent { border-color: transparent; }

    /* Sombras */
    .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
    .ring-4 { --tw-ring-width: 4px; box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
    .ring-offset-2 { --tw-ring-offset-width: 2px; }
    .ring-blue-500 { --tw-ring-color: #3b82f6; }

    /* Interactividad */
    .cursor-pointer { cursor: pointer; }
    .cursor-not-allowed { cursor: not-allowed; }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .duration-150 { transition-duration: 150ms; }
    .duration-200 { transition-duration: 200ms; }
    .duration-300 { transition-duration: 300ms; }
    .hover\\:opacity-80:hover { opacity: 0.8; }
    .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
    .hover\\:bg-green-700:hover { background-color: #047857; }
    .hover\\:bg-red-700:hover { background-color: #b91c1c; }
    .hover\\:border-gray-300:hover { border-color: #d1d5db; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    .opacity-50 { opacity: 0.5; }
    .scale-105 { transform: scale(1.05); }
    .transform { transform: var(--tw-transform); }
    .pointer-events-none { pointer-events: none; }
    .select-none { user-select: none; }

    /* Grid */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .col-span-full { grid-column: 1 / -1; }
    .lg\\:col-span-2 { grid-column: span 2 / span 2; } /* Solo para pantallas grandes */
    
    /* Responsive (ejemplo básico para sm, md, lg) */
    @media (min-width: 640px) { /* sm */
      .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (min-width: 768px) { /* md */
      .md\\:p-6 { padding: 1.5rem; }
      .md\\:gap-4 { gap: 1rem; }
      .md\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) { /* lg */
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:col-span-2 { grid-column: span 2 / span 2; }
    }
  `;

  // Cargar SweetAlert2 dinámicamente
  useEffect(() => {
    // Comprobar si ya existe para no duplicarlo
    if (document.getElementById('sweetalert2-script')) return;

    const script = document.createElement('script');
    script.id = 'sweetalert2-script';
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.id = 'sweetalert2-css';
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";
    document.head.appendChild(link);

    // No hay limpieza en este caso, queremos que esté disponible
  }, []);

  const startGame = (difficulty, mandalaIds) => {
    setGameConfig({ difficulty, mandalaIds });
    setScreen('game');
  };

  const backToSetup = () => {
    setGameConfig(null);
    setScreen('setup');
  };

  return (
    <>
      {/* Cargar estilos de Tailwind CSS manualmente como CSS puro */}
      <style>{manualTailwindCss}</style> 
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black p-4 md:p-10 flex items-center justify-center">
        <div className="w-full">
          {screen === 'setup' && <SetupScreen onStartGame={startGame} />}
          {screen === 'game' && gameConfig && (
            <GameScreen
              difficulty={gameConfig.difficulty}
              mandalaIds={gameConfig.mandalaIds}
              onBackToSetup={backToSetup}
            />
          )}
        </div>
      </div>
    </>
  );
}

