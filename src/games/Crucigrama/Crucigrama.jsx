import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Award, HelpCircle, CheckCircle, Brain, Target, Ruler } from 'lucide-react';

// --- CSS para Animación del Título ---
const C_EstilosAnimacion = `
@keyframes letterPulse {
  0%, 100% {
    text-shadow: 0 0 4px rgba(0, 97, 255, 0.3);
    color: #0061ff;
  }
  50% {
    text-shadow: 0 0 15px rgba(96, 239, 255, 0.8), 0 0 25px rgba(96, 239, 255, 0.5);
    color: #38b6ff;
  }
}
.c-titulo-animado {
  font-family: 'Arial Black', Gadget, sans-serif;
  letter-spacing: 1px;
  animation: letterPulse 4s ease-in-out infinite;
  font-size: 3.5rem;
  line-height: 1;
}
`;
// --- Base de Datos de Crucigramas Configurada ---
const puzzleData = {
 'Básico': {
  theme: 'Sistema Internacional de Medidas (SI)',
  sets: [
    {
      id: 'si_1',
      name: 'Set Básico - 3 Horizontales / 2 Verticales',
      puzzle: {
        gridSize: 10,
        solutions: [
          // HORIZONTALES
          { id: '1h', word: 'MASA', start: [0, 0], direction: 'horizontal', clue: 'Cantidad de materia en un cuerpo' },
          { id: '2h', word: 'METRO', start: [3, 0], direction: 'horizontal', clue: 'Unidad básica de longitud' },
          { id: '3h', word: 'JOULE', start: [6, 1], direction: 'horizontal', clue: 'Unidad de energía o trabajo' },
          
          // VERTICALES
          { id: '1v', word: 'AMPERIO', start: [0, 1], direction: 'vertical', clue: 'Mide la intensidad de corriente eléctrica' },
          { id: '2v', word: 'SEGUNDO', start: [0, 2], direction: 'vertical', clue: 'Unidad de tiempo' },
        ]
      }
    }
  ]
},
  'Intermedio': {
    theme: 'Sistema Inglés de Medidas',
    sets: [
      {
        id: 'ing_1',
        name: 'Set Intermedio - 5 Horizontales / 5 Verticales',
        puzzle: {
          gridSize: 15,
          solutions: [
            // HORIZONTALES
            { id: '1h', word: 'PULGADA', start: [0, 0], direction: 'horizontal', clue: 'Unidad pequeña, aprox 2.54 cm' },
            { id: '2h', word: 'GALON', start: [2, 3], direction: 'horizontal', clue: 'Equivale a 3.78 litros aprox' },
            { id: '3h', word: 'YARDA', start: [6, 0], direction: 'horizontal', clue: 'Son 3 pies' },
            { id: '4h', word: 'LIBRA', start: [8, 5], direction: 'horizontal', clue: 'Unidad de peso, aprox 453 gramos' },
            { id: '5h', word: 'MILLA', start: [11, 2], direction: 'horizontal', clue: 'Usada para distancias largas en carreteras' },

            // VERTICALES (cruzan con horizontales)
            { id: '1v', word: 'PIE', start: [0, 0], direction: 'vertical', clue: 'Son 12 pulgadas' },
            { id: '2v', word: 'ONZA', start: [2, 3], direction: 'vertical', clue: 'Unidad de masa o volumen líquido' },
            { id: '3v', word: 'PINTA', start: [0, 4], direction: 'vertical', clue: 'Medida de capacidad para líquidos' },
            { id: '4v', word: 'UNIDAD', start: [6, 2], direction: 'vertical', clue: 'Cantidad estandarizada' },
            { id: '5v', word: 'ACRE', start: [8, 5], direction: 'vertical', clue: 'Medida de superficie para terrenos' },
          ]
        }
      }
    ]
  },
  'Avanzado': {
    theme: 'Geometría y Figuras',
    sets: [
      {
        id: 'geo_1',
        name: 'Set Avanzado - 8 Horizontales / 7 Verticales',
        puzzle: {
          gridSize: 18,
          solutions: [
            // HORIZONTALES
            { id: '1h', word: 'PUNTO', start: [0, 0], direction: 'horizontal', clue: 'Ente geométrico sin dimensiones' },
            { id: '2h', word: 'POLIGONO', start: [2, 0], direction: 'horizontal', clue: 'Figura plana cerrada por rectas' },
            { id: '3h', word: 'CUADRADO', start: [5, 3], direction: 'horizontal', clue: 'Polígono regular de 4 lados' },
            { id: '4h', word: 'ANGULO', start: [7, 0], direction: 'horizontal', clue: 'Abertura entre dos líneas que se cruzan' },
            { id: '5h', word: 'CIRCULO', start: [9, 5], direction: 'horizontal', clue: 'Figura plana delimitada por una circunferencia' },
            { id: '6h', word: 'ESFERA', start: [12, 2], direction: 'horizontal', clue: 'Cuerpo geométrico perfectamente redondo' },
            { id: '7h', word: 'PRISMA', start: [14, 0], direction: 'horizontal', clue: 'Poliedro con dos bases iguales' },
            { id: '8h', word: 'AREA', start: [16, 4], direction: 'horizontal', clue: 'Medida de superficie' },

            // VERTICALES (cruzan con horizontales)
            { id: '1v', word: 'LINEA', start: [0, 3], direction: 'vertical', clue: 'Sucesión continua de puntos' },
            { id: '2v', word: 'TRAPECIO', start: [2, 5], direction: 'vertical', clue: 'Cuadrilátero con dos lados paralelos' },
            { id: '3v', word: 'DIAMETRO', start: [5, 3], direction: 'vertical', clue: 'Línea que pasa por el centro del círculo' },
            { id: '4v', word: 'ESPACIO', start: [7, 0], direction: 'vertical', clue: 'Lugar donde ocupan volumen los cuerpos' },
            { id: '5v', word: 'VOLUMEN', start: [9, 7], direction: 'vertical', clue: 'Espacio ocupado por un cuerpo' },
            { id: '6v', word: 'RECTA', start: [12, 5], direction: 'vertical', clue: 'Línea que no se dobla' },
            { id: '7v', word: 'VERTICE', start: [14, 1], direction: 'vertical', clue: 'Punto donde se unen dos lados' },
          ]
        }
      }
    ]
  }
};

// --- Configuraciones de Dificultad ---
const difficultySettings = {
  'Básico': { words: 5, time: 10 * 60, icon: <CheckCircle style={{ height: '1.25rem', width: '1.25rem', color: '#22C55E' }} /> },
  'Intermedio': { words: 10, time: 20 * 60, icon: <Brain style={{ height: '1.25rem', width: '1.25rem', color: '#3B82F6' }} /> },
  'Avanzado': { words: 15, time: 30 * 60, icon: <Target style={{ height: '1.25rem', width: '1.25rem', color: '#EF4444' }} /> }
};

// --- Componente de Celda ---
const GridCell = React.memo(({
  value,
  isReadOnly,
  number,
  onChange,
  onFocus,
  isSolved,
  isSelected
}) => {
  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().slice(-1);
    onChange(val);
  };

  const baseStyle = {
    width: '100%',
    height: '100%',
    padding: 0,
    textAlign: 'center',
    border: '2px solid #9CA3AF',
    borderRadius: '0.375rem',
    fontSize: '1.25rem',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    transition: 'all 0.15s',
    outline: 'none',
    backgroundColor: 'white',
    color: '#111827',
  };

  if (isReadOnly) {
    baseStyle.backgroundColor = '#E5E7EB';
    baseStyle.borderColor = '#D1D5DB';
    baseStyle.cursor = 'default';
  }

  if (isSolved) {
    baseStyle.backgroundColor = '#D1FAE5';
    baseStyle.borderColor = '#6EE7B7';
    baseStyle.color = '#065F46';
  }

  if (isSelected && !isSolved && !isReadOnly) {
    baseStyle.backgroundColor = '#E0F2FE';
  }

  const containerStyle = {
    position: 'relative',
    width: '2.75rem',
    height: '2.75rem'
  };

  const numberStyle = {
    position: 'absolute',
    top: 0,
    left: '0.125rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#6B7280',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      {number && <span style={numberStyle}>{number}</span>}
      <input
        type="text"
        maxLength="1"
        value={value}
        onChange={handleChange}
        disabled={isReadOnly}
        style={baseStyle}
        aria-label={`Casilla ${number || ''}`}
        onFocus={(e) => {
          if (!isReadOnly) {
            e.target.style.boxShadow = '0 0 0 2px #3B82F6';
            e.target.style.borderColor = '#3B82F6';
            e.target.style.backgroundColor = '#BFDBFE';
            if (onFocus) onFocus();
          }
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
          if (!isReadOnly) {
            e.target.style.borderColor = isSolved ? '#6EE7B7' : '#9CA3AF';
            e.target.style.backgroundColor = isSolved ? '#D1FAE5' : (isSelected ? '#E0F2FE' : 'white');
          } else {
            e.target.style.borderColor = '#D1D5DB';
            e.target.style.backgroundColor = '#E5E7EB';
          }
        }}
      />
    </div>
  );
});

// --- Componente Principal ---
export default function Crucigrama() {
  const [difficulty, setDifficulty] = useState('Básico');
  const [gameState, setGameState] = useState('setup');
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [userGrid, setUserGrid] = useState([]);
  const [solvedWords, setSolvedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSwalLoaded, setIsSwalLoaded] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedPuzzleSetId, setSelectedPuzzleSetId] = useState(null);
  const [randomizedSets, setRandomizedSets] = useState([]);
  const [selectedClue, setSelectedClue] = useState(null);

  // --- Cargar SweetAlert2 ---
  useEffect(() => {
    if (!window.Swal) {
      const swalLink = document.createElement('link');
      swalLink.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
      swalLink.rel = 'stylesheet';
      swalLink.id = 'swal-css';
      if (!document.getElementById('swal-css')) document.head.appendChild(swalLink);

      const swalScript = document.createElement('script');
      swalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      swalScript.async = true;
      swalScript.id = 'swal-js';
      swalScript.onload = () => setIsSwalLoaded(true);
      if (!document.getElementById('swal-js')) document.body.appendChild(swalScript);
    } else {
      setIsSwalLoaded(true);
    }
  }, []);

  // --- Reseteo al cambiar dificultad ---
  useEffect(() => {
    setShowCatalog(false);
    setSelectedPuzzleSetId(null);
    setRandomizedSets([]);
  }, [difficulty]);

  // --- Construcción del Grid ---
  const buildGrid = useCallback((puzzle, solvedWords, selectedClue) => {
    if (!puzzle || !puzzle.solutions || !puzzle.gridSize) {
      return { grid: [], numbers: new Map(), numberCoords: new Map() };
    }

    const { gridSize, solutions } = puzzle;
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        value: '',
        isReadOnly: true,
        number: null,
        isSolved: false,
        isSelected: false,
      }))
    );

    const numberCoords = new Map();
    const cellNumbers = new Map();
    let numCounter = 1;

    const sortedSolutions = [...solutions].sort((a, b) => {
      if (a.start[0] !== b.start[0]) return a.start[0] - b.start[0];
      if (a.start[1] !== b.start[1]) return a.start[1] - b.start[1];
      if (a.direction === 'horizontal' && b.direction === 'vertical') return -1;
      if (a.direction === 'vertical' && b.direction === 'horizontal') return 1;
      return 0;
    });

    sortedSolutions.forEach(solution => {
      const [r, c] = solution.start;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
      const key = `${r}-${c}`;
      if (!cellNumbers.has(key)) {
        const currentNum = numCounter++;
        cellNumbers.set(key, currentNum);
        numberCoords.set(currentNum, { r, c });
      }
    });

    const solvedCells = new Set();
    for (const solvedId of solvedWords) {
      const wordData = solutions.find(s => s.id === solvedId);
      if (wordData) {
        let [r, c] = wordData.start;
        for (let i = 0; i < wordData.word.length; i++) {
          if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            solvedCells.add(`${r}-${c}`);
          }
          if (wordData.direction === 'horizontal') c++; else r++;
        }
      }
    }

    const selectedCells = new Set();
    if (selectedClue) {
      const wordData = solutions.find(s => s.id === selectedClue.id);
      if (wordData) {
        let [r, c] = wordData.start;
        for (let i = 0; i < wordData.word.length; i++) {
          if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            selectedCells.add(`${r}-${c}`);
          }
          if (wordData.direction === 'horizontal') c++; else r++;
        }
      }
    }

    solutions.forEach(solution => {
      let [r, c] = solution.start;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
      const startKey = `${r}-${c}`;
      const assignedNumber = cellNumbers.get(startKey);

      for (let i = 0; i < solution.word.length; i++) {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          if (!grid[r]) grid[r] = [];
          if (!grid[r][c]) grid[r][c] = { value: '', isReadOnly: true, number: null, isSolved: false, isSelected: false };

          const cellData = grid[r][c];
          cellData.isReadOnly = false;
          if (i === 0) {
            if (cellData.number === null || cellData.number === assignedNumber) {
              cellData.number = assignedNumber;
            }
          }
          cellData.isSolved = solvedCells.has(`${r}-${c}`);
          cellData.isSelected = selectedCells.has(`${r}-${c}`);
        } else {
          break;
        }

        if (solution.direction === 'horizontal') c++; else r++;
      }
    });

    return { grid, numbers: cellNumbers, numberCoords };
  }, []);

  const gridTemplate = useMemo(() => {
    return buildGrid(activePuzzle, solvedWords, selectedClue);
  }, [activePuzzle, solvedWords, selectedClue, buildGrid]);

  // --- Lógica del Juego ---
  const startGame = () => {
    const Swal = window.Swal;
    if (!Swal) return;

    const levelData = puzzleData[difficulty];
    const puzzleSet = levelData.sets.find(p => p.id === selectedPuzzleSetId);

    if (!puzzleSet || !puzzleSet.puzzle || !puzzleSet.puzzle.solutions || puzzleSet.puzzle.solutions.length === 0) {
      Swal.fire('Error', 'El set seleccionado no es válido.', 'error');
      return;
    }

    const puzzle = puzzleSet.puzzle;
    setActivePuzzle(puzzle);
    const newGrid = Array.from({ length: puzzle.gridSize }, () =>
      Array.from({ length: puzzle.gridSize }, () => '')
    );
    setUserGrid(newGrid);
    setSolvedWords([]);
    setScore(0);
    setSelectedClue(null);
    setTimeLeft(difficultySettings[difficulty].time);
    setGameState('playing');
  };

  const endGame = useCallback((isWinner) => {
    const Swal = window.Swal;
    if (!Swal) {
      setGameState('finished');
      alert(isWinner ? `¡Felicidades! Puntaje: ${score}` : `Juego terminado. Puntaje: ${score}`);
      returnToSetup();
      return;
    }
    setGameState('finished');

    if (isWinner) {
      Swal.fire({
        title: '¡Felicidades, lo lograste!',
        text: `Total: ${score} Puntos`,
        icon: 'success',
        confirmButtonText: 'Finalizar juego',
        confirmButtonColor: '#3085d6',
      }).then(returnToSetup);
    } else {
      Swal.fire({
        title: '¡Puedes mejorar, Intenta nuevamente!',
        text: `Total: ${score} Puntos`,
        icon: 'info',
        confirmButtonText: 'Reiniciar juego',
        showCancelButton: true,
        cancelButtonText: 'Finalizar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          if (activePuzzle) {
            startGame();
          } else {
            returnToSetup();
          }
        } else {
          returnToSetup();
        }
      });
    }
  }, [score, activePuzzle]);

  const returnToSetup = () => {
    setGameState('setup');
    setActivePuzzle(null);
    setUserGrid([]);
    setShowCatalog(false);
    setSelectedPuzzleSetId(null);
  };

  // --- Temporizador ---
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft, endGame]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} min.`;
  };

  // --- Manejadores ---
  const toggleCatalog = () => {
    if (!showCatalog) {
      const levelData = puzzleData[difficulty];
      const allSets = levelData.sets || [];
      const validSets = allSets.filter(s => s.puzzle && s.puzzle.solutions && s.puzzle.solutions.length > 0);
      setRandomizedSets(validSets);
    }
    setShowCatalog(prev => !prev);
    setSelectedPuzzleSetId(null);
  };

  const handleCellChange = (r, c, value) => {
    if (!gridTemplate || !gridTemplate.grid || !gridTemplate.grid[r] || !gridTemplate.grid[r][c] || gridTemplate.grid[r][c].isReadOnly) return;

    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = value;
    setUserGrid(newGrid);
  };

  const handleCellFocus = (r, c) => {
    if (!activePuzzle || !activePuzzle.solutions) {
      setSelectedClue(null);
      return;
    }
    const clues = activePuzzle.solutions.filter(sol => {
      let [rr, cc] = sol.start;
      for (let i = 0; i < sol.word.length; i++) {
        if (rr >= 0 && rr < activePuzzle.gridSize && cc >= 0 && cc < activePuzzle.gridSize) {
          if (rr === r && cc === c) return true;
        } else {
          return false;
        }
        if (sol.direction === 'horizontal') cc++; else rr++;
      }
      return false;
    });

    if (clues.length === 0) { setSelectedClue(null); return; }
    if (clues.length === 2) {
      if (selectedClue && (selectedClue.id === clues[0].id || selectedClue.id === clues[1].id)) {
        setSelectedClue(selectedClue.id === clues[0].id ? clues[1] : clues[0]);
      } else {
        setSelectedClue(clues.find(c => c.direction === 'horizontal') || clues[0]);
      }
    } else {
      setSelectedClue(clues[0]);
    }
  };

  const getWordFromGrid = (solution) => {
    if (!activePuzzle || !userGrid || userGrid.length === 0) return '';
    let [r, c] = solution.start;
    let word = '';
    for (let i = 0; i < solution.word.length; i++) {
      if (r >= 0 && r < activePuzzle.gridSize && c >= 0 && c < activePuzzle.gridSize && userGrid[r]) {
        word += userGrid[r][c] || ' ';
      } else {
        word += ' ';
      }
      if (solution.direction === 'horizontal') c++; else r++;
    }
    return word.toUpperCase();
  };

  const checkWord = (solution) => {
    const Swal = window.Swal;
    if (!Swal || !solution || !activePuzzle || !activePuzzle.solutions) return;
    if (solvedWords.includes(solution.id)) return;

    const userWord = getWordFromGrid(solution);
    if (userWord === solution.word.toUpperCase()) {
      setScore(prevScore => prevScore + 10);
      setSolvedWords(prevSolved => [...prevSolved, solution.id]);
      Swal.fire({
        title: '¡Palabra correcta!',
        text: '¡Has obtenido 10 Puntos!',
        icon: 'success',
        confirmButtonText: 'Continuar juego',
        confirmButtonColor: '#3085d6',
      });

      if (solvedWords.length + 1 === activePuzzle.solutions.length) {
        setTimeout(() => endGame(true), 0);
      }
    } else {
      Swal.fire({
        title: 'Palabra incorrecta',
        text: 'Intenta nuevamente',
        icon: 'error',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // --- Estilos ---
  const styles = {
    setupContainer: {
      fontFamily: "'Inter', sans-serif",
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#F9FAFB',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
    },
    gameContainer: {
      fontFamily: "'Inter', sans-serif",
      maxWidth: '900px',
      margin: '2rem auto',
      padding: '1.5rem',
      backgroundColor: '#F9FAFB',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    headerBar: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    headerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#4B5563',
      fontSize: '0.9rem',
    },
    headerText: {
      fontWeight: '600',
      color: '#1F2937',
    },
    headerLabel: {
      fontWeight: '500',
      color: '#6B7280',
    },
    selectLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'left',
    },
    selectInput: {
      width: '100%',
      padding: '0.65rem 1rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      fontSize: '0.9rem',
      color: '#1F2937',
    },
    buttonGray: {
      backgroundColor: '#6B7280',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease',
    },
    buttonBlue: {
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease',
    },
    gridContainer: {
      flexShrink: 0,
      margin: 'auto',
      overflowX: 'auto',
      padding: '0.5rem',
    },
    gridTable: {
      display: 'inline-grid',
      border: '2px solid #60A5FA',
      backgroundColor: '#EBF4FF',
      padding: '4px',
      borderRadius: '8px',
      gap: '2px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    cluesOuterContainer: {
      flexGrow: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gap: '1.5rem',
      minWidth: '300px',
    },
    clueBox: {
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    clueList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      fontSize: '0.9rem',
    },
    clueListItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: '0.5rem',
    },
    clueCheckButton: {
      flexShrink: 0,
      width: '1.75rem',
      height: '1.75rem',
      minWidth: '1.75rem',
      minHeight: '1.75rem',
      padding: '0.25rem',
      backgroundColor: '#DBEAFE',
      color: '#1D4ED8',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '0.125rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1',
      fontWeight: 'bold',
      fontSize: '0.75rem',
    },
    clueTextContainer: {
      flexGrow: 1,
      minWidth: 0,
      display: 'block',
    },
    clueNumber: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '0.125rem',
      color: '#1F2937',
      whiteSpace: 'nowrap',
    },
    clueTextContent: {
      display: 'block',
      cursor: 'pointer',
      color: '#1F2937',
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: 1.4,
      textAlign: 'left',
    },
    themeBox: {
      backgroundColor: '#EFF6FF',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      border: '2px solid #BFDBFE',
    },
    themeTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1E40AF',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
    },
  };

  // --- Renderizado Setup ---
  if (gameState === 'setup') {
    const levelData = puzzleData[difficulty];
    return (
      <div style={styles.setupContainer}>
        <style>{C_EstilosAnimacion}</style>
        <h1 className="c-titulo-animado" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Crucigrama
        </h1>

        {/* Selector de Dificultad */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="difficulty" style={styles.selectLabel}>Dificultad:</label>
          <select 
            id="difficulty" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            style={styles.selectInput}
          >
            <option value="Básico">Básico: 3H, 2V - 10 min</option>
            <option value="Intermedio">Intermedio: 5H, 5V - 20 min</option>
            <option value="Avanzado">Avanzado: 8H, 7V - 30 min</option>
          </select>
        </div>

        {/* Tema del Nivel */}
        <div style={styles.themeBox}>
          <div style={styles.themeTitle}>
            <Ruler style={{ height: '1.5rem', width: '1.5rem' }} />
            <span>Tema: {levelData.theme}</span>
          </div>
        </div>

        {/* Catálogo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={toggleCatalog} 
            style={styles.buttonGray}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4B5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7280'}
          >
            {showCatalog ? 'Ocultar Catálogo' : 'Mostrar Catálogo'}
          </button>
          {showCatalog && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              border: '1px solid #E5E7EB', 
              borderRadius: '0.5rem', 
              backgroundColor: '#F9FAFB', 
              maxHeight: '12rem', 
              overflowY: 'auto' 
            }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Selecciona un set de crucigramas:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {randomizedSets.map(puzzleSet => {
                  const isSelected = selectedPuzzleSetId === puzzleSet.id;
                  const itemStyle = {
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `2px solid ${isSelected ? '#3B82F6' : '#D1D5DB'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? '#DBEAFE' : 'white',
                    boxShadow: isSelected ? '0 0 0 2px #BFDBFE' : 'none'
                  };

                  const wordsAcross = puzzleSet.puzzle?.solutions?.filter(s => s.direction === 'horizontal').map(s => s.word) || [];
                  const wordsDown = puzzleSet.puzzle?.solutions?.filter(s => s.direction === 'vertical').map(s => s.word) || [];
                  const allWords = [...new Set([...wordsAcross, ...wordsDown])];

                  return allWords.length > 0 ? (
                    <div 
                      key={puzzleSet.id} 
                      onClick={() => setSelectedPuzzleSetId(puzzleSet.id)} 
                      style={itemStyle}
                    >
                      <h4 style={{ fontWeight: '600', color: '#1F2937', margin: 0 }}>
                        {puzzleSet.name}
                      </h4>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#4B5563', 
                        marginTop: '0.25rem', 
                        marginBlockStart: 0, 
                        marginBlockEnd: 0 
                      }}>
                        <span style={{ fontWeight: '500' }}>Palabras:</span> {allWords.join(', ')}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Botón Iniciar */}
        <button
          onClick={startGame}
          disabled={!isSwalLoaded || !selectedPuzzleSetId}
          style={{
            ...styles.buttonBlue,
            opacity: (!isSwalLoaded || !selectedPuzzleSetId) ? 0.5 : 1,
            cursor: (!isSwalLoaded || !selectedPuzzleSetId) ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => { if (!e.target.disabled) e.target.style.backgroundColor = '#2563EB'; }}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
        >
          {!isSwalLoaded ? 'Cargando complementos...' : (selectedPuzzleSetId ? 'Jugar' : 'Selecciona un set')}
        </button>
      </div>
    );
  }

  // --- Renderizado Juego ---
  const { grid, numbers } = gridTemplate;
  const levelData = puzzleData[difficulty];
  const clues = activePuzzle?.solutions?.map(sol => {
    const startKey = `${sol.start[0]}-${sol.start[1]}`;
    const clueNumber = numbers?.get(startKey);
    return clueNumber ? { ...sol, number: clueNumber } : null;
  })
    ?.filter(clue => clue !== null)
    ?.sort((a, b) => (a.number || Infinity) - (b.number || Infinity)) || [];

  const horizontalClues = clues.filter(c => c.direction === 'horizontal');
  const verticalClues = clues.filter(c => c.direction === 'vertical');

  return (
    <div style={styles.gameContainer}>
      <style>{C_EstilosAnimacion}</style>
      
      {/* Cabecera */}
      <div style={styles.headerBar}>
        <div style={styles.headerItem} title="Nivel">
          {difficultySettings[difficulty].icon}
          <span style={styles.headerLabel}>Nivel:</span>
          <span style={styles.headerText}>{difficulty}</span>
        </div>
        <div style={styles.headerItem} title="Tema">
          <Ruler style={{ height: '1.25rem', width: '1.25rem', color: '#6B7280' }} />
          <span style={styles.headerLabel}>Tema:</span>
          <span style={styles.headerText}>{levelData.theme}</span>
        </div>
        <div style={styles.headerItem} title="Palabras Encontradas">
          <HelpCircle style={{ height: '1.25rem', width: '1.25rem', color: '#6B7280' }} />
          <span style={styles.headerLabel}>Palabras:</span>
          <span style={styles.headerText}>{solvedWords.length} de {activePuzzle?.solutions?.length || 0}</span>
        </div>
        <div style={styles.headerItem} title="Tiempo Restante">
          <Clock style={{ height: '1.25rem', width: '1.25rem', color: '#EF4444' }} />
          <span style={styles.headerLabel}>Tiempo:</span>
          <span style={{ ...styles.headerText, fontFamily: 'monospace', color: '#DC2626' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div style={styles.headerItem} title="Puntaje">
          <Award style={{ height: '1.25rem', width: '1.25rem', color: '#D97706' }} />
          <span style={styles.headerLabel}>Puntaje:</span>
          <span style={{ ...styles.headerText, fontWeight: 'bold', color: '#B45309' }}>{score}</span>
        </div>
      </div>

      {/* Contenido: Grid y Clues */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '1.5rem', 
        flexWrap: 'wrap', 
        justifyContent: 'center' 
      }}>
        {/* Cuadrícula */}
        <div style={styles.gridContainer}>
          {activePuzzle && grid.length > 0 && (
            <div
              style={{
                ...styles.gridTable,
                gridTemplateColumns: `repeat(${activePuzzle.gridSize}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, r) =>
                Array.isArray(row) && row.map((cell, c) => (
                  cell && typeof cell === 'object' ? (
                    <GridCell
                      key={`${r}-${c}`}
                      value={userGrid[r]?.[c] || ''}
                      isReadOnly={cell.isReadOnly}
                      number={cell.number}
                      onChange={(value) => handleCellChange(r, c, value)}
                      onFocus={() => handleCellFocus(r, c)}
                      isSolved={cell.isSolved}
                      isSelected={cell.isSelected}
                    />
                  ) : (
                    <div key={`${r}-${c}-invalid`} style={{
                      width: '2.75rem', 
                      height: '2.75rem', 
                      backgroundColor: '#FEE2E2'
                    }}></div>
                  )
                ))
              )}
            </div>
          )}
        </div>

        {/* Pistas */}
        <div style={styles.cluesOuterContainer}>
          {/* Horizontales */}
          <div style={styles.clueBox}>
            <h3 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.125rem', 
              marginBottom: '0.5rem', 
              color: '#1D4ED8', 
              margin: 0 
            }}>
              Horizontales
            </h3>
            <ul style={styles.clueList}>
              {horizontalClues.map(clue => {
                if (!clue.number) return null;
                const isSolved = solvedWords.includes(clue.id);
                const isSelected = selectedClue?.id === clue.id;
                return (
                  <li key={clue.id} style={styles.clueListItem}>
                    <button
                      onClick={() => checkWord(clue)}
                      disabled={isSolved}
                      style={{
                        ...styles.clueCheckButton,
                        opacity: isSolved ? 0.5 : 1,
                        cursor: isSolved ? 'default' : 'pointer'
                      }}
                      title="Verificar esta palabra"
                    >
                      H
                    </button>
                    <div style={styles.clueTextContainer}>
                      <span style={styles.clueNumber}>{clue.number}.</span>
                      <span
                        onClick={() => setSelectedClue(clue)}
                        style={{
                          ...styles.clueTextContent,
                          textDecoration: isSolved ? 'line-through' : 'none',
                          color: isSolved ? '#6B7280' : '#1F2937',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {clue.clue}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Verticales */}
          <div style={styles.clueBox}>
            <h3 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.125rem', 
              marginBottom: '0.5rem', 
              color: '#1D4ED8', 
              margin: 0 
            }}>
              Verticales
            </h3>
            <ul style={styles.clueList}>
              {verticalClues.map(clue => {
                if (!clue.number) return null;
                const isSolved = solvedWords.includes(clue.id);
                const isSelected = selectedClue?.id === clue.id;
                return (
                  <li key={clue.id} style={styles.clueListItem}>
                    <button
                      onClick={() => checkWord(clue)}
                      disabled={isSolved}
                      style={{
                        ...styles.clueCheckButton,
                        opacity: isSolved ? 0.5 : 1,
                        cursor: isSolved ? 'default' : 'pointer'
                      }}
                      title="Verificar esta palabra"
                    >
                      V
                    </button>
                    <div style={styles.clueTextContainer}>
                      <span style={styles.clueNumber}>{clue.number}.</span>
                      <span
                        onClick={() => setSelectedClue(clue)}
                        style={{
                          ...styles.clueTextContent,
                          textDecoration: isSolved ? 'line-through' : 'none',
                          color: isSolved ? '#6B7280' : '#1F2937',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {clue.clue}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Botón Rendirse */}
      {gameState === 'playing' && (
        <button 
          onClick={() => endGame(false)} 
          style={{ 
            marginTop: '1rem', 
            alignSelf: 'flex-end', 
            backgroundColor: '#DC2626', 
            color: 'white', 
            fontWeight: 'bold', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            border: 'none', 
            cursor: 'pointer' 
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#B91C1C'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#DC2626'}
        >
          Rendirse
        </button>
      )}
    </div>
  );
}