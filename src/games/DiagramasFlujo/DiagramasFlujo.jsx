import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle
} from 'lucide-react';
import Summary from './Summary';

// --- CONSTANTES Y ESTILOS GLOBALES ---
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

        /* Estilo general de botones (Basado en Acertijo) */
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
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .nav-action-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }
        .nav-action-btn:disabled {
            background-color: var(--gray-secondary);
            cursor: not-allowed;
            opacity: 0.7;
            box-shadow: none;
        }

        /* Variantes de botones de juego */
        .btn-game-action {
            width: 100%;
            padding: 1rem;
            border-radius: 0.8rem;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            border: none;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            color: white;
            margin-top: 1rem;
        }
        .btn-game-action:hover { transform: translateY(-2px); }
        .btn-validate { background-color: var(--primary-blue); box-shadow: 0 4px 15px rgba(0, 119, 182, 0.3); }
        .btn-terminate { background-color: var(--danger-red); box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3); }

        /* Estilos de Badges del Header */
        .header-badge {
            padding: 0.5rem 1.5rem;
            border-radius: 2rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-width: 100px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
        }
        
        /* Estilos Diagrama */
        .flow-node-endpoint {
            background-color: var(--primary-blue);
            color: white;
            padding: 12px 30px;
            border-radius: 2rem;
            font-weight: 700;
            display: inline-block;
            min-width: 120px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .flow-arrow-static {
            font-size: 24px;
            color: var(--gray-secondary);
            margin: 5px 0;
            text-align: center;
            line-height: 1;
        }

        /* Animación del título */
        @keyframes flow-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-title { 
            font-size: 3rem; 
            font-weight: 800; 
            background: linear-gradient(270deg, #0077b6, #023e8a, #00b4d8, #023e8a, #0077b6); 
            background-size: 400% 400%; 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            animation: flow-text 8s ease infinite; 
            text-align: center; 
            margin-top: 1rem; 
            margin-bottom: 2rem; 
            font-family: 'Merriweather', serif;
        }
    `}</style>
);

// --- Base de Datos de Problemas ---
const TODOS_LOS_PROBLEMAS = [
  // --- NIVEL BÁSICO ---
  {
    id: 'b1', titulo: 'Hacer funcionar un ventilador eléctrico', nivel: 'Básico',
    opciones: ['Conectar el cable a la corriente', 'Encender el botón de velocidad', 'El motor convierte la energía eléctrica en movimiento', 'El ventilador empieza a girar'],
    solucion: ['Conectar el cable a la corriente', 'Encender el botón de velocidad', 'El motor convierte la energía eléctrica en movimiento', 'El ventilador empieza a girar'],
    plantilla: [0, 0, 0, 0]
  },
  {
    id: 'b2', titulo: 'Cargar un celular con energía solar', nivel: 'Básico',
    opciones: ['Colocar el panel solar bajo el Sol', 'El panel convierte la energía solar en eléctrica', 'Conectar el cargador solar al celular', 'El celular empieza a cargarse'],
    solucion: ['Colocar el panel solar bajo el Sol', 'El panel convierte la energía solar en eléctrica', 'Conectar el cargador solar al celular', 'El celular empieza a cargarse'],
    plantilla: [0, 0, 0, 0]
  },
  {
    id: 'b3', titulo: 'Encender un automóvil', nivel: 'Básico',
    opciones: ['Girar la llave de encendido', 'El combustible se quema en el motor', 'La energía química se transforma en energía mecánica', 'Las llantas comienzan a moverse'],
    solucion: ['Girar la llave de encendido', 'El combustible se quema en el motor', 'La energía química se transforma en energía mecánica', 'Las llantas comienzan a moverse'],
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'b4', titulo: 'Generar energía con un molino de viento', nivel: 'Básico', 
    opciones: ['El viento mueve las aspas del molino', 'El generador convierte el movimiento en energía eléctrica', ' La energía se envía por cables', 'Se usa para encender un foco'],
    solucion: ['El viento mueve las aspas del molino', 'El generador convierte el movimiento en energía eléctrica', ' La energía se envía por cables', 'Se usa para encender un foco'],
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'b5', titulo: 'Encender un foco con un circuito sencillo', nivel: 'Básico',
    opciones: ['Conectar la pila al foco con los cables', 'Asegurar que el interruptor esté cerrado', 'La corriente fluye hacia el foco', 'El foco se enciende'],
    solucion: ['Conectar la pila al foco con los cables', 'Asegurar que el interruptor esté cerrado', 'La corriente fluye hacia el foco', 'El foco se enciende'],
    plantilla: [1, 0, 0, 0]
  },

  { 
    id: 'i1', titulo: 'El semáforo inteligente', nivel: 'Intermedio', 
    opciones: ['Encender sistema de control', 'Luz verde encendida (autos avanzan)', 'Cambiar a luz amarilla (precaución)', 'Cambiar a luz roja (autos se detienen)'], 
    solucion: ['Encender sistema de control', 'Luz verde encendida (autos avanzan)', 'Cambiar a luz amarilla (precaución)', 'Cambiar a luz roja (autos se detienen)'], 
    plantilla: [0, 0, 0, 0] 
  },
  { 
    id: 'i2', titulo: 'Encender una regadera automática', nivel: 'Intermedio', 
    opciones: ['Sensor detecta movimiento de las personas', 'Sistema abre la válvula de agua', 'El agua fluye por la regadera', 'Al salir la persona, el sistema cierra la válvula'], 
    solucion: ['Sensor detecta movimiento de las personas', 'Sistema abre la válvula de agua', 'El agua fluye por la regadera', 'Al salir la persona, el sistema cierra la válvula'], 
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'i3', titulo: 'Regular la temperatura con un termostato', nivel: 'Intermedio', 
    opciones: ['Leer temperatura actual', 'Comparar con temperatura deseada', 'Si hace frío, encender calefacción', 'Si hace calor, apagar calefacción'], 
    solucion: ['Leer temperatura actual', 'Comparar con temperatura deseada', 'Si hace frío, encender calefacción', 'Si hace calor, apagar calefacción'], 
    plantilla: [0, 0, 0, 0] 
  },
  { 
    id: 'i4', titulo: 'Mostrar el funcionamiento de iluminación automático en una casa', nivel: 'Intermedio', 
    opciones: ['Sensor de movimiento detecta presencia', 'Enviar señal al sistema de luces', 'Luces se encienden automáticamente', 'Si no hay movimiento, las luces se apagan'], 
    solucion: ['Sensor de movimiento detecta presencia', 'Enviar señal al sistema de luces', 'Luces se encienden automáticamente', 'Si no hay movimiento, las luces se apagan'], 
    plantilla: [0, 0, 0, 0] 
  },
  { 
    id: 'i5', titulo: 'Sistema contra incendios', nivel: 'Intermedio', 
    opciones: ['Sensor detecta humo o aumento de temperatura', 'Activar alarma de emergencia', 'Abrir válvulas de aspersores', 'Apagar el fuego y cerrar válvulas'], 
    solucion: ['Sensor detecta humo o aumento de temperatura', 'Activar alarma de emergencia', 'Abrir válvulas de aspersores', 'Apagar el fuego y cerrar válvulas'], 
    plantilla: [0, 0, 0, 0] 
  },
  { 
    id: 'i6', titulo: 'Cruce peatonal automatizado', nivel: 'Intermedio', 
    opciones: ['Peatón presiona el botón de cruce', 'Luz roja para autos', ' Luz verde para peatones', 'Después de unos segundos, vuelve a luz verde para auto'], 
    solucion: ['Peatón presiona el botón de cruce', 'Luz roja para autos', ' Luz verde para peatones', 'Después de unos segundos, vuelve a luz verde para auto'], 
    plantilla: [1, 0, 0, 0] 
  },
  
  { 
    id: 'a1', titulo: 'Lavadora automática', nivel: 'Avanzado', 
    opciones: ['Llenar el tanque con agua', 'Activar el ciclo de lavado', 'Enjuagar la ropa', 'Centrifugar y apagar el sistema'], 
    solucion: ['Llenar el tanque con agua', 'Activar el ciclo de lavado', 'Enjuagar la ropa', 'Centrifugar y apagar el sistema'], 
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a2', titulo: 'Funcionamiento de una tostadora automática para preparar el desayuno', nivel: 'Avanzado', 
    opciones: ['Insertar el pan en las ranuras', 'Activar el nivel de tostado', 'Las resistencias calientan el pan', 'Saltar el pan automáticamente al finalizar'], 
    solucion: ['Insertar el pan en las ranuras', 'Activar el nivel de tostado', 'Las resistencias calientan el pan', 'Saltar el pan automáticamente al finalizar'], 
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a3', titulo: 'Cafetera programable', nivel: 'Avanzado', 
    opciones: ['Programar hora de inicio', 'Calentar el agua', 'Pasar el agua caliente por el café molido', 'Servir el café en la jarra'], 
    solucion: ['Programar hora de inicio', 'Calentar el agua', 'Pasar el agua caliente por el café molido', 'Servir el café en la jarra'], 
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a4', titulo: 'Refrigerador con control automático', nivel: 'Avanzado', 
    opciones: ['Medir temperatura interna', ' Comparar con temperatura configurada', 'Activar compresor si hace calor', 'Apagar compresor al alcanzar temperatura deseada'],
    solucion: ['Medir temperatura interna', ' Comparar con temperatura configurada', 'Activar compresor si hace calor', 'Apagar compresor al alcanzar temperatura deseada'], 
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a5', titulo: 'Lavavajillas automático', nivel: 'Avanzado', 
    opciones: ['Cargar los platos y cubiertos', 'Seleccionar el programa de lavado', 'Lavar, enjuagar y secar los utensilios', 'Apagar al finalizar el ciclo'],
    solucion: ['Cargar los platos y cubiertos', 'Seleccionar el programa de lavado', 'Lavar, enjuagar y secar los utensilios', 'Apagar al finalizar el ciclo'],
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a6', titulo: 'Horno eléctrico con temporizador', nivel: 'Avanzado', 
    opciones: ['Programar temperatura y tiempo', 'Encender las resistencias de calor', 'Cocinar el alimento', 'Apagar el horno al terminar el tiempo programado'],
    solucion: ['Programar temperatura y tiempo', 'Encender las resistencias de calor', 'Cocinar el alimento', 'Apagar el horno al terminar el tiempo programado'],
    plantilla: [0, 0, 0, 0]
  },
  { 
    id: 'a7', titulo: 'Aire acondicionado inteligente', nivel: 'Avanzado', 
    opciones: ['Leer temperatura del ambiente', 'Comparar con temperatura deseada', 'Enfriar o calentar el aire', 'Mantener temperatura constante'],
    solucion: ['Leer temperatura del ambiente', 'Comparar con temperatura deseada', 'Enfriar o calentar el aire', 'Mantener temperatura constante'],
    plantilla: [1, 0, 0, 0]
  },
];

const CONFIG_NIVELES = {
  'Básico': { maxProblemas: 3, tiempo: 3 * 60, listaProblemas: TODOS_LOS_PROBLEMAS.filter(p => p.nivel === 'Básico') },
  'Intermedio': { maxProblemas: 4, tiempo: 4 * 60, listaProblemas: TODOS_LOS_PROBLEMAS.filter(p => p.nivel === 'Intermedio') },
  'Avanzado': { maxProblemas: 5, tiempo: 5 * 60, listaProblemas: TODOS_LOS_PROBLEMAS.filter(p => p.nivel === 'Avanzado') },
};

// --- Estilos CSS Inlne con Fallback y JIT de Tailwind ---
const estilos = `
/* Layout Grid */
.game-grid-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1024px) { .game-grid-layout { grid-template-columns: 1fr 2fr; } }

/* Estilos de Diagrama */
.flow-shape-data { width: 90%; height: 4.5rem; display: flex; align-items: center; justify-content: center; transform: skew(-15deg); padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.flow-shape-data-text { transform: skew(15deg); text-align: center; }
.flow-shape-process { width: 90%; height: 4.5rem; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; }
.flow-slot-empty { width: 100%; height: 4.5rem; border: 2px dashed #9ca3af; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; margin: 0 auto; }
`;

// El componente Summary y generateFlowchartHTML ahora están en ./Summary.jsx
// (Removido para evitar duplicación)
// --- Componente: Pantalla de Selección (Con barra inferior tipo Acertijo) ---
const PantallaSeleccion = ({ onPreview, onSummary, nivel, setNivel, seleccionados, setSeleccionados }) => {
  const config = nivel ? CONFIG_NIVELES[nivel] : null;
  const navigate = useNavigate();

  const handleSelectNivel = (n) => {
    setNivel(n);
    setSeleccionados([]);
  };

  const handleSelectProblema = (problema) => {
    setSeleccionados(prev => {
      const yaEsta = prev.find(p => p.id === problema.id);
      if (yaEsta) return prev.filter(p => p.id !== problema.id);
      if (config && prev.length < config.maxProblemas) return [...prev, problema];
      return prev;
    });
  };

  const puedeAvanzar = config && seleccionados.length > 0 && seleccionados.length <= config.maxProblemas;

  // Renderizado del título animado (mantenido del original)
  const AnimatedTitle = () => (
    <h1 className="animated-title">Diagramas de Flujo</h1>
  );

  return (
    <div style={{ width: '100%', maxWidth: '64rem', margin: 'auto' }}>
      <AnimatedTitle />
      
      {/* 1. Selección de Nivel - MODIFICADO: Layout Horizontal y Centrado */}
      <div style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>Selecciona el nivel de dificultad:</h2>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Básico', 'Intermedio', 'Avanzado'].map(n => (
            <button key={n} onClick={() => handleSelectNivel(n)}
              style={{ padding: '0.75rem 2rem', fontWeight: '700', borderRadius: '0.75rem', fontSize: '1.125rem', transition: 'all 0.3s', transform: nivel === n ? 'scale(1.05)' : 'scale(1)', backgroundColor: nivel === n ? '#0077b6' : '#ffffff', color: nivel === n ? '#ffffff' : '#0077b6', border: nivel === n ? 'none' : '2px solid #0077b6', boxShadow: nivel === n ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none', minWidth: '150px' }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Selección de Problemas */}
      {config && (
        <>
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>Selecciona las problemáticas (Máx {config.maxProblemas}):</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem' }} className="sm:grid-cols-2 lg:grid-cols-3">
              {config.listaProblemas.map(p => {
                const isSelected = seleccionados.some(s => s.id === p.id);
                return (
                  <div key={p.id} onClick={() => handleSelectProblema(p)}
                    style={{ padding: '1rem', minHeight: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: '500', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', transform: isSelected ? 'scale(1.05)' : 'scale(1)', border: isSelected ? '2px solid #0077b6' : '2px solid #d1d5db', backgroundColor: isSelected ? '#e0f7fa' : '#ffffff', color: isSelected ? '#0077b6' : '#374151', boxShadow: isSelected ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none' }}>
                    {p.titulo}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Seleccionadas: ({seleccionados.length} / {config.maxProblemas})</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', minHeight: '6rem', borderRadius: '0.5rem', backgroundColor: seleccionados.length > 0 ? '#f8fafc' : '#f3f4f6' }}>
              {seleccionados.length === 0 && <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Selecciona problemas de la lista.</p>}
              {seleccionados.map(p => (
                <div key={p.id} style={{ backgroundColor: '#0077b6', color: '#ffffff', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} className="animate-pop-in">{p.titulo}</div>
              ))}
            </div>
          </div>
          
          {/* BARRA DE BOTONES TIPO ACERTIJO */}
          <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem', padding:'0 1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button onClick={() => navigate(-1)} className="nav-action-btn">
                    <ArrowLeft size={20}/> Anterior
                </button>
                <button onClick={onPreview} disabled={!puedeAvanzar} className="nav-action-btn">
                    Vista Previa
                </button>
                <button onClick={onSummary} disabled={!puedeAvanzar} className="nav-action-btn"
                    style={{ backgroundColor: !puedeAvanzar ? 'var(--gray-secondary)' : 'var(--primary-blue)' }}>
                    <CheckCircle/> Terminar Configuración
                </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Componente: Pantalla de Juego (Lógica Original con retoques visuales) ---
const PantallaJuego = ({ nivel, problemas, onGameEnd, onGoToSummary }) => {
  const [problemaIndex, setProblemaIndex] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempo, setTiempo] = useState(CONFIG_NIVELES[nivel].tiempo);
  const [opciones, setOpciones] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const problemaActual = useMemo(() => problemas[problemaIndex], [problemas, problemaIndex]);

  useEffect(() => {
    if (!problemaActual) return;
    setOpciones([...problemaActual.opciones].sort(() => Math.random() - 0.5));
    setSlots(Array(problemaActual.solucion.length).fill(null));
    setIsChecking(false);
  }, [problemaActual]);

  useEffect(() => {
    if (tiempo <= 0) {
      window.Swal.fire({ title: '¡Tiempo Agotado!', icon: 'error', confirmButtonText: 'Reiniciar' }).then(() => onGameEnd(puntuacion, false));
      return;
    }
    const id = setInterval(() => setTiempo(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [tiempo, onGameEnd, puntuacion]);

  const handleDragStart = (e, paso, source, index) => {
    e.dataTransfer.setData("paso", paso); e.dataTransfer.setData("source", source); e.dataTransfer.setData("index", String(index));
  };
  const handleDrop = (e, targetSource, targetIndex) => {
    e.preventDefault(); if (isChecking) return;
    const paso = e.dataTransfer.getData("paso"); const source = e.dataTransfer.getData("source"); const index = parseInt(e.dataTransfer.getData("index"), 10);
    let nOpciones = [...opciones], nSlots = [...slots];

    if (source === 'opciones' && targetSource === 'slots') {
      const existing = nSlots[targetIndex]; nSlots[targetIndex] = paso; nOpciones.splice(index, 1);
      if (existing) nOpciones.push(existing);
    } else if (source === 'slots' && targetSource === 'opciones') {
      nSlots[index] = null; nOpciones.push(paso);
    } else if (source === 'slots' && targetSource === 'slots') {
      const existing = nSlots[targetIndex]; nSlots[targetIndex] = paso; nSlots[index] = existing;
    }
    setOpciones(nOpciones); setSlots(nSlots);
  };

  const handleEjecutar = () => {
    setIsChecking(true);
    if (slots.some(s => s === null)) {
      window.Swal.fire('¡Espera!', 'Debes llenar todos los espacios.', 'warning').then(() => setIsChecking(false));
      return;
    }
    if (JSON.stringify(slots) === JSON.stringify(problemaActual.solucion)) {
      const nuevaPunt = puntuacion + 10; setPuntuacion(nuevaPunt);
      if (problemaIndex === problemas.length - 1) {
        window.Swal.fire('¡Felicidades!', `Total: ${nuevaPunt} Puntos`, 'success').then(() => onGameEnd(nuevaPunt, true));
      } else {
        window.Swal.fire('¡Correcto!', 'Siguiente desafío', 'success').then(() => setProblemaIndex(prev => prev + 1));
      }
    } else {
      window.Swal.fire('Incorrecto', 'Intenta nuevamente', 'error').then(() => setIsChecking(false));
    }
  };

  // DropSlot component interno
  const DropSlot = ({ paso, index, forma }) => {
    const estilo = forma === 1 ? 'flow-shape-data' : 'flow-shape-process';
    const texto = forma === 1 ? 'flow-shape-data-text' : '';
    return (
      <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'slots',index)} style={{minHeight:'5rem', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
        {paso ? (
          <div className={estilo} draggable onDragStart={e=>handleDragStart(e,paso,'slots',index)} style={{backgroundColor:'white', border:'2px solid #4b5563', cursor:'grab'}}>
            <span className={texto}>{paso}</span>
          </div>
        ) : (
          <div className="flow-slot-empty"><span className={texto} style={{color:'#9ca3af'}}>Arrastra aquí</span></div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '80rem', margin: 'auto' }}>
      {/* HEADER VISUAL MODIFICADO (Estilo imagen) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="header-badge" style={{background:'#0077b6'}}>Nivel: {nivel}</div>
        <div className="header-badge" style={{background:'#374151', minWidth: '150px'}}>Tiempo: {Math.floor(tiempo/60).toString().padStart(2,'0')}:{(tiempo%60).toString().padStart(2,'0')}</div>
        <div className="header-badge" style={{background:'#0077b6'}}>Desafío: {problemaIndex + 1} / {problemas.length}</div>
        <div className="header-badge" style={{background:'#2a9d8f'}}>Puntuación: {puntuacion}</div>
      </div>

      <div className="game-grid-layout">
        {/* Panel Izquierdo: Problemática y Opciones */}
        <div style={{background:'white', padding:'2rem', borderRadius:'0.75rem', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', height: 'fit-content'}}>
          <h3 style={{fontWeight:'800', fontSize: '1.25rem', marginBottom:'0.5rem', color: '#1f2937'}}>Problemática:</h3>
          <p style={{color:'#0077b6', fontWeight:'700', fontSize: '1.1rem', marginBottom:'1rem'}}>{problemaActual.titulo}</p>
          <p style={{color:'#6b7280', fontSize:'0.9rem', marginBottom:'1.5rem', lineHeight:'1.5'}}>
            Arrastra los recuadros con los datos de abajo hacia el diagrama de flujo de la derecha, para colocarlos en el orden correcto y resolver la problemática.
          </p>

          <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'opciones',null)} style={{background:'#f9fafb', border:'1px solid #e2e8f0', padding:'1rem', borderRadius:'0.5rem', display:'flex', flexDirection:'column', gap:'0.75rem', minHeight: '150px'}}>
            {opciones.map((paso, i) => (
              <div key={paso} draggable onDragStart={e=>handleDragStart(e,paso,'opciones',i)} style={{background:'white', border:'2px solid #9ca3af', padding:'0.75rem', borderRadius:'0.5rem', cursor:'grab', textAlign:'center'}} className="hover:border-blue-500">{paso}</div>
            ))}
          </div>

          <div style={{marginTop: '1.5rem'}}>
             <button className="btn-game-action btn-validate" onClick={handleEjecutar}>Validar Respuesta</button>
             <button className="btn-game-action btn-terminate" onClick={()=>{
               if(window.Swal) {
                 window.Swal.fire({
                   title: '¿Terminar el juego?',
                   text: 'Tu progreso actual se guardará',
                   icon: 'question',
                   showCancelButton: true,
                   confirmButtonText: 'Ir a Resumen',
                   cancelButtonText: 'Cancelar'
                 }).then((result) => {
                   if(result.isConfirmed && onGoToSummary) {
                     onGoToSummary();
                   }
                 });
               } else {
                 onGameEnd(puntuacion, false);
               }
             }}>Terminar Juego</button>
          </div>
        </div>

        {/* Panel Derecho: Diagrama */}
        <div style={{background:'white', padding:'3rem', borderRadius:'0.75rem', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', display:'flex', justifyContent:'center'}}>
          <div style={{width:'100%', maxWidth:'400px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="flow-node-endpoint" style={{marginBottom: '0.5rem'}}>Inicio</div>
            
            {slots.map((p, i) => (
               <React.Fragment key={i}>
                 <div className="flow-arrow-static">↓</div>
                 <DropSlot paso={p} index={i} forma={problemaActual.plantilla[i]}/>
               </React.Fragment>
            ))}
            
            <div className="flow-arrow-static">↓</div>
            <div className="flow-node-endpoint" style={{marginTop: '0.5rem'}}>Fin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Pantalla de Resultados ---
const PantallaResultados = ({ puntuacion, gano, onRestart, onGoToSummary }) => (
  <div style={{ maxWidth: '36rem', margin: '5rem auto', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
    <h1 style={{fontSize:'3rem', fontWeight:'800', background:'linear-gradient(270deg, #0077b6, #023e8a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'1rem'}}>Juego Terminado</h1>
    <h2 style={{fontSize:'1.8rem', fontWeight:'700', color: gano ? '#2a9d8f' : '#e63946', marginBottom:'0.5rem'}}>{gano ? '¡Felicidades, lo lograste!' : '¡Intenta nuevamente!'}</h2>
    <p style={{fontSize:'1.5rem', color:'#374151'}}>Puntuación final: <span style={{fontSize:'3rem', fontWeight:'700', color:'#0077b6'}}>{puntuacion}</span></p>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button onClick={onRestart} className="nav-action-btn" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            Volver a Jugar
        </button>
        <button onClick={onGoToSummary} className="nav-action-btn" style={{ fontSize: '1.2rem', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> Terminar Configuración
        </button>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
function DiagramasFlujo() {
  const [view, setView] = useState('home'); // 'home', 'game', 'summary'
  const [nivel, setNivel] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  
  const [puntuacionFinal, setPuntuacionFinal] = useState(0);
  const [gano, setGano] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar SweetAlert2
  useEffect(() => {
    if (typeof window.Swal === 'undefined') {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePreview = () => {
    setPuntuacionFinal(0); setGano(false); setView('game');
  };

  const goToSummary = () => {
    setView('summary');
    navigate('/settings?view=summary', { 
        replace: true,
        state: location.state // Pasar el state que ya existía (gameDetails, areas, etc)
    });
  };

  const handleGameEnd = (puntuacion, ganoJuego) => {
    setPuntuacionFinal(puntuacion); setGano(ganoJuego); setView('resultados');
  };

  const handleRestart = () => {
    setView('home'); // Volver a selección
  };

  return (
    <>
      <style>{estilos}</style>
      <GlobalStyles />
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <div style={{ maxWidth: '100%', margin: 'auto', padding: '2rem 1rem' }}>
          
          {view === 'home' && (
            <PantallaSeleccion 
              onPreview={handlePreview} 
              onSummary={goToSummary}
              nivel={nivel} setNivel={setNivel}
              seleccionados={seleccionados} setSeleccionados={setSeleccionados}
            />
          )}

          {view === 'game' && (
            <PantallaJuego nivel={nivel} problemas={seleccionados} onGameEnd={handleGameEnd} onGoToSummary={goToSummary} />
          )}

          {view === 'resultados' && (
            <PantallaResultados puntuacion={puntuacionFinal} gano={gano} onRestart={handleRestart} onGoToSummary={goToSummary} />
          )}

          {view === 'summary' && (
             <Summary 
                config={{ difficulty: nivel, timeLimit: CONFIG_NIVELES[nivel]?.tiempo, problems: seleccionados }}
                onBack={() => setView('home')}
             />
          )}

        </div>
      </div>
    </>
  );
}

export default DiagramasFlujo;