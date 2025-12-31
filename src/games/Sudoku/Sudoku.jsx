import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Summary from './Summary';

// --- ESTILOS CSS (Integrados en el componente) ---
const SudokuStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    
    :root {
      --main-bg-color: #f0f2f5;
      --container-bg-color: #ffffff;
      --border-color: #cccccc;
      --text-color-primary: #333333;
      --text-color-secondary: #555555;
      --button-bg-color: #2c6ac2;
      --button-hover-color: #22549a;
      --grid-border-strong: #34495e;
      --grid-border-light: #bdc3c7;
      --font-family: 'Roboto', sans-serif;
      --info-color: #0d6efd;
      --cell-hover-bg: #e8f0fe;
    }

    


    .rules-card {
      border: 1px solid var(--border-color);
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      border-radius: 8px;
    }
    
    .rules-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--info-color);
    }
    .rules-card p {
        margin: 0;
        color: var(--text-color-secondary);
        line-height: 1.6;
    }
    
    .game-area {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4rem; /* Aumenta el espacio entre la info y la cuadrícula */
        flex-wrap: wrap;
    }

    .game-info {
        font-size: 1.2rem;
        line-height: 2.5; /* Aumenta el espaciado vertical */
        color: var(--text-color-primary);
        flex-shrink: 0;
        font-weight: 500;
    }
    .game-info span {
      font-weight: 700;
      color: var(--info-color);
    }

    .sudoku-grid {
        border-collapse: collapse;
        border: 3px solid var(--grid-border-strong);
        width: 100%;
        max-width: 550px;
        aspect-ratio: 1;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        overflow: hidden;
    }
    
    .cell-container {
      border: 1px solid var(--grid-border-light);
      position: relative; /* Para el z-index del input */
      transition: background-color 0.2s ease;
    }
    
    .cell-container:not(.readonly-cell):hover {
        background-color: var(--cell-hover-bg);
    }

    /* --- REGLAS DE CUADRÍCULA --- */
    /* Nivel Avanzado 9x9 (Cuadrícula 3x3) */
    .sudoku-grid.size-9 tr:nth-child(3n):not(:last-child) .cell-container { border-bottom: 3px solid var(--grid-border-strong); }
    /* CORRECCIÓN: Se aplica el borde derecho al 'td' que TAMBIÉN es '.cell-container' */
    .sudoku-grid.size-9 td.cell-container:nth-child(3n):not(:last-child) { border-right: 3px solid var(--grid-border-strong); }
    
    /* Nivel Intermedio 6x6 (Cuadrícula 2x3) */
    .sudoku-grid.size-6 tr:nth-child(2n):not(:last-child) .cell-container { border-bottom: 3px solid var(--grid-border-strong); }
    /* CORRECCIÓN: Se aplica el borde derecho al 'td' que TAMBIÉN es '.cell-container' */
    .sudoku-grid.size-6 td.cell-container:nth-child(3n):not(:last-child) { border-right: 3px solid var(--grid-border-strong); }
    /* --- FIN DE REGLAS DE CUADRÍCULA --- */
    
    .cell {
        width: 100%;
        height: 100%;
        border: none;
        text-align: center;
        font-size: clamp(1.4rem, 5vw, 2rem);
        font-weight: 500;
        box-sizing: border-box;
        padding: 0;
        background: transparent;
        transition: all 0.15s ease-in-out;
        color: var(--info-color);
        caret-color: var(--info-color);
        position: relative;
    }

    .cell:focus {
        outline: none;
        transform: scale(1.1);
        z-index: 10;
        box-shadow: 0 0 20px rgba(13, 110, 253, 0.5);
        background-color: #fff;
        border-radius: 4px;
    }
    
    .cell.readonly {
        font-weight: 700;
        color: var(--grid-border-strong);
        cursor: not-allowed;
    }
    
    .check-btn {
      margin-top: 2rem;
      width: 100%;
      max-width: 500px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    /* Setup Screen Specifics */
    .setup-screen {
        text-align: center;
    }
    
    /* Animated Title Styles */
    .animated-title {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 3rem;
    }
    .title-char {
        --char-size: clamp(2.5rem, 10vw, 4.5rem);
        width: var(--char-size);
        height: var(--char-size);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: calc(var(--char-size) * 0.8);
        font-weight: 700;
        color: white;
        background-color: var(--button-bg-color);
        border: 2px solid #1e4f92;
        border-radius: 8px;
        box-shadow: 0 5px 0 #1e4f92;
        transform: scale(0);
        animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    @keyframes popIn {
      to {
        transform: scale(1);
      }
    }
    
     .setup-card {
        display: inline-flex;
        flex-direction: column;
        gap: 1.5rem;
        border: 1px solid var(--border-color);
        padding: 2rem;
        border-radius: 8px;
     }
    .input-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
    }
    .input-group label {
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    .input-group select {
        padding: 0.5rem;
        width: 250px;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid var(--border-color);
    }
    
    .btn {
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        font-weight: 500;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        background-color: var(--button-bg-color);
        color: white;
    }
    .btn:hover {
        background-color: var(--button-hover-color);
    }
    .btn.btn-secondary {
        background-color: #6c757d;
    }

    /* Modal Styles from images */
    .modal-overlay { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background-color: rgba(0, 0, 0, 0.4); 
      display: flex; justify-content: center; align-items: center; z-index: 1000; 
    }
    .modal-content { 
      background: white; 
      padding: 2rem; 
      border-radius: 8px; 
      text-align: center; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.15); 
      border: 1px solid var(--border-color);
      width: 90%; 
      max-width: 350px; 
    }
    .modal-content h2 { 
      margin-top: 0; 
      font-size: 1.5rem;
      font-weight: 500;
    }
    .modal-score { 
      font-size: 1.2rem; 
      margin: 1.5rem 0; 
    }
    .modal-score span { 
      font-weight: 700; 
      color: #28a745;
      font-size: 1.8rem;
      display: block;
    }
    .modal-buttons { 
      margin-top: 1.5rem; 
      display: flex; 
      justify-content: center; 
      gap: 1rem; 
    }
  `}</style>
);

// --- ICONOS SVG ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>;

// --- COMPONENTE TÍTULO ANIMADO ---
const AnimatedTitle = () => (
    <div className="animated-title">
        {'SUDOKU'.split('').map((char, index) => (
            <div key={index} className="title-char" style={{ animationDelay: `${index * 0.1}s` }}>
                {char}
            </div>
        ))}
    </div>
);


// --- LÓGICA DE GENERACIÓN DE SUDOKU ---
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getSudokuSymbols = (size, type) => {
  switch (type) {
    case 'letters':
      return Array.from({ length: size }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
    case 'fractions':
      return Array.from({ length: size }, (_, i) => `${i + 1}/${size}`);
    case 'numbers':
    default:
      return Array.from({ length: size }, (_, i) => i + 1);
  }
};

const generateValidSudoku = (size, contentType) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(0));
  const symbols = getSudokuSymbols(size, contentType);
  
  const isSafe = (row, col, symbol) => {
    for (let x = 0; x < size; x++) {
      if (grid[row][x] === symbol || grid[x][col] === symbol) return false;
    }
    
    let subGridHeight, subGridWidth;
    if (size === 9) { [subGridHeight, subGridWidth] = [3, 3]; }
    else if (size === 6) { [subGridHeight, subGridWidth] = [2, 3]; }
    else { return true; } // No subgrid check for 3x3

    const startRow = row - (row % subGridHeight);
    const startCol = col - (col % subGridWidth);
    for (let i = 0; i < subGridHeight; i++) {
      for (let j = 0; j < subGridWidth; j++) {
        if (grid[i + startRow][j + startCol] === symbol) return false;
      }
    }
    return true;
  };

  function solve() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) {
          for (const symbol of shuffleArray([...symbols])) {
            if (isSafe(i, j, symbol)) {
              grid[i][j] = symbol;
              if (solve()) return true;
              grid[i][j] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
  return grid;
};

const createPuzzle = (solution) => {
    const puzzle = solution.map(row => [...row]);
    const size = puzzle.length;
    
    // --- CAMBIO SOLICITADO (Nivel Básico) ---
    // Se aumentó el porcentaje de 0.3 a 0.5 para el tamaño 3 (3x3)
    // Esto incrementa los espacios vacíos de 2 (Math.floor(9*0.3)) a 4 (Math.floor(9*0.5))
    const removalPercentage = { 3: 0.5, 6: 0.45, 9: 0.55 };
    // --- FIN DEL CAMBIO ---
    
    const cellsToRemove = Math.floor(size * size * (removalPercentage[size] || 0.5));
    
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        removed++;
      }
    }
    return puzzle;
};

// --- COMPONENTE PRINCIPAL ---
const SudokuGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('home'); // 'home', 'summary'
  const [gameState, setGameState] = useState('setup');
  const [level, setLevel] = useState({ size: 3, name: 'Básico: 3x3' });
  const [contentType, setContentType] = useState('numbers');

  const [solution, setSolution] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [playerGrid, setPlayerGrid] = useState([]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(null);

  const availableLevels = [
    { size: 3, name: 'Básico: 3x3' },
    { size: 6, name: 'Intermedio: 6x6' },
    { size: 9, name: 'Avanzado: 9x9' },
  ];

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleStartGame = useCallback(() => {
    const newSolution = generateValidSudoku(level.size, contentType);
    const newPuzzle = createPuzzle(newSolution);
    setSolution(newSolution);
    setInitialGrid(newPuzzle);
    setPlayerGrid(newPuzzle.map(row => [...row]));
    setTime(0);
    setScore(0);
    setShowModal(null);
    setGameState('playing');
  }, [level, contentType]);
  
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newGrid = playerGrid.map(row => [...row]);
    let processedValue = value === '' ? null : value;

    if (processedValue !== null) {
        if (contentType === 'numbers') {
            if (!/^[1-9]$/.test(processedValue)) return;
            processedValue = parseInt(value);
        } else if (contentType === 'letters') {
            if (!/^[A-Z]$/i.test(processedValue)) return;
            processedValue = value.toUpperCase();
        }
    }
    
    newGrid[rowIndex][colIndex] = processedValue;
    setPlayerGrid(newGrid);
  };

  const handleCheckSolution = () => {
    let isComplete = true, isCorrect = true;
    for (let i = 0; i < level.size; i++) {
        for (let j = 0; j < level.size; j++) {
            if (playerGrid[i][j] === null) {
                isComplete = false;
            } else if (String(playerGrid[i][j]) !== String(solution[i][j])) {
                isCorrect = false;
            }
        }
    }

    if (!isComplete) { setShowModal('error-incomplete'); return; }
    if (!isCorrect) { setShowModal('error-incorrect'); return; }
    
    let cellsToFill = 0;
    initialGrid.forEach(row => {
      row.forEach(cell => {
        if (cell === null) {
          cellsToFill++;
        }
      });
    });

    const finalScore = cellsToFill * 10;
    setScore(finalScore);
    setShowModal('success');
  };
  
  const handleEndGame = () => { setGameState('setup'); setShowModal(null); };
  const formatTime = (s) => `${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} seg`;

  const handleContinueToSummary = () => {
    setView('summary');
    // Actualizar la URL para que el ProgressBar muestre 100% PERO manteniendo el state
    navigate('/settings?view=summary', {
      replace: true,
      state: location.state // Pasar el state que ya existía
    });
  };

  const renderGrid = () => (
    <table className={`sudoku-grid size-${level.size}`}>
        <tbody>
        {playerGrid.map((row, rowIndex) => (
            <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
                const isReadOnly = initialGrid[rowIndex]?.[colIndex] !== null;
                return (
                <td key={colIndex} className={`cell-container ${isReadOnly ? 'readonly-cell' : ''}`}>
                    <input
                    type="text"
                    className={`cell ${isReadOnly ? 'readonly' : ''}`}
                    value={cell === null ? '' : cell}
                    readOnly={isReadOnly}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    maxLength={contentType === 'fractions' ? 3 : 1}
                    />
                </td>
                );
            })}
            </tr>
        ))}
        </tbody>
    </table>
  );

  return (
    <>
      <SudokuStyles />

      {/* VISTA: RESUMEN */}
      {view === 'summary' && (
        <Summary
          config={{
            levelSize: level.size,
            levelName: level.name,
            contentType: contentType
          }}
          onBack={() => setView('home')}
        />
      )}

      {/* VISTA: JUEGO */}
      {view === 'home' && (
        <>
          {gameState === 'setup' ? (
            <div className="sudoku-container setup-screen">
              <AnimatedTitle />
              <div className="setup-card">
                <div className="input-group">
                  <label htmlFor="level-select">Seleccione el nivel del sudoku:</label>
                  <select id="level-select" value={level.size} onChange={(e) => setLevel(availableLevels.find(l => l.size === parseInt(e.target.value)))}>
                    {availableLevels.map(l => <option key={l.size} value={l.size}>{l.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="content-type-select">Tipo de contenido:</label>
                  <select id="content-type-select" value={contentType} onChange={(e) => setContentType(e.target.value)}>
                    <option value="numbers">Números del 1 al 9</option>
                    <option value="letters">Letras de A a Z</option>
                    <option value="fractions">Fracciones equivalentes</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <button className="btn" onClick={handleStartGame}><PlayIcon /> Vista Previa</button>
                  <button className="btn" onClick={handleContinueToSummary} style={{ background: '#28a745' }}>Continuar</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="sudoku-container game-screen">
          <div className="rules-card">
            <h3>Reglas Básicas:</h3>
            <p>Completa los espacios vacíos. No se puede repetir ningún símbolo en una misma fila, columna o (si aplica) subcuadrícula.</p>
          </div>
          <div className="game-area">
            <div className="game-info">
                <p>Nivel: <span>{level.name}</span></p>
                <p>Tiempo: <span>{formatTime(time)}</span></p>
                <p>Puntaje: <span>{score} puntos</span></p>
            </div>
            {renderGrid()}
          </div>
          <button className="btn check-btn" onClick={handleCheckSolution}>
            <CheckIcon /> Verificar Solución
          </button>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                {showModal === 'success' && <>
                  <h2>¡Has obtenido!</h2>
                  <p className="modal-score"><span>{score} Puntos</span></p>
                  <div className="modal-buttons">
                    <button className="btn" onClick={handleStartGame}>Siguiente Juego</button>
                    <button className="btn btn-secondary" onClick={handleEndGame}>Finalizar Juego</button>
                  </div>
                </>}
                {showModal === 'error-incorrect' && <>
                    <h2>Error, intente nuevamente</h2>
                    <p>Tienes otra oportunidad.</p>
                    <div className="modal-buttons">
                        <button className="btn" onClick={() => setShowModal(null)}>Continuar</button>
                        <button className="btn btn-secondary" onClick={handleEndGame}>Finalizar Juego</button>
                    </div>
                </>}
                 {showModal === 'error-incomplete' && <>
                    <h2>Juego en curso</h2>
                     <p>Completa todas las celdas para ver el resultado.</p>
                    <div className="modal-buttons">
                        <button className="btn" onClick={() => setShowModal(null)}>Continuar</button>
                        <button className="btn btn-secondary" onClick={handleEndGame}>Finalizar Juego</button>
                    </div>
                </>}
              </div>
            </div>
          )}
        </div>
          )}
        </>
      )}
    </>
  );
};

export default SudokuGame;
