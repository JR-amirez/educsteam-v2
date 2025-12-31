import React, { useState, useEffect, useMemo, useCallback } from 'react';

/* COMPONENTES AUXILIARES
  Estos componentes nos ayudan a manejar los estilos y las librerías
  sin necesidad de archivos externos.
*/

/**
 * Componente para inyectar los estilos CSS y la librería SweetAlert2
 * en el <head> del documento, evitando conflictos de estilos.
 */
const StyleInjector = () => {
  useEffect(() => {
    // Cargar SweetAlert2
    const swalScriptId = 'sweetalert2-script';
    if (!document.getElementById(swalScriptId)) {
      const script = document.createElement('script');
      script.id = swalScriptId;
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      script.async = true;
      document.head.appendChild(script);
    }

    // Inyectar los estilos CSS del juego
    const styleElementId = 'algoritmos-game-styles';
    if (!document.getElementById(styleElementId)) {
      const style = document.createElement('style');
      style.id = styleElementId;
      style.innerHTML = CSS_STYLES; // CSS_STYLES se define al final del archivo
      document.head.appendChild(style);
    }
  }, []);

  return null; // Este componente no renderiza nada
};

/**
 * Contenedor principal del juego.
 * Usamos un ID único para encapsular todos nuestros estilos.
 */
export default function App() {
  const [screen, setScreen] = useState('setup'); // 'setup', 'memory', 'game'
  const [difficulty, setDifficulty] = useState('Básico');
  const [exercisePool, setExercisePool] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameTimerId, setGameTimerId] = useState(null);
  
  // Estado para la fase de juego (Drag and Drop)
  const [staticList, setStaticList] = useState([]);
  const [userList, setUserList] = useState([]);
  
  // Estado para el ítem que se está arrastrando
  const [draggedItem, setDraggedItem] = useState(null);

  const difficultySettings = useMemo(() => ({
    'Básico': { max: 3, time: 300, poolSize: 5 }, // 5 minutos
    'Intermedio': { max: 4, time: 600, poolSize: 6 }, // 10 minutos
    'Avanzado': { max: 5, time: 900, poolSize: 8 }, // 15 minutos
  }), []);

  // --- EFECTOS (LIFECYCLE) ---

  // Inicializa la lista de ejercicios al cambiar la dificultad
  useEffect(() => {
    const settings = difficultySettings[difficulty];
    const allExercises = EXERCISE_DATA[difficulty];
    // Tomamos solo la cantidad necesaria para el pool
    const pool = shuffleArray([...allExercises]).slice(0, settings.poolSize);
    setExercisePool(pool);
    setSelectedExercises([]); // Reseteamos la selección
  }, [difficulty, difficultySettings]);

  // Maneja el temporizador del juego
  useEffect(() => {
    if (screen === 'game') {
      // Iniciar el temporizador
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

      // Limpieza al desmontar o cambiar de pantalla
      return () => clearInterval(timerId);
    } else {
      // Detener el temporizador si no estamos en la pantalla de juego
      if (gameTimerId) clearInterval(gameTimerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Maneja el temporizador de la pantalla "memory"
  useEffect(() => {
    let timer;
    if (screen === 'memory') {
      // Iniciar temporizador de 5 segundos para pasar a la pantalla de juego
      timer = setTimeout(showGameScreen, 5000);
    }
    
    // Limpieza: se ejecuta si la pantalla cambia o el componente se desmonta
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, currentExerciseIndex]); // Depende de screen y del ejercicio actual

  // Carga el ejercicio actual
  const loadExercise = (exercise) => {
    // Creamos dos listas barajadas
    const shuffled1 = shuffleArray([...exercise.steps]);
    let shuffled2 = shuffleArray([...exercise.steps]);

    // Nos aseguramos de que la segunda lista (la interactiva) no sea igual a la solución
    while (JSON.stringify(shuffled2) === JSON.stringify(exercise.steps)) {
      shuffled2 = shuffleArray([...exercise.steps]);
    }

    setStaticList(shuffled1.map((step, i) => ({ id: `static-${i}`, content: step })));
    setUserList(shuffled2.map((step, i) => ({ id: `user-${i}`, content: step })));
  };

  // --- MANEJO DE ESTADO DEL JUEGO ---

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleExerciseToggle = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(e => e.id === exercise.id);
      const max = difficultySettings[difficulty].max;
      if (isSelected) {
        // Deseleccionar
        return prev.filter(e => e.id !== exercise.id);
      } else {
        // Seleccionar, si no hemos llegado al límite
        if (prev.length < max) {
          return [...prev, exercise];
        }
      }
      return prev; // No hay cambios si se alcanzó el límite
    });
  };

  const startGame = () => {
    if (selectedExercises.length === 0) {
      // Usar SweetAlert para el error
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Espera!',
          text: 'Debes seleccionar al menos un ejercicio para comenzar.',
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
      } else {
        console.error('SweetAlert no está cargado');
      }
      return;
    }
    
    setTimeLeft(difficultySettings[difficulty].time);
    setScore(0);
    setCurrentExerciseIndex(0);
    loadExercise(selectedExercises[0]);
    setScreen('memory'); // Empezar por la pantalla de memoria
  };

  const showGameScreen = () => {
    setScreen('game');
  };

  const handleTimeUp = () => {
    setScreen('setup'); // Volver a la pantalla de inicio
    if (window.Swal) {
      window.Swal.fire({
        title: '¡Tiempo agotado!',
        text: '¡Puedes mejorar, Intenta nuevamente!',
        icon: 'error',
        confirmButtonText: 'Reintentar'
      });
    }
  };

  const resetGame = () => {
    setScreen('setup');
    if (gameTimerId) clearInterval(gameTimerId);
    setGameTimerId(null);
    setSelectedExercises([]);
    setExercisePool([]);
    // Reiniciar la dificultad fuerza la recarga de ejercicios
    setDifficulty('Básico'); 
    // Forzar la recarga
    setTimeout(() => handleDifficultyChange('Básico'), 0);
  };

  const checkSolution = () => {
    const currentExercise = selectedExercises[currentExerciseIndex];
    const userOrder = userList.map(item => item.content);
    const correctOrder = currentExercise.steps;

    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Solución correcta!',
          html: '¡Has obtenido!<br><b>10 Puntos</b>',
          icon: 'success',
          confirmButtonText: 'Siguiente'
        }).then(() => {
          // Cargar siguiente ejercicio o terminar el juego
          const nextIndex = currentExerciseIndex + 1;
          if (nextIndex < selectedExercises.length) {
            // Siguiente ejercicio
            setCurrentExerciseIndex(nextIndex);
            loadExercise(selectedExercises[nextIndex]);
            setScreen('memory'); // Mostrar la memoria para el siguiente
          } else {
            // Juego terminado
            setScreen('setup'); // Volver al inicio
            window.Swal.fire({
              title: '¡Felicidades, lo lograste!',
              html: `Total: <b>${newScore} Puntos</b>`,
              icon: 'success',
              confirmButtonText: 'Jugar de nuevo'
            }).then(() => {
                resetGame();
            });
          }
        });
      }
    } else {
      // Solución incorrecta
      if (window.Swal) {
        window.Swal.fire({
          title: 'Solución incorrecta',
          text: 'Intenta nuevamente. ¡Revisa el orden!',
          icon: 'error',
          confirmButtonText: 'Volver'
        });
      }
    }
  };
  
  // --- LÓGICA DE DRAG AND DROP (D&D) NATIVO ---
  
  const handleDragStart = (e, item, index) => {
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, index }));
    // Añadir una clase para el feedback visual
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.index === targetIndex) return;

    // Clonar la lista de usuario
    let newList = [...userList];

    // Quitar el ítem arrastrado de su posición original
    const [removed] = newList.splice(draggedItem.index, 1);

    // Insertar el ítem en la nueva posición
    newList.splice(targetIndex, 0, removed);

    // Actualizar la lista y el índice del ítem arrastrado
    setUserList(newList);
    setDraggedItem({ ...draggedItem, index: targetIndex });
  };
  
  const handleDragEnd = (e) => {
    // Quitar la clase de feedback visual
    e.currentTarget.classList.remove('dragging');
    setDraggedItem(null);
  };

  // --- RENDERIZADO DE PANTALLAS ---

  const renderSetupScreen = () => {
    const { max } = difficultySettings[difficulty];
    return (
      <div className="setup-screen">
        <h1 className="main-title">
          <span>D</span><span>e</span><span>s</span><span>a</span><span>r</span><span>r</span><span>o</span><span>l</span><span>l</span><span>o</span>
          <span>&nbsp;</span>
          <span>d</span><span>e</span>
          <span>&nbsp;</span>
          <span>A</span><span>l</span><span>g</span><span>o</span><span>r</span><span>i</span><span>t</span><span>m</span><span>o</span><span>s</span>
        </h1>

        <div className="card">
          <h2>Selecciona el nivel de dificultad:</h2>
          <div className="difficulty-selector">
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

        <div className="exercise-selection-area">
          <div className="card exercise-list-card">
            <h2>Selecciona los ejercicios a realizar (Máximo {max}):</h2>
            <div className="exercise-list">
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
          
          <div className="icon-area">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H7V0H9V2H15V0H17V2ZM19 4H5V20H19V4ZM17 9H7V7H17V9ZM17 13H7V11H17V13ZM13 17H7V15H13V17Z"></path></svg>
          </div>
        </div>
        
        <div className="card">
          <h2>Ejercicios seleccionados: {selectedExercises.length} / {max}</h2>
          <div className="selected-exercises-list">
            {selectedExercises.length > 0 ? (
              selectedExercises.map(exercise => (
                <div key={exercise.id} className="selected-exercise-item">
                  {exercise.title}
                </div>
              ))
            ) : (
              <p className="empty-selection-text">Aún no has seleccionado ejercicios.</p>
            )}
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="btn btn-secondary" disabled>Anterior</button>
          <button 
            className="btn btn-primary" 
            onClick={startGame} 
            disabled={selectedExercises.length === 0}
          >
            Siguiente (Iniciar Juego)
          </button>
        </div>
      </div>
    );
  };
  
  const renderGameHeader = () => {
    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    return (
      <div className="game-header">
        <div className="header-item">Nivel: <b>{difficulty}</b></div>
        <div className="header-item">Tiempo: <b>{formatTime(timeLeft)}</b></div>
        <div className="header-item">Desafío: <b>{currentExerciseIndex + 1} / {selectedExercises.length}</b></div>
        <div className="header-item">Puntuación: <b>{score}</b></div>
      </div>
    );
  };
  
  const renderMemoryScreen = () => {
    const exercise = selectedExercises[currentExerciseIndex];
    
    // El useEffect que estaba aquí fue movido al nivel superior del componente App
    // para cumplir con las Reglas de los Hooks.
    
    return (
      <div className="game-screen">
        {renderGameHeader()}
        <div className="exercise-description card">
          <h1>Ejercicio: {exercise.title}</h1>
          <p>{exercise.description}</p>
          <p><b>¡Memoriza el orden correcto! Tienes 5 segundos...</b></p>
        </div>
        
        <div className="memory-view-container">
            <div className="memory-list card">
              <ol>
                {exercise.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
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
        <div className="exercise-description card">
          <h1>Ejercicio: {exercise.title}</h1>
          <p>{exercise.description}</p>
        </div>
        
        <div className="dnd-container">
          {/* Columna Izquierda (Referencia Estática) */}
          <div className="dnd-column">
            <h3>Instrucciones</h3>
            <div className="dnd-list card">
              {staticList.map((item) => (
                <div key={item.id} className="dnd-item static">
                  {item.content}
                </div>
              ))}
            </div>
          </div>
          
          <div className="arrow-separator">
            <span>&rarr;</span>
          </div>
          
          {/* Columna Derecha (Ordenable) */}
          <div className="dnd-column">
            <h3>Arrastra las instrucciones en orden de ejecución</h3>
            <div 
              className="dnd-list card" 
              onDragOver={handleDragOver}
            >
              {userList.map((item, index) => (
                <div
                  key={item.id}
                  className="dnd-item interactive"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <span className="drag-handle">::</span> {item.content}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="game-actions">
           <button className="btn btn-secondary" onClick={resetGame}>Finalizar Juego</button>
           <button className="btn btn-primary" onClick={checkSolution}>¡Verificar!</button>
        </div>
      </div>
    );
  };
  
  // --- RENDERIZADOR PRINCIPAL ---

  return (
    <div id="algoritmos-game-container">
      <StyleInjector />
      {screen === 'setup' && renderSetupScreen()}
      {screen === 'memory' && renderMemoryScreen()}
      {screen === 'game' && renderGameScreen()}
    </div>
  );
}

// --- DATOS DE EJERCICIOS ---

const EXERCISE_DATA = {
  'Básico': [
    {
      id: 'basico-1',
      title: 'Cajero automático',
      description: 'Ordena los pasos para retirar dinero de un cajero automático.',
      steps: [
        'El usuario introduce su tarjeta.',
        'El usuario digita su NIP o contraseña.',
        'El sistema valida el NIP y muestra las opciones.',
        'El usuario selecciona la opción "Retirar dinero" y el monto.',
        'El cajero entrega el monto solicitado y el recibo.'
      ]
    },
    {
      id: 'basico-2',
      title: 'Encender una computadora',
      description: 'Ordena los pasos para encender una computadora de escritorio.',
      steps: [
        'Presionar el botón de encendido del monitor.',
        'Presionar el botón de encendido del CPU (gabinete).',
        'Esperar a que cargue el sistema operativo.',
        'Introducir la contraseña de usuario, si es necesaria.',
        'El escritorio aparece y la computadora está lista.'
      ]
    },
    {
      id: 'basico-3',
      title: 'Preparar una taza de té',
      description: 'Ordena los pasos para preparar una taza de té caliente.',
      steps: [
        'Hervir agua en una tetera o en el microondas.',
        'Colocar la bolsita de té en una taza.',
        'Verter el agua caliente en la taza.',
        'Dejar reposar el té por unos minutos.',
        'Retirar la bolsita de té y añadir azúcar si se desea.'
      ]
    },
    {
      id: 'basico-4',
      title: 'Llenar un vaso de agua',
      description: 'Ordena los pasos para llenar un vaso con agua de un garrafón.',
      steps: [
        'Tomar un vaso limpio.',
        'Colocar el vaso debajo de la llave del garrafón.',
        'Presionar la palanca o botón de la llave.',
        'Soltar la palanca cuando el vaso esté casi lleno.'
      ]
    },
    {
      id: 'basico-5',
      title: 'Iniciar sesión web',
      description: 'Ordena los pasos para iniciar sesión en una página web.',
      steps: [
        'Abrir el navegador web.',
        'Escribir la dirección de la página web (URL).',
        'Escribir el nombre de usuario y la contraseña.',
        'Hacer clic en el botón "Iniciar Sesión" o "Entrar".'
      ]
    }
  ],
  'Intermedio': [
    {
      id: 'inter-1',
      title: 'Hacer un sándwich',
      description: 'Ordena los pasos para hacer un sándwich de jamón y queso.',
      steps: [
        'Tomar dos rebanadas de pan.',
        'Untar mayonesa o crema en una o ambas rebanadas.',
        'Colocar una rebanada de jamón.',
        'Colocar una rebanada de queso sobre el jamón.',
        'Añadir lechuga y tomate (opcional).',
        'Juntar las dos rebanadas de pan.'
      ]
    },
    {
      id: 'inter-2',
      title: 'Lavar los platos',
      description: 'Ordena los pasos básicos para lavar los platos a mano.',
      steps: [
        'Retirar los restos de comida de los platos.',
        'Preparar una mezcla de agua y jabón en una esponja o fibra.',
        'Tallar cada plato con la esponja enjabonada.',
        'Enjuagar cada plato con agua limpia.',
        'Colocar los platos en un escurridor para que sequen.'
      ]
    },
    {
      id: 'inter-3',
      title: 'Enviar un correo',
      description: 'Ordena los pasos para enviar un correo electrónico.',
      steps: [
        'Iniciar sesión en el servicio de correo.',
        'Hacer clic en "Redactar" o "Correo nuevo".',
        'Escribir la dirección del destinatario en "Para:".',
        'Escribir el "Asunto" del correo.',
        'Escribir el mensaje en el cuerpo del correo.',
        'Hacer clic en "Enviar".'
      ]
    },
    {
      id: 'inter-4',
      title: 'Plantar una semilla',
      description: 'Ordena los pasos para plantar una semilla en una maceta.',
      steps: [
        'Llenar una maceta con tierra.',
        'Hacer un pequeño agujero en el centro de la tierra.',
        'Colocar la semilla dentro del agujero.',
        'Cubrir la semilla con un poco de tierra.',
        'Regar la tierra con un poco de agua.',
        'Colocar la maceta en un lugar con luz solar.'
      ]
    },
    {
      id: 'inter-5',
      title: 'Suma en calculadora',
      description: 'Ordena los pasos para sumar 5 + 3 en una calculadora.',
      steps: [
        'Encender la calculadora (botón ON o AC).',
        'Presionar la tecla "5".',
        'Presionar la tecla "+".',
        'Presionar la tecla "3".',
        'Presionar la tecla "=". (Aparece 8 en pantalla).'
      ]
    },
    {
      id: 'inter-6',
      title: 'Cepillarse los dientes',
      description: 'Ordena los pasos para un correcto cepillado de dientes.',
      steps: [
        'Colocar pasta dental sobre el cepillo.',
        'Cepillar las superficies exteriores de los dientes (arriba y abajo).',
        'Cepillar las superficies interiores de los dientes (arriba y abajo).',
        'Cepillar las superficies de masticación (muelas).',
        'Cepillar la lengua suavemente.',
        'Enjuagar la boca con agua.'
      ]
    }
  ],
  'Avanzado': [
    {
      id: 'avan-1',
      title: 'Cruzar la calle',
      description: 'Ordena los pasos para cruzar la calle de forma segura en una esquina.',
      steps: [
        'Detenerse en la banqueta (acera).',
        'Mirar a la izquierda.',
        'Mirar a la derecha.',
        'Volver a mirar a la izquierda.',
        'Si no vienen autos, cruzar caminando sin correr.',
        'Seguir mirando a ambos lados mientras se cruza.'
      ]
    },
    {
      id: 'avan-2',
      title: 'Ciclo del agua',
      description: 'Ordena las fases principales del ciclo del agua.',
      steps: [
        'Evaporación: El sol calienta el agua de ríos y mares, y se convierte en vapor.',
        'Condensación: El vapor de agua sube, se enfría y forma las nubes.',
        'Precipitación: Las nubes se cargan de agua y cae en forma de lluvia o nieve.',
        'Recolección: El agua regresa a los ríos y mares.'
      ]
    },
    {
      id: 'avan-3',
      title: 'Suma de fracciones (1/2 + 1/4)',
      description: 'Ordena los pasos para sumar las fracciones 1/2 + 1/4.',
      steps: [
        'Encontrar un común denominador (en este caso, 4).',
        'Convertir 1/2 a una fracción equivalente con denominador 4 (es 2/4).',
        'Reescribir la suma como 2/4 + 1/4.',
        'Sumar los numeradores (2 + 1 = 3).',
        'Mantener el denominador común (4).',
        'El resultado es 3/4.'
      ]
    },
    {
      id: 'avan-4',
      title: 'Búsqueda en Google',
      description: 'Ordena los pasos para encontrar información en Google.',
      steps: [
        'Abrir el navegador web.',
        'Ir a www.google.com.',
        'Escribir las palabras clave de lo que se busca en la barra.',
        'Presionar la tecla "Enter" o hacer clic en "Buscar".',
        'Revisar los títulos y descripciones de los resultados.',
        'Hacer clic en el enlace que parezca más relevante.'
      ]
    },
    {
      id: 'avan-5',
      title: 'Preparar mochila escolar',
      description: 'Ordena los pasos para preparar la mochila para el día siguiente.',
      steps: [
        'Revisar el horario de clases del día siguiente.',
        'Sacar los libros y cuadernos del día actual.',
        'Buscar los libros y cuadernos necesarios para el día siguiente.',
        'Guardar los libros y cuadernos ordenadamente.',
        'Guardar el estuche con lápices, plumas y colores.',
        'Revisar si hay que llevar material extra (mapas, calculadora, etc.).',
        'Cerrar la mochila y dejarla en un lugar visible.'
      ]
    },
     {
      id: 'avan-6',
      title: 'Receta: Huevos revueltos',
      description: 'Ordena los pasos para preparar huevos revueltos.',
      steps: [
        'Romper dos huevos en un tazón.',
        'Añadir un poco de sal y leche (opcional).',
        'Batir los huevos con un tenedor.',
        'Calentar un sartén con un poco de aceite o mantequilla.',
        'Verter los huevos batidos en el sartén caliente.',
        'Mover los huevos suavemente con una espátula mientras se cocinan.',
        'Retirar del fuego cuando estén cocidos pero aún jugosos.',
        'Servir en un plato.'
      ]
    },
     {
      id: 'avan-7',
      title: 'Resta con llevada (52 - 17)',
      description: 'Ordena los pasos para restar 17 a 52.',
      steps: [
        'Alinear los números verticalmente (52 arriba, 17 abajo).',
        'Intentar restar las unidades: 2 - 7. No se puede.',
        'Pedir "prestado" 1 a las decenas (al 5).',
        'El 5 se convierte en 4, y el 2 se convierte en 12.',
        'Restar las unidades: 12 - 7 = 5.',
        'Restar las decenas: 4 - 1 = 3.',
        'El resultado es 35.'
      ]
    },
     {
      id: 'avan-8',
      title: 'Multiplicar (23 x 5)',
      description: 'Ordena los pasos para multiplicar 23 por 5.',
      steps: [
        'Alinear los números (23 arriba, 5 abajo, a la derecha).',
        'Multiplicar el 5 por las unidades (3): 5 x 3 = 15.',
        'Escribir el 5 (del 15) en el resultado y "llevar" 1 a las decenas.',
        'Multiplicar el 5 por las decenas (2): 5 x 2 = 10.',
        'Sumar el 1 que "llevábamos": 10 + 1 = 11.',
        'Escribir el 11 junto al 5 del resultado.',
        'El resultado es 115.'
      ]
    }
  ]
};


// --- FUNCIONES UTILITARIAS ---

/**
 * Baraja un array usando el algoritmo Fisher-Yates.
 * @param {Array} array El array a barajar.
 * @returns {Array} Un nuevo array barajado.
 */
function shuffleArray(array) {
  let newArray = [...array]; // Clonar el array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


// --- HOJA DE ESTILOS CSS ENCAPSULADA ---
// Usamos un ID raíz (#algoritmos-game-container) para
// evitar conflictos con otros estilos.

const CSS_STYLES = `
/* --- Contenedor Raíz --- */
#algoritmos-game-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
  background-color: #f0f4f8; /* Gris claro de fondo */
  color: #333;
  padding: 1.5rem;
  max-width: 1000px;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

/* --- Título Animado --- */
.main-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c5282; /* Azul oscuro */
  margin-bottom: 2rem;
}
.main-title span {
  display: inline-block;
  animation: wave-animation 1.5s infinite ease-in-out;
  animation-delay: calc(0.1s * var(--i, 1));
}
/* Asignar delay a cada letra */
.main-title span:nth-child(1) { --i: 1; }
.main-title span:nth-child(2) { --i: 2; }
.main-title span:nth-child(3) { --i: 3; }
.main-title span:nth-child(4) { --i: 4; }
.main-title span:nth-child(5) { --i: 5; }
.main-title span:nth-child(6) { --i: 6; }
.main-title span:nth-child(7) { --i: 7; }
.main-title span:nth-child(8) { --i: 8; }
.main-title span:nth-child(9) { --i: 9; }
.main-title span:nth-child(10) { --i: 10; }
.main-title span:nth-child(11) { --i: 11; }
.main-title span:nth-child(12) { --i: 12; }
.main-title span:nth-child(13) { --i: 13; }
.main-title span:nth-child(14) { --i: 14; }
.main-title span:nth-child(15) { --i: 15; }
.main-title span:nth-child(16) { --i: 16; }
.main-title span:nth-child(17) { --i: 17; }
.main-title span:nth-child(18) { --i: 18; }
.main-title span:nth-child(19) { --i: 19; }

@keyframes wave-animation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* --- Tarjetas (Cards) --- */
.card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
  text-align: center;
  margin-top: 0;
}

/* --- Botones --- */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn:disabled {
  background-color: #cbd5e0;
  color: #718096;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}
.btn-primary {
  background-color: #3182ce; /* Azul primario */
  color: white;
}
.btn-primary:not(:disabled):hover {
  background-color: #2b6cb0;
  box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
  transform: translateY(-2px);
}
.btn-secondary {
  background-color: #ffffff;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}
.btn-secondary:not(:disabled):hover {
  background-color: #f7fafc;
  border-color: #a0aec0;
  transform: translateY(-2px);
}

/* --- Pantalla de Configuración (Setup) --- */
.difficulty-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.exercise-selection-area {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
}
.exercise-list-card {
  max-height: 300px;
  overflow: hidden;
}
.exercise-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 220px; /* 300px - padding/título */
}
.exercise-item {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  word-wrap: break-word;
}
.exercise-item:hover {
  border-color: #3182ce;
  box-shadow: 0 2px 4px rgba(49, 130, 206, 0.2);
}
.exercise-item.selected {
  background-color: #ebf8ff;
  border-color: #3182ce;
  color: #2b6cb0;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
}
.icon-area {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3182ce;
  opacity: 0.5;
}
.icon-area svg {
  width: 100px;
  height: 100px;
}
.selected-exercises-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-height: 50px;
}
.selected-exercise-item {
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(49, 130, 206, 0.3);
}
.empty-selection-text {
  color: #718096;
  font-style: italic;
  padding: 0.5rem;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

/* --- Pantalla de Juego (Game) --- */
.game-screen {
  animation: fade-in 0.5s ease;
}
.game-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #2c5282; /* Azul oscuro */
  color: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.header-item {
  font-size: 1.1rem;
  padding: 0.25rem 0.5rem;
}
.header-item b {
  font-weight: 700;
  color: #bee3f8; /* Azul claro */
}
.exercise-description {
  text-align: center;
}
.exercise-description h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c5282;
  margin-top: 0;
}
.exercise-description p {
  font-size: 1.1rem;
  color: #4a5568;
}

/* --- Vista de Memoria --- */
.memory-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.memory-list {
  background-color: #ebf8ff;
  border: 2px dashed #3182ce;
  width: 100%;
  max-width: 600px;
}
.memory-list ol {
  padding-left: 2rem;
}
.memory-list li {
  font-size: 1.1rem;
  color: #2b6cb0;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

/* --- Vista de D&D --- */
.dnd-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-top: 1.5rem;
}
.arrow-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 2.5rem;
  color: #718096;
  padding-top: 5rem; /* Alinear con las tarjetas */
}
.dnd-column .card {
  padding: 1rem;
  background-color: #f7fafc;
  min-height: 300px;
}
.dnd-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.dnd-item {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  transition: all 0.2s ease;
}
.dnd-item.static {
  background-color: #ffffff;
  color: #4a5568;
}
.dnd-item.interactive {
  background-color: #ffffff;
  color: #2d3748;
  cursor: grab;
  border: 1px dashed #a0aec0;
  display: flex;
  align-items: center;
}
.dnd-item.interactive:hover {
  border-color: #3182ce;
  border-style: solid;
}
.dnd-item.dragging {
  opacity: 0.5;
  background: #ebf8ff;
  border-style: solid;
  border-color: #3182ce;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.drag-handle {
  font-weight: 700;
  color: #a0aec0;
  margin-right: 0.75rem;
  cursor: grab;
}
.game-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  #algoritmos-game-container {
    padding: 1rem;
  }
  .exercise-selection-area {
    grid-template-columns: 1fr;
  }
  .icon-area {
    display: none; /* Ocultar ícono en móviles */
  }
  .dnd-container {
    grid-template-columns: 1fr;
  }
  .arrow-separator {
    transform: rotate(90deg);
    padding-top: 0;
    padding-bottom: 1rem;
    height: auto;
  }
  .game-header {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .game-actions {
    flex-direction: column;
    gap: 1rem;
  }
  .btn {
    width: 100%;
  }
}
`;
