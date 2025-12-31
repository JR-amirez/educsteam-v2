import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Carga de SweetAlert2 ---
// Este componente carga el script de SweetAlert2
const SweetAlertLoader = ({ onLoaded }) => {
  useEffect(() => {
    // 1. Si ya está cargado (de una carga anterior), avisar y salir.
    if (window.Swal) {
      onLoaded();
      return;
    }

    // 2. Si ya estamos cargándolo (flag), no hacer nada.
    //    El 'onload' original se encargará de avisar.
    if (window.swalScriptLoading) {
      // Si por alguna razón el flag está pero Swal existe, forzamos
      if (window.Swal) {
        onLoaded();
      }
      return;
    }

    // 3. Marcar que estamos cargando
    window.swalScriptLoading = true;

    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11"; // Corregido: de '//' a 'https://'
    script.async = true;
    script.onload = () => {
      onLoaded();
      window.swalScriptLoading = false;
    };
    script.onerror = () => {
      console.error("SweetAlert2 script failed to load.");
      window.swalScriptLoading = false;
    };
    document.body.appendChild(script);

  }, [onLoaded]); // onLoaded es estable
  return null;
};

// --- Carga de Blockly ---
// Carga la biblioteca principal de Blockly y el módulo de idioma español
const BlocklyLoader = ({ onLoaded }) => { // Prop renombrada y eliminada la duplicación
  useEffect(() => {
    // 1. Si ya está cargado, avisar y salir
    // (Comprobamos 'Msg' porque es lo último que se carga)
    if (window.Blockly && window.Blockly.Msg && window.Blockly.Msg.ES) {
      onLoaded();
      return;
    }

    // 2. Si ya estamos cargando, no hacer nada.
    if (window.blocklyScriptLoading) {
      return;
    }
    
    // 3. Marcar que estamos cargando
    window.blocklyScriptLoading = true;

    const blocklyScript = document.createElement('script');
    blocklyScript.src = "https://unpkg.com/blockly/blockly.min.js";
    blocklyScript.async = true;
    blocklyScript.onload = () => {
      const langScript = document.createElement('script');
      langScript.src = "https://unpkg.com/blockly/msg/es.js";
      langScript.async = true;
      langScript.onload = () => {
        // Scripts cargados
        onLoaded(); // Usar la nueva prop
        window.blocklyScriptLoading = false;
      };
      langScript.onerror = () => {
        console.error("Blockly 'es' language script failed to load.");
        window.blocklyScriptLoading = false;
      };
      document.body.appendChild(langScript);
    };
    blocklyScript.onerror = () => {
      console.error("Blockly core script failed to load.");
      window.blocklyScriptLoading = false;
    };
    document.body.appendChild(blocklyScript);
  }, [onLoaded]); // Actualizar dependencia
  return null;
};


// --- Estilos de Tailwind ---
// Aquí se incluyen los estilos de Tailwind CSS compilados para evitar conflictos.
const TailwindStyles = () => (
  <style>{`
    @keyframes blockly-bounce {
      0%, 100% {
        transform: translateY(-5%) scale(1.05);
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      50% {
        transform: translateY(0) scale(1);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
    .blockly-title-animate {
      animation: blockly-bounce 2s ease-in-out infinite;
    }
    /* Estilos base de Tailwind (minificados) */
    *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::before,::after{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}name,button,[role=button]{cursor:pointer}:disabled{cursor:default;opacity:0.7}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}.relative{position:relative}.mx-auto{margin-left:auto;margin-right:auto}.mx-2{margin-left:.5rem;margin-right:.5rem}.my-4{margin-top:1rem;margin-bottom:1rem}.my-6{margin-top:1.5rem;margin-bottom:1.5rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.mr-2{margin-right:.5rem}.ml-2{margin-left:.5rem}.inline-block{display:inline-block}.grid{display:grid}.h-10{height:2.5rem}.h-16{height:4rem}.h-32{height:8rem}.h-full{height:100%}.h-screen{height:100vh}.min-h-screen{min-height:100vh}.w-full{width:100%}.w-1\/2{width:50%}.w-1\/3{width:33.333333%}.w-2\/3{width:66.666667%}.w-1\/4{width:25%}.w-1\/5{width:20%}.max-w-7xl{max-width:80rem}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.grow{flex-grow:1}.transform{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.rounded-full{border-radius:9999px}.border{border-width:1px}.border-2{border-width:2px}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-gray-300{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.border-blue-500{--tw-border-opacity:1;border-color:rgb(59 130 246 / var(--tw-border-opacity))}.border-indigo-500{--tw-border-opacity:1;border-color:rgb(99 102 241 / var(--tw-border-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.bg-blue-100{--tw-bg-opacity:1;background-color:rgb(219 234 254 / var(--tw-bg-opacity))}.bg-blue-500{--tw-bg-opacity:1;background-color:rgb(59 130 246 / var(--tw-bg-opacity))}.bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235 / var(--tw-bg-opacity))}.bg-blue-700{--tw-bg-opacity:1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))}.bg-green-100{--tw-bg-opacity:1;background-color:rgb(220 252 231 / var(--tw-bg-opacity))}.bg-green-200{--tw-bg-opacity:1;background-color:rgb(187 247 208 / var(--tw-bg-opacity))}.bg-green-500{--tw-bg-opacity:1;background-color:rgb(34 197 94 / var(--tw-bg-opacity))}.bg-green-600{--tw-bg-opacity:1;background-color:rgb(22 163 74 / var(--tw-bg-opacity))}.bg-red-500{--tw-bg-opacity:1;background-color:rgb(239 68 68 / var(--tw-bg-opacity))}.hover\:bg-red-600:hover{--tw-bg-opacity:1;background-color:rgb(220 38 38 / var(--tw-bg-opacity))}.bg-teal-500{--tw-bg-opacity:1;background-color:rgb(20 184 166 / var(--tw-bg-opacity))}.bg-teal-600{--tw-bg-opacity:1;background-color:rgb(13 148 136 / var(--tw-bg-opacity))}.bg-indigo-500{--tw-bg-opacity:1;background-color:rgb(99 102 241 / var(--tw-bg-opacity))}.bg-indigo-600{--tw-bg-opacity:1;background-color:rgb(79 70 229 / var(--tw-bg-opacity))}.bg-indigo-700{--tw-bg-opacity:1;background-color:rgb(67 56 202 / var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.pb-4{padding-bottom:1rem}.pt-2{padding-top:.25rem}.pt-4{padding-top:1rem}.text-center{text-align:center}.text-left{text-align:left}.font-sans{font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"}.text-xs{font-size:.75rem;line-height:1rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.font-bold{font-weight:700}.font-semibold{font-weight:600}.font-medium{font-weight:500}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity))}.text-blue-800{--tw-text-opacity:1;color:rgb(30 64 175 / var(--tw-text-opacity))}.text-green-600{--tw-text-opacity:1;color:rgb(22 163 74 / var(--tw-text-opacity))}.text-green-700{--tw-text-opacity:1;color:rgb(21 128 61 / var(--tw-text-opacity))}.text-green-800{--tw-text-opacity:1;color:rgb(22 101 52 / var(--tw-text-opacity))}.text-indigo-700{--tw-text-opacity:1;color:rgb(67 56 202 / var(--tw-text-opacity))}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-inner{--tw-shadow:inset 0 2px 4px 0 rgb(0 0 0 / .05);--tw-shadow-colored:inset 0 2px 4px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(.4, 0, .2, 1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4, 0, .2, 1);transition-duration:.15s}.duration-200{transition-duration:.2s}.duration-300{transition-duration:.3s}.ease-in-out{transition-timing-function:cubic-bezier(.4, 0, .2, 1)}.hover\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\:border-blue-500:hover{--tw-border-opacity:1;border-color:rgb(59 130 246 / var(--tw-border-opacity))}.hover\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))}.hover\:bg-green-600:hover{--tw-bg-opacity:1;background-color:rgb(22 163 74 / var(--tw-bg-opacity))}.hover\:bg-indigo-700:hover{--tw-bg-opacity:1;background-color:rgb(67 56 202 / var(--tw-bg-opacity))}.hover\:bg-teal-600:hover{--tw-bg-opacity:1;background-color:rgb(13 148 136 / var(--tw-bg-opacity))}.hover\:shadow-lg:hover{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset, 0) var(--tw-ring-offset-color, #fff), var(--tw-ring-shadow);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset, 0)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\:ring-blue-500:focus{--tw-ring-color:rgb(59 130 246 / .5)}.disabled\:opacity-50:disabled{opacity:.5}.disabled\:cursor-not-allowed:disabled{cursor:not-allowed}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}.flex{display:flex}.hidden{display:none}
    
    /* Estilos adicionales para el workspace de Blockly */
    .blockly-workspace {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
    .blockly-toolbox-bg {
      background-color: #f0f0f0;
    }
    .blockly-trash-can {
      background-color: #f0f0f0;
      padding: 4px;
      border-radius: 4px;
    }
    .blockly-dotted-grid {
      background-image: radial-gradient(circle, #ccc 1px, transparent 1px);
      background-size: 16px 16px;
    }
  `}</style>
);

// --- Título Animado ---
const GameTitle = () => (
  <h1 className="text-5xl font-bold text-center my-8 text-indigo-700 blockly-title-animate" style={{ textShadow: '0 3px 6px rgba(99, 102, 241, 0.5)' }}>
    Blockly
  </h1>
);

// --- Base de Datos de Desafíos ---
const ALL_CHALLENGES = [
  // --- Básico ---
  {
    id: 'b1',
    title: 'Suma de dos números',
    description: 'Crea una función que reciba dos números y devuelva su suma.',
    instructions: [
      'Arrastra el bloque de "función" para empezar.',
      'Añade dos argumentos (x, y) a tu función.',
      'Usa el bloque de "devolver" de la categoría "Funciones".',
      'Usa un bloque de "suma" de "Matemáticas" para sumar x e y.'
    ],
    testCases: [
      { input: [7, 2], expected: 9 },
      { input: [5, 0], expected: 5 },
      { input: [3, 1], expected: 4 },
    ],
    difficulty: 'Básico',
    functionName: 'sumar', // Nombre que debe tener la función
  },
  {
    id: 'b2',
    title: 'Resta de dos números',
    description: 'Crea una función que reciba dos números y devuelva su resta (el primero menos el segundo).',
    instructions: [
      'Define una función con dos argumentos (a, b).',
      'Devuelve el resultado de "a - b" usando los bloques de "Matemáticas".'
    ],
    testCases: [
      { input: [10, 2], expected: 8 },
      { input: [5, 5], expected: 0 },
      { input: [3, 5], expected: -2 },
    ],
    difficulty: 'Básico',
    functionName: 'restar',
  },
  {
    id: 'b3',
    title: '¿Es mayor que 10?',
    description: 'Crea una función que reciba un número y devuelva "verdadero" si es mayor que 10, y "falso" si no lo es.',
    instructions: [
      'Define una función con un argumento (num).',
      'Usa un bloque "si... entonces... si no..." de "Lógica".',
      'Usa un bloque de comparación de "Lógica" para ver si "num > 10".',
      'Devuelve los bloques "verdadero" o "falso" de "Lógica".'
    ],
    testCases: [
      { input: [11], expected: true },
      { input: [10], expected: false },
      { input: [9], expected: false },
      { input: [20], expected: true },
    ],
    difficulty: 'Básico',
    functionName: 'esMayorQueDiez',
  },
  {
    id: 'b4',
    title: 'Contador del 1 al 10',
    description: 'Crea una función que devuelva un array (lista) con los números del 1 al 10.',
    instructions: [
      'Define una función sin argumentos.',
      'Crea una variable "lista" y asígnale una "lista vacía" de "Listas".',
      'Usa un bucle "contar con..." de "Bucles" para contar de 1 a 10.',
      'Dentro del bucle, usa el bloque "en lista... añadir al final" de "Listas" para añadir la variable del bucle (i) a tu "lista".',
      'Al final, devuelve la "lista".'
    ],
    testCases: [
      { input: [], expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    ],
    difficulty: 'Básico',
    functionName: 'contarHastaDiez',
  },
  {
    id: 'b5',
    title: 'Mostrar mensaje',
    description: 'Crea una función que devuelva el texto "Hola Blockly".',
    instructions: [
      'Define una función sin argumentos.',
      'Usa el bloque "devolver" de "Funciones".',
      'Añade un bloque de "texto" de "Texto" con el valor "Hola Blockly".'
    ],
    testCases: [
      { input: [], expected: "Hola Blockly" },
    ],
    difficulty: 'Básico',
    functionName: 'mostrarMensaje',
  },
  // --- Intermedio ---
  {
    id: 'i1',
    title: 'Encontrar el número mayor',
    description: 'Crea una función que reciba dos números y devuelva el mayor de los dos.',
    instructions: [
      'Define una función con dos argumentos (a, b).',
      'Usa un bloque "si... entonces... si no...".',
      'Compara si "a > b".',
      'Si es verdad, devuelve "a".',
      'Si no, devuelve "b".'
    ],
    testCases: [
      { input: [5, 10], expected: 10 },
      { input: [10, 5], expected: 10 },
      { input: [7, 7], expected: 7 },
    ],
    difficulty: 'Intermedio',
    functionName: 'encontrarMayor',
  },
  {
    id: 'i2',
    title: 'Factorial de un número',
    description: 'Crea una función que calcule el factorial de un número. (Ej: 5! = 5*4*3*2*1 = 120).',
    instructions: [
      'Define una función con un argumento (n).',
      'Crea una variable "resultado" y ponla en 1.',
      'Usa un bucle "contar con..." de (i) desde 1 hasta (n).',
      'Dentro del bucle, "establece resultado" a "resultado * i".',
      'Al final, devuelve "resultado".'
    ],
    testCases: [
      { input: [5], expected: 120 },
      { input: [1], expected: 1 },
      { input: [0], expected: 1 }, // Por definición, 0! = 1
      { input: [3], expected: 6 },
    ],
    difficulty: 'Intermedio',
    functionName: 'factorial',
  },
  {
    id: 'i3',
    title: 'Invertir un texto',
    description: 'Crea una función que reciba un texto y lo devuelva al revés.',
    instructions: [
      'Este desafío es más complejo. Blockly no tiene un bloque "invertir texto".',
      'Intenta usar bucles para recorrer el texto desde el final hasta el principio.',
      'Crea una variable "textoInvertido" como "" (texto vacío).',
      'Usa un bucle "contar con..." (i) desde "longitud de texto" - 1 hasta 0, disminuyendo 1.',
      'Dentro del bucle, "establece textoInvertido" a "textoInvertido" + "en texto... obtener letra #" (i).',
      'Devuelve "textoInvertido".'
    ],
    testCases: [
      { input: ["hola"], expected: "aloh" },
      { input: ["React"], expected: "tcaeR" },
      { input: ["a"], expected: "a" },
    ],
    difficulty: 'Intermedio',
    functionName: 'invertirTexto',
  },
  {
    id: 'i4',
    title: 'Sumar una lista',
    description: 'Crea una función que reciba una lista de números y devuelva la suma de todos sus elementos.',
    instructions: [
      'Define una función con un argumento (lista).',
      'Crea una variable "total" y ponla en 0.',
      'Usa un bucle "para cada elemento (item) en lista..." de "Bucles".',
      'Dentro del bucle, "establece total" a "total + item".',
      'Al final, devuelve "total".'
    ],
    testCases: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[10, 20]], expected: 30 },
      { input: [[]], expected: 0 },
    ],
    difficulty: 'Intermedio',
    functionName: 'sumarLista',
  },
  {
    id: 'i5',
    title: '¿Es Palíndromo?',
    description: 'Crea una función que reciba un texto y devuelva "verdadero" si se lee igual al derecho y al revés (ej: "ana"), y "falso" si no.',
    instructions: [
      'Este es un desafío de lógica.',
      'Puedes re-usar la lógica de "Invertir un texto".',
      'Obtén el texto invertido.',
      'Usa un bloque de "Lógica" para comparar si "texto" == "textoInvertido".',
      'Devuelve el resultado de esa comparación.'
    ],
    testCases: [
      { input: ["ana"], expected: true },
      { input: ["radar"], expected: true },
      { input: ["hola"], expected: false },
    ],
    difficulty: 'Intermedio',
    functionName: 'esPalindromo',
  },
   {
    id: 'i6',
    title: 'Contar Pares',
    description: 'Crea una función que reciba una lista de números y devuelva cuántos de ellos son pares.',
    instructions: [
        'Define una función con un argumento (lista).',
        'Crea una variable "contador" y ponla en 0.',
        'Usa un bucle "para cada elemento (num) en lista...".',
        'Dentro del bucle, usa un bloque "si..."',
        'La condición será "num % 2 == 0" (usa el bloque "resto de" de "Matemáticas").',
        'Si es verdad, "establece contador" a "contador + 1".',
        'Al final, devuelve "contador".'
    ],
    testCases: [
        { input: [[1, 2, 3, 4, 5, 6]], expected: 3 },
        { input: [[2, 4, 6, 8]], expected: 4 },
        { input: [[1, 3, 5]], expected: 0 },
    ],
    difficulty: 'Intermedio',
    functionName: 'contarPares',
  },
  // --- Avanzado ---
  {
    id: 'a1',
    title: 'Fibonacci',
    description: 'Crea una función que reciba un número (n) y devuelva el n-ésimo número de la secuencia de Fibonacci (0, 1, 1, 2, 3, 5, 8...).',
    instructions: [
      'Este es difícil. Si n=0, devuelve 0. Si n=1, devuelve 1.',
      'Crea una lista "fib" con [0, 1].',
      'Usa un bucle "contar con..." (i) desde 2 hasta (n).',
      'Dentro del bucle, añade a "fib" la suma de "elemento # (i-1) de fib" + "elemento # (i-2) de fib".',
      'Al final, devuelve el "elemento # (n) de fib".'
    ],
    testCases: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [5], expected: 5 },
      { input: [7], expected: 13 },
    ],
    difficulty: 'Avanzado',
    functionName: 'fibonacci',
  },
  {
    id: 'a2',
    title: 'Encontrar el Máximo de una Lista',
    description: 'Crea una función que reciba una lista de números y devuelva el número más grande.',
    instructions: [
      'Define una función con (lista).',
      'Crea una variable "maximo" y establécela al "primer elemento" de la lista.',
      'Usa un bucle "para cada elemento (num) en lista...".',
      'Dentro, usa un "si..." para comparar si "num > maximo".',
      'Si es verdad, "establece maximo" a "num".',
      'Al final, devuelve "maximo".'
    ],
    testCases: [
      { input: [[1, 5, 2, 8, 3]], expected: 8 },
      { input: [[-10, -5, -2]], expected: -2 },
      { input: [[100]], expected: 100 },
    ],
    difficulty: 'Avanzado',
    functionName: 'encontrarMaximo',
  },
  {
    id: 'a3',
    title: '¿Es número primo?',
    description: 'Crea una función que reciba un número y devuelva "verdadero" si es primo, y "falso" si no lo es.',
    instructions: [
        'Un número primo solo es divisible por 1 y por sí mismo. 1 no es primo.',
        'Define una función con (num).',
        'Si "num <= 1", devuelve "falso".',
        'Usa un bucle "contar con..." (i) desde 2 hasta "num - 1".',
        'Dentro del bucle, usa un "si..."',
        'La condición será "num % i == 0" (resto de).',
        'Si es verdad, significa que es divisible, así que "devuelve falso".',
        'Si el bucle termina sin devolver falso, "devuelve verdadero" (fuera del bucle).'
    ],
    testCases: [
        { input: [2], expected: true },
        { input: [3], expected: true },
        { input: [4], expected: false },
        { input: [7], expected: true },
        { input: [10], expected: false },
        { input: [1], expected: false },
    ],
    difficulty: 'Avanzado',
    functionName: 'esPrimo',
  },
  {
    id: 'a4',
    title: 'Promedio de una Lista',
    description: 'Crea una función que reciba una lista de números y devuelva su promedio.',
    instructions: [
      'Puedes re-usar la lógica de "Sumar una lista".',
      'Calcula la suma total.',
      'Obtén la "longitud de" la lista.',
      'Devuelve "suma total / longitud".',
      'Considera el caso de una lista vacía (debería devolver 0).'
    ],
    testCases: [
      { input: [[1, 2, 3]], expected: 2 },
      { input: [[10, 20, 30]], expected: 20 },
      { input: [[5, 5, 5, 5]], expected: 5 },
    ],
    difficulty: 'Avanzado',
    functionName: 'promedio',
  },
  {
    id: 'a5',
    title: 'Eliminar Duplicados',
    description: 'Crea una función que reciba una lista y devuelva una nueva lista sin elementos duplicados.',
    instructions: [
      'Crea una variable "listaUnica" como una lista vacía.',
      'Usa un bucle "para cada elemento (item) en lista...".',
      'Dentro, usa un "si..."',
      'La condición será "en lista "listaUnica" encontrar "item" == -1" (usando "encontrar primera/última aparición" de "Listas").',
      'Si es verdad, "añade "item" a "listaUnica".',
      'Al final, devuelve "listaUnica".'
    ],
    testCases: [
      { input: [[1, 2, 2, 3, 1, 4]], expected: [1, 2, 3, 4] },
      { input: [["a", "b", "a"]], expected: ["a", "b"] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
    ],
    difficulty: 'Avanzado',
    functionName: 'eliminarDuplicados',
  },
  {
    id: 'a6',
    title: 'Unir dos Listas',
    description: 'Crea una función que reciba dos listas y devuelva una sola lista con todos los elementos de ambas.',
    instructions: [
      'Blockly no tiene un bloque directo para "unir" listas.',
      'Crea una "nuevaLista" como una copia de "lista1".',
      'Usa un bucle "para cada elemento (item) en lista2...".',
      'Dentro, "añade "item" a "nuevaLista".',
      'Devuelve "nuevaLista".'
    ],
    testCases: [
      { input: [[1, 2], [3, 4]], expected: [1, 2, 3, 4] },
      { input: [[], [1, 2]], expected: [1, 2] },
      { input: [["a"], ["b"]], expected: ["a", "b"] },
    ],
    difficulty: 'Avanzado',
    functionName: 'unirListas',
  },
  {
    id: 'a7',
    title: 'Mayúsculas',
    description: 'Crea una función que reciba un texto y lo devuelva en mayúsculas.',
    instructions: [
      'Usa el bloque "a mayúsculas/minúsculas" de la categoría "Texto".',
      'Devuelve el resultado.'
    ],
    testCases: [
      { input: ["hola"], expected: "HOLA" },
      { input: ["Blockly"], expected: "BLOCKLY" },
      { input: ["Ya EsTa"], expected: "YA ESTA" },
    ],
    difficulty: 'Avanzado',
    functionName: 'aMayusculas',
  },
  {
    id: 'a8',
    title: 'FizzBuzz',
    description: 'Crea una función que reciba un número (n) y devuelva una lista de 1 a n, pero: si el número es divisible por 3, pon "Fizz"; si es divisible por 5, pon "Buzz"; si es divisible por ambos, pon "FizzBuzz"; si no, pon el número.',
    instructions: [
      'Este es un clásico. Crea una "listaResultado" vacía.',
      'Usa un bucle "contar con..." (i) de 1 a (n).',
      'Dentro, usa "si... si no si... si no si... si no".',
      '1. Si (i % 3 == 0) Y (i % 5 == 0) -> añade "FizzBuzz".',
      '2. Si (i % 3 == 0) -> añade "Fizz".',
      '3. Si (i % 5 == 0) -> añade "Buzz".',
      '4. Si no -> añade (i).',
      'Al final, devuelve "listaResultado".'
    ],
    testCases: [
      { input: [15], expected: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"] },
    ],
    difficulty: 'Avanzado',
    functionName: 'fizzBuzz',
  },
];

// --- Configuración de Niveles ---
const DIFFICULTY_SETTINGS = {
  Básico: {
    maxChallenges: 3,
    time: 5 * 60, // 5 minutos
    availableChallenges: ALL_CHALLENGES.filter(c => c.difficulty === 'Básico').slice(0, 5)
  },
  Intermedio: {
    maxChallenges: 4,
    time: 10 * 60, // 10 minutos
    availableChallenges: ALL_CHALLENGES.filter(c => c.difficulty === 'Intermedio').slice(0, 6)
  },
  Avanzado: {
    maxChallenges: 5,
    time: 15 * 60, // 15 minutos
    availableChallenges: ALL_CHALLENGES.filter(c => c.difficulty === 'Avanzado').slice(0, 8)
  }
};

// --- Definición del Toolbox de Blockly ---
const toolboxXml = `
  <xml>
    <category name="Lógica" colour="#5C81A6">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>
    <category name="Bucles" colour="#5CA65C">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
    </category>
    <category name="Matemáticas" colour="#5C68A6">
      <block type="math_number"></block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant"></block>
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list"></block>
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float"></block>
    </category>
    <category name="Texto" colour="#A65C5C">
      <block type="text"></block>
      <block type="text_join"></block>
      <block type="text_append">
        <value name="TEXT">
          <shadow type="text"></shadow>
        </value>
      </block>
      <block type="text_length">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_isEmpty">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <block type="text_indexOf">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
        <value name="FIND">
          <shadow type="text">
            <field name="TEXT">b</field>
          </shadow>
        </value>
      </block>
      <block type="text_charAt">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_getSubstring">
        <value name="STRING">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_changeCase">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_trim">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT"> abc </field>
          </shadow>
        </value>
      </block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Listas" colour="#745CA6">
      <block type="lists_create_with">
        <mutation items="0"></mutation>
      </block>
      <block type="lists_create_with"></block>
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">list</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">list</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">list</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">list</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort"></block>
    </category>
    <sep></sep>
    <category name="Variables" colour="#A6745C" custom="VARIABLE"></category>
    <category name="Funciones" colour="#9A5CA6" custom="PROCEDURE"></category>
  </xml>
`;

// --- Componente: Pantalla de Configuración (SetupScreen) ---
const SetupScreen = ({ onGameStart }) => {
  const [difficulty, setDifficulty] = useState('Básico');
  const [selectedChallenges, setSelectedChallenges] = useState(new Set());
  const [settings, setSettings] = useState(DIFFICULTY_SETTINGS[difficulty]);

  useEffect(() => {
    setSettings(DIFFICULTY_SETTINGS[difficulty]);
    setSelectedChallenges(new Set()); // Resetear selección al cambiar dificultad
  }, [difficulty]);

  const toggleChallenge = (challengeId) => {
    setSelectedChallenges(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(challengeId)) {
        newSelection.delete(challengeId);
      } else {
        if (newSelection.size < settings.maxChallenges) {
          newSelection.add(challengeId);
        } else {
          // Opcional: Mostrar alerta si excede el máximo
          window.Swal.fire({
            title: 'Límite alcanzado',
            text: `Solo puedes seleccionar un máximo de ${settings.maxChallenges} desafíos para el nivel ${difficulty}.`,
            icon: 'warning',
            timer: 2000
          });
        }
      }
      return newSelection;
    });
  };

  const handleStart = () => {
    if (selectedChallenges.size === 0) {
       window.Swal.fire({
            title: 'Sin desafíos',
            text: `Debes seleccionar al menos un desafío para comenzar.`,
            icon: 'error',
            timer: 2000
          });
      return;
    }
    const challenges = settings.availableChallenges.filter(c => selectedChallenges.has(c.id));
    onGameStart(difficulty, challenges, settings.time);
  };

  const getButtonClass = (level) => {
    return level === difficulty
      ? 'bg-indigo-600 text-white shadow-lg'
      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-500';
  };
  
  const getChallengeCardClass = (id) => {
    return selectedChallenges.has(id)
      ? 'bg-blue-100 border-blue-500 border-2 shadow-inner'
      : 'bg-white border-gray-300 border hover:shadow-lg';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* 1. Selección de Dificultad */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Selecciona el nivel de dificultad:</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {['Básico', 'Intermedio', 'Avanzado'].map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`py-3 px-6 rounded-full text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105 w-full sm:w-auto ${getButtonClass(level)}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 2. Lista de Desafíos */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Selecciona los desafíos a realizar (Máximo {settings.maxChallenges}):
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-y-auto">
              {settings.availableChallenges.map(challenge => (
                <div
                  key={challenge.id}
                  onClick={() => toggleChallenge(challenge.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 h-32 flex items-center justify-center text-center font-semibold ${getChallengeCardClass(challenge.id)}`}
                >
                  {challenge.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Desafíos Seleccionados y Botón */}
        <div className="w-full md:w-1/3 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Desafíos seleccionados: {selectedChallenges.size} / {settings.maxChallenges}</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner min-h-[200px]">
              {selectedChallenges.size === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {settings.availableChallenges.filter(c => selectedChallenges.has(c.id)).map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-indigo-500 text-white font-medium text-center shadow-md">
                    {c.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStart}
            disabled={selectedChallenges.size === 0}
            className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-lg mt-6 transition-all duration-200 hover:bg-green-600 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Espacio de Trabajo de Blockly ---
const BlocklyWorkspace = ({ toolbox, onCodeUpdate }) => {
  const blocklyRef = useRef(null);
  const workspaceRef = useRef(null);

  // Inicializar el workspace de Blockly
  useEffect(() => {
    if (window.Blockly && blocklyRef.current && !workspaceRef.current) {
        // Asegurarse de que el idioma español está cargado
      window.Blockly.setLocale('es');
      
      workspaceRef.current = window.Blockly.inject(blocklyRef.current, {
        toolbox: toolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }
      });

      // Registrar el generador de código JavaScript
      if (window.Blockly.JavaScript) {
        // Listener para actualizar el código en cada cambio
        workspaceRef.current.addChangeListener(() => {
          const code = window.Blockly.JavaScript.workspaceToCode(workspaceRef.current);
          onCodeUpdate(code);
        });
      } else {
        console.error("Blockly JavaScript generator not loaded.");
      }
    }

    // Limpieza al desmontar
    return () => {
      // No destruir el workspace para evitar errores en re-renders rápidos
      // if (workspaceRef.current) {
      //   workspaceRef.current.dispose();
      //   workspaceRef.current = null;
      // }
    };
  }, [toolbox, onCodeUpdate]);
  
  // Redimensionar Blockly con la ventana
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        window.Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Llamada inicial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={blocklyRef} className="blockly-workspace blockly-dotted-grid" />;
};


// --- Componente: Pantalla de Juego (GameScreen) ---
const GameScreen = ({ difficulty, challenges, totalTime, onGameEnd }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState({ type: '', message: '' });
  const timerRef = useRef(null);

  const currentChallenge = challenges[currentChallengeIndex];

  // --- Funciones del Temporizador ---
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startTimer = () => {
    stopTimer(); // Asegurar que no haya múltiples temporizadores
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          stopTimer();
          handleTimeOut(); // handleTimeOut ya no necesita detener el timer
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // --- Lógica del Temporizador ---
  useEffect(() => {
    startTimer();
    return () => stopTimer(); // Limpieza al desmontar el componente
  }, []); // Se ejecuta solo una vez

  const handleTimeOut = () => {
    window.Swal.fire({
      title: '¡Puedes mejorar, Intenta nuevamente!',
      text: `Se acabó el tiempo. Total: ${score} Puntos`,
      icon: 'info',
      allowOutsideClick: false,
    }).then(() => {
      onGameEnd(score);
    });
  };

  // --- Finalizar Juego (Nuevo) ---
  const handleFinishGame = () => {
    stopTimer(); // Pausar el temporizador
    
    window.Swal.fire({
      title: '¿Estás seguro?',
      text: "Finalizarás el juego con tu puntuación actual.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Rojo para confirmar
      cancelButtonColor: '#3085d6', // Azul para cancelar
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario confirmó, mostrar mensaje final y terminar
        window.Swal.fire({
          title: '¡Puedes mejorar, Intenta nuevamente!',
          text: `Total: ${score} Puntos`,
          icon: 'info',
          allowOutsideClick: false,
        }).then(() => {
          onGameEnd(score); // Enviar puntuación actual
        });
      } else {
        // El usuario canceló, reanudar el temporizador
        startTimer(); 
      }
    });
  };

  // --- Formatear Tiempo ---
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Ejecutar Solución ---
  const executeSolution = () => {
    const { testCases, functionName } = currentChallenge;
    let allCorrect = true;
    let resultsLog = [];

    if (!generatedCode.includes(`function ${functionName}`)) {
         setExecutionResult({ 
           type: 'error', 
           message: `Error: Tu código debe definir una función llamada "${functionName}".`
         });
         showIncorrectModal();
         return;
    }

    try {
      // Crear la función en un scope controlado
      // AÃ±adimos "var" para asegurar que la funciÃ³n se defina en el scope de "new Function"
      const userFunction = new Function(`${generatedCode.replace(`function ${functionName}`, `var ${functionName} = function`)} return ${functionName};`)();

      for (const testCase of testCases) {
        const result = userFunction(...testCase.input);
        const expected = testCase.expected;
        
        // Comparación (simple, para arrays y primitivos)
        const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

        if (!isCorrect) {
          allCorrect = false;
          resultsLog.push(`Falló: Entrada [${testCase.input.join(', ')}]. Esperado: ${JSON.stringify(expected)}, Recibido: ${JSON.stringify(result)}`);
          break; // Detenerse al primer error
        } else {
           resultsLog.push(`Éxito: Entrada [${testCase.input.join(', ')}]. Recibido: ${JSON.stringify(result)}`);
        }
      }

    } catch (error) {
      allCorrect = false;
      resultsLog.push(`Error de ejecución: ${error.message}`);
    }
    
    // Mostrar resultado
    setExecutionResult({ 
      type: allCorrect ? 'success' : 'error', 
      message: resultsLog.join('\n') 
    });
    
    if (allCorrect) {
        handleCorrectSolution();
    } else {
        showIncorrectModal();
    }
  };
  
  // --- Modales ---
  const showIncorrectModal = () => {
     window.Swal.fire({
        title: 'Solución incorrecta,',
        text: 'Intenta nuevamente',
        icon: 'error'
     });
  };
  
  const handleCorrectSolution = () => {
    const newScore = score + 10;
    setScore(newScore);
    
    window.Swal.fire({
        title: 'Solución correcta',
        html: '¡Has obtenido!<br><b class="text-2xl text-green-700">10 Puntos</b>',
        icon: 'success',
        allowOutsideClick: false
    }).then(() => {
        // Mover al siguiente desafío o finalizar
        if (currentChallengeIndex < challenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
            setExecutionResult({ type: '', message: '' }); // Limpiar resultado
        } else {
            // Juego terminado
            stopTimer(); // Detener tiempo
            window.Swal.fire({
                title: '¡Felicidades, lo lograste!',
                text: `Total: ${newScore} Puntos`,
                icon: 'success',
                allowOutsideClick: false
            }).then(() => {
                onGameEnd(newScore);
            });
        }
    });
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-100">
      {/* 1. Header Bar */}
      <div className="w-full bg-white shadow-md p-2 flex flex-wrap justify-center md:justify-between items-center gap-2">
        <div className="flex gap-2">
           <span className="bg-indigo-600 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md">
             Nivel: {difficulty}
           </span>
            <span className="bg-indigo-600 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md">
             Tiempo: {formatTime(timeLeft)}
           </span>
        </div>
        <div className="flex gap-2 items-center">
           <span className="bg-indigo-600 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md">
             Desafío: {currentChallengeIndex + 1} / {challenges.length}
           </span>
           <span className="bg-indigo-600 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md">
             Puntuación: {score}
           </span>
           {/* --- Botón Finalizar (NUEVO) --- */}
           <button
             onClick={handleFinishGame}
             className="bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-200 hover:bg-red-600"
             title="Finalizar el juego"
           >
             Finalizar
           </button>
        </div>
      </div>

      {/* 2. Game Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-2 p-2 h-full">
        
        {/* Panel Izquierdo: Desafío */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{currentChallenge.title}</h3>
          <p className="text-gray-700 mb-4">{currentChallenge.description}</p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Casos de prueba:</h4>
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm font-mono shadow-inner">
            {currentChallenge.testCases.map((tc, index) => (
              <div key={index} className="mb-2">
                <p className="text-gray-600">Entrada: [{tc.input.join(', ')}]</p>
                <p className="text-blue-800">Salida esperada: {JSON.stringify(tc.expected)}</p>
              </div>
            ))}
          </div>
          
           <h4 className="text-lg font-semibold text-gray-800 mb-2">Instrucciones:</h4>
           <ul className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
             <li>Crea una función llamada <b>{currentChallenge.functionName}</b>.</li>
             {currentChallenge.instructions.map((inst, index) => (
                 <li key={index}>{inst}</li>
             ))}
             <li>Haz clic en "Ejecutar Solución" para probar tu código.</li>
           </ul>
        </div>

        {/* Panel Central: Blockly */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden h-full">
          <BlocklyWorkspace 
            toolbox={toolboxXml} 
            onCodeUpdate={setGeneratedCode} 
          />
        </div>

        {/* Panel Derecho: Resultado */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Resultado</h3>
          <button
            onClick={executeSolution}
            className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all duration-200 hover:bg-green-600 transform hover:scale-105"
          >
            Ejecutar Solución
          </button>
          <div className="flex-1 bg-gray-900 text-white font-mono text-sm rounded-lg p-4 mt-4 overflow-y-auto shadow-inner">
            <p className="text-gray-400 mb-2">&gt; Esperando ejecución...</p>
            {executionResult.message && (
                <pre className={executionResult.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                    {executionResult.message}
                </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


// --- Componente Principal (App) ---
const BlocklyChallenge = () => {
  const [gameState, setGameState] = useState({
    screen: 'setup', // 'setup', 'game'
    difficulty: 'Básico',
    challenges: [],
    time: 0
  });
  // Estados de carga separados
  const [isSwalLoaded, setIsSwalLoaded] = useState(false);
  const [isBlocklyLoaded, setIsBlocklyLoaded] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false); // Este será 'true' cuando AMBOS estén listos

  const handleGameStart = (difficulty, challenges, time) => {
    setGameState({
      screen: 'game',
      difficulty,
      challenges,
      time
    });
  };

  const handleGameEnd = (finalScore) => {
    // Volver a la pantalla de configuración
    setGameState({
      screen: 'setup',
      difficulty: 'Básico',
      challenges: [],
      time: 0
    });
  };
  
  // Callbacks para los loaders
  const onSwalLoaded = useCallback(() => setIsSwalLoaded(true), []);
  const onBlocklyLoaded = useCallback(() => setIsBlocklyLoaded(true), []);

  // Efecto para unificar las cargas
  useEffect(() => {
    if (isSwalLoaded && isBlocklyLoaded) {
      setScriptsLoaded(true);
    }
  }, [isSwalLoaded, isBlocklyLoaded]);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <SweetAlertLoader onLoaded={onSwalLoaded} />
      <BlocklyLoader onLoaded={onBlocklyLoaded} />
      <TailwindStyles />
      
      <GameTitle />
      
      {!scriptsLoaded && (
         <div className="text-center p-10">
            <h2 className="text-2xl font-semibold text-gray-700">Cargando bibliotecas...</h2>
            <p className="text-gray-500 mt-2">
              {isBlocklyLoaded ? '✅ Blockly' : 'Cargando Blockly...'}
            </p>
            <p className="text-gray-500 mt-1">
              {isSwalLoaded ? '✅ SweetAlert2' : 'Cargando SweetAlert2...'}
            </p>
         </div>
      )}

      {scriptsLoaded && gameState.screen === 'setup' && (
        <SetupScreen onGameStart={handleGameStart} />
      )}
      
      {scriptsLoaded && gameState.screen === 'game' && (
        <GameScreen
          difficulty={gameState.difficulty}
          challenges={gameState.challenges}
          totalTime={gameState.time}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
};

export default BlocklyChallenge;
