import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, List,
    Play, HelpCircle, RotateCcw, Info, Timer, Star, CheckSquare
} from 'lucide-react';
import Summary from './Summary';

// --- ESTILOS GLOBALES (Idénticos a Acertijo.jsx) ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700&display=swap');

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
        .card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-card); margin-bottom: 1.5rem; }
        .level-select-container { width: 100%; max-width: 64rem; background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; min-height: 90vh; }
        
        /* Botones de Navegación Inferior (Anterior, Vista Previa, Terminar) */
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

        /* Botones Generales del Juego */
        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-primary { background-color: var(--primary-blue); color: white; }
        .btn-secondary { background-color: var(--soft-white); color: var(--dark-gray); border: 1px solid #cbd5e0; }
        .btn-finish { background-color: var(--primary-blue); color: white; width: 100%; padding: 0.8rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        /* Estilos específicos de Ordenamiento (Adaptados a variables) */
        .exercise-item {
            background-color: var(--soft-white);
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .exercise-item:hover { border-color: var(--primary-blue); box-shadow: 0 2px 4px rgba(0, 119, 182, 0.2); }
        .exercise-item.selected {
            background-color: var(--light-blue);
            border-color: var(--primary-blue);
            color: var(--dark-blue);
            font-weight: 600;
            transform: scale(1.02);
        }

        /* Drag and Drop */
        .dnd-container { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: start; margin-top: 1.5rem; }
        .dnd-item { padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 500; margin-bottom: 0.75rem; background: white; }
        .dnd-item.interactive { cursor: grab; border: 1px dashed #a0aec0; }
        .dnd-item.interactive:hover { border-color: var(--primary-blue); border-style: solid; }
        .dnd-item.dragging { opacity: 0.5; background: var(--light-blue); border-color: var(--primary-blue); }
        
        .game-header { display: flex; flex-wrap: wrap; justify-content: space-around; background-color: var(--dark-blue); color: white; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; }
        .game-screen { width: 100%; max-width: 1000px; margin: 0 auto; }
        
        @media (max-width: 768px) {
            .dnd-container { grid-template-columns: 1fr; }
            .arrow-separator { transform: rotate(90deg); padding: 1rem 0; text-align: center; }
        }
    `}</style>
);

/* COMPONENTE PRINCIPAL */
export default function OrdenamientoInformacion() {
  const [view, setView] = useState('home'); // 'home' (setup), 'memory', 'game', 'summary'
  const [difficulty, setDifficulty] = useState('Básico');
  const [exercisePool, setExercisePool] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameTimerId, setGameTimerId] = useState(null);
  
  // Router Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Estados Juego
  const [staticList, setStaticList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const difficultySettings = useMemo(() => ({
    'Básico': { max: 3, time: 300, poolSize: 5 },
    'Intermedio': { max: 4, time: 600, poolSize: 6 },
    'Avanzado': { max: 5, time: 900, poolSize: 7 },
  }), []);

  // --- EFECTOS ---
  useEffect(() => {
    // Inyectar SweetAlert2 si no existe
    if (!document.getElementById('swal-script')) {
        const s = document.createElement('script');
        s.id = 'swal-script';
        s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        s.async = true;
        document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    const allExercises = EXERCISE_DATA[difficulty];
    const pool = shuffleArray([...allExercises]).slice(0, settings.poolSize);
    setExercisePool(pool);
    setSelectedExercises([]);
  }, [difficulty, difficultySettings]);

  useEffect(() => {
    if (view === 'game') {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setGameTimerId(timerId);
      return () => clearInterval(timerId);
    } else {
      if (gameTimerId) clearInterval(gameTimerId);
    }
  }, [view]);

  useEffect(() => {
    let timer;
    if (view === 'memory') {
      timer = setTimeout(showGameScreen, 5000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [view, currentExerciseIndex]);

  useEffect(() => {
     window.scrollTo(0, 0);
  }, [view]);

  const loadExercise = (exercise) => {
    const shuffled1 = shuffleArray([...exercise.steps]);
    let shuffled2 = shuffleArray([...exercise.steps]);
    while (JSON.stringify(shuffled2) === JSON.stringify(exercise.steps)) {
      shuffled2 = shuffleArray([...exercise.steps]);
    }
    setStaticList(shuffled1.map((step, i) => ({ id: `static-${i}`, content: step })));
    setUserList(shuffled2.map((step, i) => ({ id: `user-${i}`, content: step })));
  };

  const handleDifficultyChange = (level) => setDifficulty(level);

  const handleExerciseToggle = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(e => e.id === exercise.id);
      const max = difficultySettings[difficulty].max;
      if (isSelected) return prev.filter(e => e.id !== exercise.id);
      if (prev.length < max) return [...prev, exercise];
      return prev;
    });
  };

  const startGame = () => {
    if (selectedExercises.length === 0) return;
    setTimeLeft(difficultySettings[difficulty].time);
    setScore(0);
    setCurrentExerciseIndex(0);
    loadExercise(selectedExercises[0]);
    setView('memory');
  };

  const showGameScreen = () => setView('game');

  const handleTimeUp = () => {
    if (window.Swal) {
      window.Swal.fire({
        title: '¡Tiempo agotado!',
        html: `Puntaje Final: <b>${score}</b>`,
        icon: 'warning',
        confirmButtonText: 'Ver Resumen'
      }).then(() => {
        goToSummary();
      });
    } else {
      goToSummary();
    }
  };

  const checkSolution = () => {
    const currentExercise = selectedExercises[currentExerciseIndex];
    const userOrder = userList.map(item => item.content);
    const correctOrder = currentExercise.steps;

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      const newScore = score + 10;
      setScore(newScore);
      
      if (window.Swal) {
        window.Swal.fire({ title: '¡Correcto!', icon: 'success', timer: 1000, showConfirmButton: false })
        .then(() => {
          const nextIndex = currentExerciseIndex + 1;
          if (nextIndex < selectedExercises.length) {
            setCurrentExerciseIndex(nextIndex);
            loadExercise(selectedExercises[nextIndex]);
            setView('memory');
          } else {
            window.Swal.fire({
              title: '¡Felicidades!',
              html: `Puntaje Final: <b>${newScore}</b>`,
              icon: 'success',
              confirmButtonText: 'Ver Resumen'
            }).then(() => {
              goToSummary();
            });
          }
        });
      }
    } else {
      if (window.Swal) window.Swal.fire({ title: 'Incorrecto', text: 'Intenta nuevamente.', icon: 'error' });
    }
  };
  
  // LOGICA DnD
  const handleDragStart = (e, item, index) => {
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, index }));
    e.currentTarget.classList.add('dragging');
  };
  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.index === targetIndex) return;
    let newList = [...userList];
    const [removed] = newList.splice(draggedItem.index, 1);
    newList.splice(targetIndex, 0, removed);
    setUserList(newList);
    setDraggedItem({ ...draggedItem, index: targetIndex });
  };
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedItem(null);
  };

  // LOGICA SUMMARY
  const goToSummary = () => {
    setView('summary');
    navigate('/settings?view=summary', { 
        replace: true,
        state: location.state 
    });
  };

  // --- RENDERS ---

  const renderSetupScreen = () => {
    const { max } = difficultySettings[difficulty];
    return (
      <div className="level-select-container">
        <h1 style={{textAlign:'center', color:'var(--dark-blue)', fontSize:'2.5rem', fontWeight:800, marginBottom:'2rem'}}>
          Ordenamiento de Información
        </h1>

        <div className="card">
          <h2>Selecciona Dificultad:</h2>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
            {['Básico', 'Intermedio', 'Avanzado'].map(level => (
              <button
                key={level}
                className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleDifficultyChange(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
          {/* SE HA CORREGIDO AQUI: Se eliminó maxHeight y overflow:hidden del padre para permitir crecimiento flexible */}
          <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <h2>Selecciona Ejercicios ({selectedExercises.length} / {max}):</h2>
            {/* SE HA CORREGIDO AQUI: Se aumentó maxHeight a 350px y se agregó padding para evitar cortes */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', overflowY: 'auto', maxHeight: '350px', padding: '0.5rem'}}>
              {exercisePool.map(exercise => (
                <div
                  key={exercise.id}
                  className={`exercise-item ${selectedExercises.find(e => e.id === exercise.id) ? 'selected' : ''}`}
                  onClick={() => handleExerciseToggle(exercise)}
                >
                  {exercise.title}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', opacity:0.5, color:'var(--primary-blue)'}}>
             <List size={100} />
          </div>
        </div>

        {/* BOTONES DE NAVEGACION ESTILO ACERTIJO */}
        <div style={{display:'flex', gap:'1rem', marginTop:'auto', padding:'0 1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button 
                onClick={() => navigate(-1)} 
                className="nav-action-btn"
            >
                <ArrowLeft size={20}/> Anterior
            </button>
            
            <button 
                onClick={startGame} 
                disabled={selectedExercises.length === 0} 
                className="nav-action-btn"
            >
                <Play size={20}/> Vista Previa
            </button>
            
            <button 
                onClick={goToSummary} 
                disabled={selectedExercises.length === 0} 
                className="nav-action-btn"
                style={{
                    backgroundColor: selectedExercises.length === 0 ? 'var(--gray-secondary)' : 'var(--primary-blue)',
                }}
            >
                <CheckCircle size={20}/> Terminar Configuración
            </button>
        </div>
      </div>
    );
  };
  
  const renderGameHeader = () => (
    <div className="game-header">
      <div className="header-item">Nivel: <b>{difficulty}</b></div>
      <div className="header-item"><Timer size={16} inline/> <b>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</b></div>
      <div className="header-item"><List size={16} inline/> <b>{currentExerciseIndex + 1} / {selectedExercises.length}</b></div>
      <div className="header-item"><Star size={16} inline/> <b>{score}</b></div>
    </div>
  );
  
  const renderMemoryScreen = () => {
    const exercise = selectedExercises[currentExerciseIndex];
    return (
      <div className="game-screen">
        {renderGameHeader()}
        <div className="card" style={{textAlign:'center'}}>
          <h1 style={{color:'var(--primary-blue)'}}>{exercise.title}</h1>
          <p>{exercise.description}</p>
          <p style={{color:'var(--danger-red)', fontWeight:'bold'}}>¡Memoriza el orden! 5 segundos...</p>
          <div style={{background:'#f0f9ff', padding:'1rem', border:'2px dashed var(--primary-blue)', borderRadius:'1rem', display:'inline-block', textAlign:'left'}}>
            <ol style={{margin:0, paddingLeft:'1.5rem', fontSize:'1.1rem', color:'var(--dark-blue)', fontWeight:600}}>
                {exercise.steps.map((step, index) => <li key={index} style={{marginBottom:'0.5rem'}}>{step}</li>)}
            </ol>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGameScreen = () => {
    const exercise = selectedExercises[currentExerciseIndex];
    return (
      <div className="game-screen">
        {renderGameHeader()}
        <div className="card" style={{textAlign:'center'}}>
          <h1 style={{color:'var(--primary-blue)', margin:0}}>{exercise.title}</h1>
          <p style={{color:'var(--gray-secondary)'}}>{exercise.description}</p>
        </div>
        
        <div className="dnd-container">
          <div className="dnd-column">
            <h3 style={{textAlign:'center', color:'var(--gray-secondary)'}}>Opciones</h3>
            <div className="card" style={{background:'#f7fafc', minHeight:'300px'}}>
              {staticList.map((item) => (
                <div key={item.id} className="dnd-item" style={{background:'white', color:'#4a5568'}}>
                  {item.content}
                </div>
              ))}
            </div>
          </div>
          
          <div className="arrow-separator" style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'#718096'}}>
            <ArrowLeft size={48} style={{transform: 'rotate(180deg)'}} />
          </div>
          
          <div className="dnd-column">
            <h3 style={{textAlign:'center', color:'var(--primary-blue)'}}>Tu Orden</h3>
            <div className="card" onDragOver={(e) => e.preventDefault()} style={{minHeight:'300px'}}>
              {userList.map((item, index) => (
                <div
                  key={item.id}
                  className={`dnd-item interactive ${draggedItem?.item.id === item.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <span className="drag-handle" style={{marginRight:'0.75rem', color:'#a0aec0', cursor:'grab'}}>::</span> {item.content}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="game-actions" style={{display:'flex', justifyContent:'space-between', marginTop:'2rem'}}>
           <button className="btn btn-secondary" onClick={() => {
             if (window.Swal) {
               window.Swal.fire({
                 title: '¿Terminar el juego?',
                 text: 'Tu progreso actual se guardará',
                 icon: 'question',
                 showCancelButton: true,
                 confirmButtonText: 'Ir a Resumen',
                 cancelButtonText: 'Cancelar'
               }).then((result) => {
                 if (result.isConfirmed) {
                   goToSummary();
                 }
               });
             } else {
               goToSummary();
             }
           }}>Finalizar Juego</button>
           <button className="btn btn-primary" onClick={checkSolution}>¡Verificar Solución!</button>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container">
      <GlobalStyles />
      {view === 'summary' && (
        <Summary 
            config={{ difficulty, timeLimit: difficultySettings[difficulty].time, exercises: selectedExercises }} 
            onBack={() => setView('home')} 
        />
      )}
      {view === 'home' && renderSetupScreen()}
      {view === 'memory' && renderMemoryScreen()}
      {view === 'game' && renderGameScreen()}
    </div>
  );
}

// --- DATA ---
function shuffleArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const EXERCISE_DATA = {
  'Básico': [
    { id: 'b1', title: 'Lanzar un satélite', description: 'Pasos para lanzar un satélite.', steps: ['Construir el satélite', 'Montarlo en el cohete', 'Pruebas de sistemas', 'Encender motores', 'Liberar en órbita'] },
    { id: 'b2', title: 'Usar telescopio', description: 'Pasos para observar planetas.', steps: ['Buscar lugar oscuro', 'Colocar telescopio', 'Apuntar al planeta', 'Enfocar imagen', 'Registrar observación'] },
    { id: 'b3', title: 'Foto satelital', description: 'Capturar imagen del espacio.', steps: ['Encender cámaras', 'Apuntar zona', 'Ajustar enfoque', 'Capturar imagen', 'Enviar a Tierra'] },
    { id: 'b4', title: 'Uso de GPS', description: 'Cómo funciona el GPS.', steps: ['Activar dispositivo', 'Recibir señales', 'Calcular posición', 'Mostrar coordenadas', 'Indicar ruta'] },
    { id: 'b5', title: 'Detectar cometa', description: 'Descubrimiento astronómico.', steps: ['Revisar imágenes', 'Identificar objeto', 'Comparar posición', 'Confirmar cometa', 'Anunciar hallazgo'] }
  ],
  'Intermedio': [
    { id: 'i1', title: 'Iluminación auto', description: 'Evaluar iluminación.', steps: ['Instalar sensor', 'Prueba manual', 'Simular paso', 'Observar encendido', 'Ajustar sensor'] },
    { id: 'i2', title: 'Bici eléctrica', description: 'Evaluar bicicleta.', steps: ['Cargar batería', 'Encender sistema', 'Probar velocidad', 'Medir duración', 'Registrar datos'] },
    { id: 'i3', title: 'Horno inteligente', description: 'Evaluar horno.', steps: ['Encender horno', 'Colocar alimento', 'Verificar cocción', 'Observar resultado', 'Calificar eficiencia'] },
    { id: 'i4', title: 'Riego auto', description: 'Sistema de riego.', steps: ['Programar horario', 'Activar sistema', 'Verificar alcance', 'Revisar apagado', 'Proponer ajustes'] },
    { id: 'i5', title: 'Alarma seguridad', description: 'Prueba de alarma.', steps: ['Simular evento', 'Escuchar alarma', 'Comprobar rapidez', 'Revisar señal', 'Registrar resultado'] },
    { id: 'i6', title: 'Casa domótica', description: 'Evaluar automatización.', steps: ['Conectar dispositivos', 'Comandos voz', 'Verificar ejecución', 'Revisar consumo', 'Sugerir mejoras'] }
  ],
  'Avanzado': [
    { id: 'a1', title: 'Casa sustentable', description: 'Construcción eco.', steps: ['Diseñar estructura', 'Reunir equipo', 'Construir obra', 'Instalar solares', 'Evaluar impacto'] },
    { id: 'a2', title: 'Ahorro agua', description: 'Sistema escolar.', steps: ['Identificar fugas', 'Diseñar sistema', 'Instalar equipos', 'Probar con alumnos', 'Evaluar ahorro'] },
    { id: 'a3', title: 'Riego huerto', description: 'Automatización agrícola.', steps: ['Medir terreno', 'Diseñar red', 'Instalar mangueras', 'Probar horario', 'Evaluar crecimiento'] },
    { id: 'a4', title: 'Paneles rurales', description: 'Energía solar.', steps: ['Identificar necesidad', 'Diseñar sistema', 'Instalar paneles', 'Conectar red', 'Evaluar costos'] },
    { id: 'a5', title: 'Transporte escolar', description: 'Mejora logística.', steps: ['Identificar problemas', 'Diseñar rutas', 'Revisar vehículos', 'Comunicar cambios', 'Evaluar puntualidad'] },
    { id: 'a6', title: 'Alimentos sanos', description: 'Nutrición escolar.', steps: ['Detectar necesidad', 'Crear menú', 'Organizar cocina', 'Implementar venta', 'Evaluar consumo'] },
    { id: 'a7', title: 'Reciclaje', description: 'Gestión residuos.', steps: ['Colocar botes', 'Enseñar separación', 'Recolectar material', 'Entregar centro', 'Evaluar reducción'] }
  ]
};