import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Tag,
    Smartphone,
    FileText,
    Calendar,
    Monitor,
    Puzzle,
    Layers,
    Shapes,
    Type,
    List,
    Code,
    Zap,
    Globe,
    Package,
    X
} from 'lucide-react';

// --- TODOS LOS DESAFÍOS DISPONIBLES ---
const ALL_CHALLENGES = [
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
        functionName: 'sumar',
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
            { input: [0], expected: 1 },
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

// --- GENERADOR HTML PARA BLOCKLY WEB ---
const generateGameCode = (config) => {
    const challengesJSON = JSON.stringify(config.challenges || []);
    const arConfigJSON = JSON.stringify(config.arConfig || {});
    const arSelectedStagesJSON = JSON.stringify(config.arSelectedStages || {});
    const plataformasJSON = JSON.stringify(config.appPlataformas || ['web']);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Programación por Bloques - ${config.difficulty}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://unpkg.com/blockly/blockly.min.js"></script>
    <script src="https://unpkg.com/blockly/msg/es.js"></script>
    <!-- Three.js para Realidad Aumentada -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0077b6;
            --dark: #023e8a;
            --light: #e0f7fa;
            --bg: #f0f2f5;
            --white: #ffffff;
            --green: #22c55e;
            --red: #ef4444;
            --yellow: #f59e0b;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: var(--bg);
            color: #343a40;
            min-height: 100vh;
        }

        .hidden {
            display: none !important;
        }

        /* Pantalla de Inicio */
        .start-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #ffffff;
            text-align: center;
            padding: 2rem;
        }

        .start-screen h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            color: #000;
        }

        .start-screen p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .info-juego {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 5px;
            align-items: center;
            padding: 0;
        }

        .info-juego p {
            margin-bottom: 10px;
            font-size: 17px;
            color: #0369a1;
            background: #e0f2fe;
            padding: 0.5rem 1rem;
            border-radius: 200px;
            font-weight: bold;
        }

        .page-start-btns {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }

        .start-btn {
            padding: 10px;
            font-size: 18px;
            padding-top: 10px;
            padding-bottom: 10px;
            background: #0077b6;
            margin-top: 5px;
            display: flex;
            justify-content: center;
            gap: 10px;
            color: white;
            border-radius: 5px;
            border: none;
            text-transform: uppercase;
        }

        .start-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 119, 182, 0.5);
        }

        .start-btn-secondary {
            padding: 30px;
            font-size: 18px;
            padding-top: 10px;
            padding-bottom: 10px;
            background: white;
            margin-top: 5px;
            display: flex;
            justify-content: center;
            gap: 10px;
            color: #0077b6;
            border-radius: 5px;
            border: 2px solid #0077b6;
            text-transform: uppercase;
        }

        .start-btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 119, 182, 0.5);
        }

        .game-info {
            margin-top: 2rem;
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .game-info-item {
            background: rgba(255, 255, 255, 0.15);
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            backdrop-filter: blur(5px);
        }

        .game-info-item strong {
            display: block;
            font-size: 1.5rem;
        }

        /* Header del Juego */
        .game-header {
            background: white;
            padding: 0.65rem 1rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .stat-badge {
            background: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.95rem;
        }

        .stat-badge.time {
            background: var(--dark);
        }

        .stat-badge.score {
            background: var(--green);
        }

        .finish-btn {
            background: var(--red);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .finish-btn:hover {
            background: #dc2626;
        }

        /* Layout del Juego */
        .game-layout {
            display: grid;
            grid-template-columns: 320px 1fr 320px;
            gap: 0.75rem;
            padding: 0.65rem;
            height: calc(100vh - 60px);
        }

        @media (max-width: 1200px) {
            .game-layout {
                grid-template-columns: 1fr;
                height: auto;
            }
        }

        /* Panel de Instrucciones */
        .instructions-panel {
            background: white;
            border-radius: 0.75rem;
            padding: 1.25rem;
            overflow-y: auto;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .instructions-panel h3 {
            color: var(--dark);
            margin-bottom: 0.75rem;
            font-size: 1.3rem;
        }

        .instructions-panel p {
            color: #6b7280;
            margin-bottom: 1rem;
            line-height: 1.5;
        }

        .test-cases {
            background: #f8fafc;
            border-radius: 0.5rem;
            padding: 0.75rem;
            margin-bottom: 1rem;
            font-family: monospace;
            font-size: 0.85rem;
        }

        .test-case {
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .test-case:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .test-case .input {
            color: #6b7280;
        }

        .test-case .expected {
            color: var(--primary);
            font-weight: 600;
        }

        .instructions-list {
            list-style: decimal;
            padding-left: 1.25rem;
            color: #4b5563;
            font-size: 0.9rem;
        }

        .instructions-list li {
            margin-bottom: 0.4rem;
        }

        /* Workspace de Blockly */
        .blockly-container {
            background: white;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        #blocklyDiv {
            width: 100%;
            height: 100%;
            min-height: 500px;
        }

        /* Panel de Resultado */
        .result-panel {
            background: white;
            border-radius: 0.75rem;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .result-panel h3 {
            color: var(--dark);
            margin-bottom: 1rem;
        }

        .run-btn {
            background: var(--green);
            color: white;
            border: none;
            padding: 0.875rem 1.5rem;
            font-size: 1.1rem;
            font-weight: 700;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 1rem;
        }

        .run-btn:hover {
            background: #16a34a;
            transform: translateY(-2px);
        }

        .output-console {
            flex: 1;
            background: #1f2937;
            color: #9ca3af;
            font-family: monospace;
            font-size: 0.85rem;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-y: auto;
            min-height: 200px;
        }

        .output-console .success {
            color: #4ade80;
        }

        .output-console .error {
            color: #f87171;
        }

        /* Pantalla Final */
        .end-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary), var(--dark));
            color: white;
            text-align: center;
            padding: 2rem;
        }

        .end-screen h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .end-screen .final-score {
            font-size: 4rem;
            font-weight: 700;
            color: #ffd60a;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
            margin: 1rem 0;
        }

        .replay-btn {
            background: white;
            color: var(--primary);
            border: none;
            padding: 1rem 2.5rem;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 0.75rem;
            cursor: pointer;
            margin-top: 2rem;
            transition: all 0.3s;
        }

        .replay-btn:hover {
            transform: scale(1.05);
        }

        /* Estilos para Realidad Aumentada */
        .ar-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(8px);
        }

        .ar-modal-content {
            background: #ffffff;
            border-radius: 1.5rem;
            padding: 2rem;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .content-ar {
            background: transparent;
            border-radius: 1.5rem;
            padding: 2rem;
            max-width: 100%;
            max-height: 90%;
            overflow: hidden;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .ar-camera-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1.5rem;
            z-index: 0;
            transform: scaleX(-1);
        }

        .ar-camera-fallback {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary), var(--dark));
            border-radius: 1.5rem;
            z-index: 0;
        }

        .ar-modal-title {
            color: #ffd60a;
            font-size: 2rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .ar-content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            position: relative;
            z-index: 1;
        }

        .ar-three-container {
            width: 400px;
            height: 300px;
            border-radius: 1rem;
            overflow: hidden;
            background: transparent;
        }

        @media (max-width: 500px) {
            .ar-three-container {
                width: 300px;
                height: 220px;
            }
        }

        .ar-audio-container {
            background: rgba(255, 255, 255, 0.15);
            padding: 1.5rem;
            border-radius: 1rem;
            text-align: center;
        }

        .ar-audio-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: pulse-audio 1.5s ease-in-out infinite;
        }

        @keyframes pulse-audio {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.1);
            }
        }

        .ar-continue-btn {
            background: #023e8a;
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 700;
            border-radius: 0.75rem;
            cursor: pointer;
            margin-top: 1.5rem;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(2, 62, 138, 0.4);
            width: 60%;
        }

        .ar-continue-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(2, 62, 138, 0.5);
        }

        .ar-floating-symbols {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }

        .ar-symbol {
            position: absolute;
            color: rgba(255, 255, 255, 0.15);
            font-family: monospace;
            user-select: none;
            animation: float-symbol 6s ease-in-out infinite;
        }

        .info-modal-background {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            animation: infoBackdropIn 200ms ease-out;
        }

        .info-modal-background .info-modal {
            width: min(520px, 85vw);
            max-height: 85vh;
            overflow: auto;
            background: #fff;
            border: 1px solid;
            border-radius: 25px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            gap: 10px;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
            will-change: transform, opacity;
            animation: infoModalIn 260ms cubic-bezier(.2, .8, .2, 1);
        }

        .info-modal .header {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #7a7a7a49;
        }

        .info-modal .cards-info {
            width: 100%;
            height: auto;
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-template-rows: repeat(5, auto);
            gap: 12px;
            align-items: stretch;
        }

        .cards-info .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 15px;
        }

        .cards-info .card .title {
            color: #64748b;
            margin: 0;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .cards-info .card .data {
            color: #334155;
            margin: 0;
            font-size: 15px;
        }

        .cards-info .card.description {
            margin-top: 10px;
            background: none;
            border: none;
            padding: 0;
            text-align: justify;
            line-height: 21px;
        }

        .info-modal .button {
            width: 100%;
            padding: 0;
        }

        .info-modal .button button {
            background: #0077b6;
            margin: 0;
            padding: 10px;
            width: 100%;
            text-transform: uppercase;
            color: white;
            font-weight: bold;
            border: none;
        }

        @keyframes float-symbol {

            0%,
            100% {
                transform: translateY(0) rotate(0deg);
            }

            50% {
                transform: translateY(-20px) rotate(10deg);
            }
        }
    </style>
</head>
<body>
    <!-- Pantalla de Inicio -->
    <div id="start-screen" class="start-screen">
        <h1 id="title-gn"></h1>
        <div class="info-juego">
            <p>${config.difficulty}</p>
        </div>
        <div class="page-start-btns">
            <button class="start-btn" onclick="startGame()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" role="img"
                    aria-label="play icon">
                    <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="6" />
                    <polygon points="18,14 18,34 34,24" fill="currentColor" />
                </svg>
                Iniciar Juego
            </button>
            <button class="start-btn-secondary" onclick="showModalInfo(true)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" role="img"
                    aria-label="Información">
                    <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="6" />
                    <rect x="22" y="18" width="4" height="18" rx="2" fill="currentColor" />
                    <circle cx="24" cy="13" r="2.5" fill="currentColor" />
                </svg>
                Información
            </button>
        </div>
    </div>

    <!-- Pantalla de Juego -->
    <div id="game-screen" class="hidden">
        <div class="game-header">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="stat-badge">Nivel: ${config.difficulty}</span>
                <span class="stat-badge time" id="timer">Tiempo: ${Math.floor(config.time / 60)}:${(config.time % 60).toString().padStart(2, '0')}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="stat-badge" id="progress">Desafío: 1/${config.challengeCount}</span>
                <span class="stat-badge score" id="score">Puntos: 0</span>
                <button class="finish-btn" onclick="finishGame(false)">Finalizar</button>
            </div>
        </div>
        <div class="game-layout">
            <div class="instructions-panel">
                <h3 id="challenge-title">Cargando...</h3>
                <p id="challenge-description"></p>
                <h4 style="color: var(--dark); margin-bottom: 0.5rem; font-size: 0.95rem;">Casos de Prueba:</h4>
                <div class="test-cases" id="test-cases"></div>
                <h4 style="color: var(--dark); margin-bottom: 0.5rem; font-size: 0.95rem;">Instrucciones:</h4>
                <ol class="instructions-list" id="instructions-list"></ol>
            </div>
            <div class="blockly-container">
                <div id="blocklyDiv"></div>
            </div>
            <div class="result-panel">
                <h3>Resultado</h3>
                <button class="run-btn" onclick="executeSolution()">▶ Ejecutar Solución</button>
                <div class="output-console" id="output-console">
                    <p>> Esperando ejecución...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Pantalla Final -->
    <div id="end-screen" class="end-screen hidden">
        <h1 id="end-title">¡Juego Terminado!</h1>
        <p>Tu puntuación final:</p>
        <div class="final-score" id="final-score">0</div>
        <p>Puntos</p>
        <button class="replay-btn" onclick="location.reload()">Jugar de Nuevo</button>
    </div>

    <!-- Modal de Realidad Aumentada -->
    <div id="ar-modal" class="ar-modal-overlay hidden">
        <div class="ar-modal-content">
            <div class="content-ar">
                <div class="ar-floating-symbols" id="ar-symbols"></div>
                <div class="ar-content-container" id="ar-content"></div>
            </div>
            <button class="ar-continue-btn" id="ar-continue-btn">Continuar</button>
        </div>
    </div>

    <div class="info-modal-background hidden" id="info-modal">
        <div class="info-modal">
            <div class="header">
                <h2 style="color: #0077b6; font-weight: bold;" id="info-app-name"></h2>
                <p style="color: #8b8b8bff; margin-top: 5px; text-align: center;">
                    Actividad configurada desde la plataforma Steam-G
                </p>
            </div>

            <div class="cards-info">
                <div class="card">
                    <p class="title">VERSIÓN</p>
                    <p class="data" id="info-app-version"></p>
                </div>

                <div class="card">
                    <p class="title">FECHA DE CREACIÓN</p>
                    <p class="data" id="info-app-fecha"></p>
                </div>

                <div class="card">
                    <p class="title">PLATAFORMAS</p>
                    <p class="data" id="info-app-plataformas"></p>
                </div>

                <div class="card">
                    <p class="title">NÚMERO DE ACERTIJOS</p>
                    <p class="data" id="info-app-acertijos"></p>
                </div>

                <div class="card description">
                    <p class="title">DESCRIPCIÓN</p>
                    <p class="data" id="info-app-descripcion"></p>
                </div>
            </div>

            <div class="button">
                <button expand="block" onclick="showModalInfo(false)">
                    Cerrar
                </button>
            </div>
        </div>
    </div>

    <!-- Toolbox de Blockly -->
    <xml id="toolbox" style="display: none">
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

    <script>
        // Configuración del juego
        const config = {
            difficulty: "${config.difficulty}",
            time: ${config.time},
            challengeCount: ${config.challengeCount},
            challenges: ${challengesJSON}
        };

        // Configuración de Realidad Aumentada
        const arConfig = ${arConfigJSON};
        const arSelectedStages = ${arSelectedStagesJSON};

        // Información de la aplicación
        const appName = "${config.appName || 'Programación por Bloques'}";
        const appVersion = "${config.appVersion || '1.0.0'}";
        const appFecha = "${config.appFecha || ''}";
        const appPlataformas = ${plataformasJSON};
        const appDescripcion = "${(config.appDescripcion || '').replace(/"/g, '\\"')}";
        const escenariosSeleccionados = config.challenges;

        // Función para formatear plataformas
        function formatPlataforma(plataformas) {
            if (!plataformas || plataformas.length === 0) return 'Web';
            const nombres = {
                'web': 'Web',
                'android': 'Android',
                'ios': 'iOS',
                'windows': 'Windows'
            };
            return plataformas.map(p => nombres[p] || p).join(', ');
        }

        // Estado del juego
        let state = {
            currentIndex: 0,
            score: 0,
            timeLeft: config.time,
            timer: null,
            workspace: null,
            active: false,
            arCleanups: []
        };

        // Símbolos flotantes para RA
        const BLOCKLY_SYMBOLS = ["{ }", "< >", "( )", "[ ]", "=>", "++", "&&", "||"];

        // Crear símbolos flotantes
        function createFloatingSymbols(container) {
            if (!container) return;
            container.innerHTML = '';
            BLOCKLY_SYMBOLS.forEach(function (symbol, index) {
                const el = document.createElement('div');
                el.className = 'ar-symbol';
                el.textContent = symbol;
                el.style.fontSize = (Math.random() * 26 + 18) + 'px';
                el.style.left = (Math.random() * 80 + 10) + '%';
                el.style.top = (Math.random() * 80 + 10) + '%';
                el.style.animationDelay = (index * 0.5) + 's';
                container.appendChild(el);
            });
        }

        function showModalInfo(value) {
            const modal = document.getElementById('info-modal');
            if (value) {
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }

        // Poblar información del modal
        function initModalInfo() {
            document.getElementById('title-gn').textContent = appName;
            document.getElementById('info-app-name').textContent = appName;
            document.getElementById('info-app-version').textContent = appVersion;
            document.getElementById('info-app-fecha').textContent = appFecha;
            document.getElementById('info-app-plataformas').textContent = formatPlataforma(appPlataformas);
            document.getElementById('info-app-acertijos').textContent = escenariosSeleccionados.length;
            document.getElementById('info-app-descripcion').textContent = appDescripcion;
        }
        // Crear textura de texto usando Canvas
        function createTextTexture(text) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;

            // Fondo completamente transparente
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Configurar texto
            ctx.font = 'bold 64px Poppins, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Sombra del texto
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;

            // Gradiente verde para el texto
            const textGradient = ctx.createLinearGradient(0, 20, 0, 100);
            textGradient.addColorStop(0, '#22c55e');
            textGradient.addColorStop(0.5, '#16a34a');
            textGradient.addColorStop(1, '#22c55e');
            ctx.fillStyle = textGradient;
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            // Borde del texto
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 2;
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        // Inicializar escena Three.js para texto 3D
        function initTextScene(container, text) {
            if (!container || !window.THREE) return null;

            const width = container.clientWidth || 400;
            const height = container.clientHeight || 300;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
            camera.position.set(0, 0, 5);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0); // Fondo transparente
            container.appendChild(renderer.domElement);

            const ambient = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambient);

            // Crear plano con texto como textura
            const textTexture = createTextTexture(text);
            const geometry = new THREE.PlaneGeometry(4, 1);
            const material = new THREE.MeshBasicMaterial({
                map: textTexture,
                transparent: true,
                side: THREE.DoubleSide
            });
            const textPlane = new THREE.Mesh(geometry, material);
            scene.add(textPlane);

            // Agregar partículas decorativas
            const particlesGeometry = new THREE.BufferGeometry();
            const particleCount = 50;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 8;
                positions[i + 1] = (Math.random() - 0.5) * 4;
                positions[i + 2] = (Math.random() - 0.5) * 4;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x22c55e,
                size: 0.08,
                transparent: true,
                opacity: 0.8
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            let disposed = false;
            function animate() {
                if (disposed) return;
                const time = Date.now() * 0.001;
                textPlane.rotation.y = Math.sin(time) * 0.3;
                textPlane.position.y = Math.sin(time * 1.5) * 0.1;
                particles.rotation.y += 0.005;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();

            return function () {
                disposed = true;
                textTexture.dispose();
                renderer.dispose();
                renderer.domElement.remove();
            };
        }

        // Inicializar escena Three.js para imagen
        function initImageScene(container, imageUrl) {
            if (!container || !window.THREE || !imageUrl) return null;

            const width = container.clientWidth || 400;
            const height = container.clientHeight || 300;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
            camera.position.set(0, 0, 5);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            container.appendChild(renderer.domElement);

            const ambient = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambient);

            const loader = new THREE.TextureLoader();
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 3),
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })
            );
            scene.add(plane);

            loader.load(imageUrl, function (texture) {
                plane.material.map = texture;
                plane.material.needsUpdate = true;
                const aspect = texture.image.width / texture.image.height;
                if (aspect >= 1) {
                    plane.scale.set(4, 4 / aspect, 1);
                } else {
                    plane.scale.set(3 * aspect, 3, 1);
                }
            });

            let disposed = false;
            function animate() {
                if (disposed) return;
                plane.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();

            return function () {
                disposed = true;
                renderer.dispose();
                renderer.domElement.remove();
            };
        }

        // Inicializar escena Three.js para video
        function initVideoScene(container, videoUrl) {
            if (!container || !window.THREE || !videoUrl) return null;

            const width = container.clientWidth || 400;
            const height = container.clientHeight || 300;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
            camera.position.set(0, 0, 5);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            container.appendChild(renderer.domElement);

            const video = document.createElement('video');
            video.src = videoUrl;
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.play().catch(function () { });

            const videoTexture = new THREE.VideoTexture(video);
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(4.5, 2.5),
                new THREE.MeshBasicMaterial({ map: videoTexture })
            );
            scene.add(plane);

            // Marco del portal
            const frameMaterial = new THREE.MeshStandardMaterial({
                color: 0xa5b4fc,
                emissive: 0x6366f1,
                emissiveIntensity: 0.5
            });
            const frameGeometry = new THREE.BoxGeometry(5, 0.15, 0.1);
            const topFrame = new THREE.Mesh(frameGeometry, frameMaterial);
            topFrame.position.y = 1.4;
            scene.add(topFrame);
            const bottomFrame = new THREE.Mesh(frameGeometry, frameMaterial);
            bottomFrame.position.y = -1.4;
            scene.add(bottomFrame);

            const ambient = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambient);

            let disposed = false;
            function animate() {
                if (disposed) return;
                const time = Date.now() * 0.001;
                plane.position.y = Math.sin(time) * 0.05;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();

            return function () {
                disposed = true;
                video.pause();
                video.src = '';
                renderer.dispose();
                renderer.domElement.remove();
            };
        }

        // Iniciar cámara para AR
        function startARCamera(container) {
            // Crear elemento de video para la cámara
            const cameraVideo = document.createElement('video');
            cameraVideo.className = 'ar-camera-video';
            cameraVideo.autoplay = true;
            cameraVideo.playsInline = true;
            cameraVideo.muted = true;

            // Crear fallback por si la cámara no está disponible
            const fallback = document.createElement('div');
            fallback.className = 'ar-camera-fallback';
            container.insertBefore(fallback, container.firstChild);
            container.insertBefore(cameraVideo, container.firstChild);

            // Solicitar acceso a la cámara
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Cámara trasera preferida
                }).then(function (stream) {
                    cameraVideo.srcObject = stream;
                    fallback.style.display = 'none';
                }).catch(function (err) {
                    console.log('Cámara no disponible:', err);
                    cameraVideo.style.display = 'none';
                    // Se muestra el fallback con gradiente
                });
            } else {
                cameraVideo.style.display = 'none';
            }

            // Retornar función de limpieza
            return function () {
                if (cameraVideo.srcObject) {
                    cameraVideo.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                cameraVideo.remove();
                fallback.remove();
            };
        }

        // Mostrar modal de RA
        function showARModal(onContinue) {
            const stageCfg = arConfig.Acierto || {};
            const hasText = stageCfg.text && stageCfg.text.trim();
            const hasImage = stageCfg.imageUrl && stageCfg.imageUrl.trim();
            const hasAudio = stageCfg.audioUrl && stageCfg.audioUrl.trim();
            const hasVideo = stageCfg.videoUrl && stageCfg.videoUrl.trim();

            if (!hasText && !hasImage && !hasAudio && !hasVideo) {
                onContinue();
                return;
            }

            // Limpiar cleanups anteriores
            state.arCleanups.forEach(function (fn) { if (fn) fn(); });
            state.arCleanups = [];

            const modal = document.getElementById('ar-modal');
            const content = document.getElementById('ar-content');
            const contentAr = document.querySelector('.content-ar');
            const symbolsContainer = document.getElementById('ar-symbols');

            content.innerHTML = '';

            // Remover video de cámara anterior si existe
            const oldCamera = contentAr.querySelector('.ar-camera-video');
            const oldFallback = contentAr.querySelector('.ar-camera-fallback');
            if (oldCamera) oldCamera.remove();
            if (oldFallback) oldFallback.remove();

            // Iniciar cámara como fondo
            const cameraCleanup = startARCamera(contentAr);
            state.arCleanups.push(cameraCleanup);

            createFloatingSymbols(symbolsContainer);

            // Agregar contenido de texto
            if (hasText) {
                const textContainer = document.createElement('div');
                textContainer.className = 'ar-three-container';
                textContainer.id = 'ar-text-container';
                content.appendChild(textContainer);
                setTimeout(function () {
                    const cleanup = initTextScene(textContainer, stageCfg.text);
                    if (cleanup) state.arCleanups.push(cleanup);
                }, 100);
            }

            // Agregar contenido de imagen
            if (hasImage) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'ar-three-container';
                imageContainer.id = 'ar-image-container';
                content.appendChild(imageContainer);
                setTimeout(function () {
                    const cleanup = initImageScene(imageContainer, stageCfg.imageUrl);
                    if (cleanup) state.arCleanups.push(cleanup);
                }, 100);
            }

            // Agregar contenido de video
            if (hasVideo) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'ar-three-container';
                videoContainer.id = 'ar-video-container';
                content.appendChild(videoContainer);
                setTimeout(function () {
                    const cleanup = initVideoScene(videoContainer, stageCfg.videoUrl);
                    if (cleanup) state.arCleanups.push(cleanup);
                }, 100);
            }

            // Agregar contenido de audio
            if (hasAudio) {
                const audioContainer = document.createElement('div');
                audioContainer.className = 'ar-audio-container';
                audioContainer.innerHTML = '<div class="ar-audio-icon">🎵</div><audio controls autoplay src="' + stageCfg.audioUrl + '" style="width:280px;"></audio>';
                content.appendChild(audioContainer);

                const audioEl = audioContainer.querySelector('audio');
                state.arCleanups.push(function () {
                    if (audioEl) {
                        audioEl.pause();
                        audioEl.src = '';
                    }
                });
            }

            modal.classList.remove('hidden');

            const continueBtn = document.getElementById('ar-continue-btn');
            continueBtn.onclick = function () {
                state.arCleanups.forEach(function (fn) { if (fn) fn(); });
                state.arCleanups = [];
                modal.classList.add('hidden');
                onContinue();
            };
        }

        // Verificar si hay contenido de RA configurado
        function hasARContent() {
            if (!arSelectedStages.Acierto) return false;
            const cfg = arConfig.Acierto || {};
            return !!(cfg.text?.trim() || cfg.imageUrl?.trim() || cfg.audioUrl?.trim() || cfg.videoUrl?.trim());
        }

        // Formatear tiempo
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        // Iniciar juego
        function startGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');

            state.active = true;
            state.score = 0;
            state.currentIndex = 0;
            state.timeLeft = config.time;

            // Inicializar Blockly
            state.workspace = Blockly.inject('blocklyDiv', {
                toolbox: document.getElementById('toolbox'),
                grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                trashcan: true,
                zoom: { controls: true, wheel: false, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
            });

            loadChallenge();
            startTimer();
        }

        // Iniciar temporizador
        function startTimer() {
            if (state.timer) clearInterval(state.timer);
            state.timer = setInterval(function () {
                state.timeLeft--;
                document.getElementById('timer').textContent = 'Tiempo: ' + formatTime(state.timeLeft);
                if (state.timeLeft <= 0) {
                    clearInterval(state.timer);
                    Swal.fire({
                        title: '¡Tiempo agotado!',
                        text: 'Se acabó el tiempo. Puntuación: ' + state.score,
                        icon: 'info',
                        confirmButtonColor: '#0077b6'
                    }).then(function () { finishGame(false); });
                }
            }, 1000);
        }

        // Cargar desafío
        function loadChallenge() {
            if (state.currentIndex >= config.challenges.length) {
                finishGame(true);
                return;
            }

            const challenge = config.challenges[state.currentIndex];
            document.getElementById('challenge-title').textContent = challenge.title;
            document.getElementById('challenge-description').textContent = challenge.description;
            document.getElementById('progress').textContent = 'Desafío: ' + (state.currentIndex + 1) + '/' + config.challenges.length;

            // Mostrar casos de prueba
            let testHtml = '';
            challenge.testCases.forEach(function (tc, i) {
                testHtml += '<div class="test-case">';
                testHtml += '<div class="input">Entrada: [' + tc.input.join(', ') + ']</div>';
                testHtml += '<div class="expected">Esperado: ' + JSON.stringify(tc.expected) + '</div>';
                testHtml += '</div>';
            });
            document.getElementById('test-cases').innerHTML = testHtml;

            // Mostrar instrucciones
            let instHtml = '<li>Crea una función llamada <b>' + challenge.functionName + '</b>.</li>';
            challenge.instructions.forEach(function (inst) {
                instHtml += '<li>' + inst + '</li>';
            });
            instHtml += '<li>Haz clic en "Ejecutar Solución" para probar tu código.</li>';
            document.getElementById('instructions-list').innerHTML = instHtml;

            // Limpiar workspace
            if (state.workspace) {
                state.workspace.clear();
            }

            // Limpiar consola
            document.getElementById('output-console').innerHTML = '<p>> Esperando ejecución...</p>';
        }

        // Ejecutar solución
        function executeSolution() {
            const challenge = config.challenges[state.currentIndex];
            const code = Blockly.JavaScript.workspaceToCode(state.workspace);
            const outputConsole = document.getElementById('output-console');

            // Verificar que existe la función
            if (code.indexOf('function ' + challenge.functionName) === -1) {
                outputConsole.innerHTML = '<p class="error">> Error: Tu código debe definir una función llamada "' + challenge.functionName + '".</p>';
                Swal.fire({ title: 'Error', text: 'Define una función llamada "' + challenge.functionName + '"', icon: 'error', confirmButtonColor: '#0077b6' });
                return;
            }

            let allCorrect = true;
            let results = [];

            try {
                // Crear función del usuario
                const funcCode = code.replace('function ' + challenge.functionName, 'var ' + challenge.functionName + ' = function');
                const userFunc = new Function(funcCode + '; return ' + challenge.functionName + ';')();

                // Probar cada caso
                for (let i = 0; i < challenge.testCases.length; i++) {
                    const tc = challenge.testCases[i];
                    const result = userFunc.apply(null, tc.input);
                    const isCorrect = JSON.stringify(result) === JSON.stringify(tc.expected);

                    if (!isCorrect) {
                        allCorrect = false;
                        results.push('<p class="error">> Falló: Entrada [' + tc.input.join(', ') + ']. Esperado: ' + JSON.stringify(tc.expected) + ', Recibido: ' + JSON.stringify(result) + '</p>');
                        break;
                    } else {
                        results.push('<p class="success">> Éxito: Entrada [' + tc.input.join(', ') + '] = ' + JSON.stringify(result) + '</p>');
                    }
                }
            } catch (error) {
                allCorrect = false;
                results.push('<p class="error">> Error de ejecución: ' + error.message + '</p>');
            }

            outputConsole.innerHTML = results.join('');

            if (allCorrect) {
                state.score += 10;
                document.getElementById('score').textContent = 'Puntos: ' + state.score;

                // Verificar si hay contenido de RA
                if (hasARContent()) {
                    showARModal(function () {
                        state.currentIndex++;
                        loadChallenge();
                    });
                } else {
                    Swal.fire({
                        title: '¡Correcto!',
                        html: 'Has ganado <b style="color: #22c55e; font-size: 1.5rem;">10 Puntos</b>',
                        icon: 'success',
                        confirmButtonText: state.currentIndex < config.challenges.length - 1 ? 'Siguiente desafío' : 'Ver resultado',
                        confirmButtonColor: '#0077b6'
                    }).then(function () {
                        state.currentIndex++;
                        loadChallenge();
                    });
                }
            } else {
                Swal.fire({ title: 'Incorrecto', text: 'Revisa tu código e intenta de nuevo', icon: 'error', confirmButtonColor: '#0077b6' });
            }
        }

        // Finalizar juego
        function finishGame(completed) {
            if (state.timer) clearInterval(state.timer);
            state.active = false;

            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = state.score;
            document.getElementById('end-title').textContent = completed ? '¡Felicidades!' : '¡Juego Terminado!';
        }

        // Confirmar antes de finalizar
        window.finishGameConfirm = function () {
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Finalizarás el juego con tu puntuación actual.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, finalizar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#0077b6'
            }).then(function (result) {
                if (result.isConfirmed) finishGame(false);
            });
        };

        // Reemplazar el onclick del botón finalizar
        document.addEventListener('DOMContentLoaded', function () {
            var finishBtn = document.querySelector('.finish-btn');
            if (finishBtn) {
                finishBtn.onclick = window.finishGameConfirm;
            }
            // Inicializar información del modal
            initModalInfo();
        });
    </script>
</body>

</html>`;
};

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
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
        padding: 0.75rem 1.5rem !important;
        border-radius: 0.5rem !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
        border: none !important;
        background: #005f92 !important;
        color: white !important;
        font-size: 1rem !important;
    }
    .btn-primary:hover:not(:disabled) {
        background: #004a73;
        transform: translateY(-1px);
    }
    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Grid Helpers */
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-card-header { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-card-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }

    /* Modal de Descarga */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); animation: fadeIn 0.3s ease; }
    .modal-content { background: white; padding: 2.5rem; border-radius: 1rem; width: 90%; max-width: 450px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative; animation: slideUp 0.3s ease; }
    .download-progress-container { width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; margin: 1.5rem 0; }
    .download-progress-bar { height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); transition: width 0.4s ease-in-out; border-radius: 6px; }
    .status-text { font-size: 1.1rem; color: #4b5563; font-weight: 500; min-height: 1.5rem; }
    .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; cursor: pointer; color: #9ca3af; }
    .close-btn:hover { color: #4b5563; }
    .icon-pulse { animation: pulse 2s infinite; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
`;

const getCurrentDateString = () => new Date().toLocaleDateString('en-CA');

// --- CONFIGURACIÓN DE PLANTILLA ANDROID PARA BLOCKLY ---
const ANDROID_GAME_CONFIG = {
    baseZipUrl: '/templates/blockly/android-base.zip',
    configPath: 'android/app/src/main/assets/public/config/blockly-config.json',
    buildConfigData: ({ gameConfig, gameDetails, selectedPlatforms }) => {
        const nivelMap = {
            'Básico': 'basico',
            'Intermedio': 'intermedio',
            'Avanzado': 'avanzado',
        };

        return {
            nivel: nivelMap[gameConfig?.difficulty] || 'basico',
            desafios: gameConfig?.challengeCount || 3,
            tiempo: gameConfig?.time || 300,
            nombreApp: gameDetails?.gameName || 'Programación Por Bloques',
            version: gameDetails?.version || '1.0.0',
            descripcion: gameDetails?.description || '',
            fecha: getCurrentDateString(),
            plataformas: Array.isArray(selectedPlatforms)
                ? selectedPlatforms
                : ['android'],
            arConfig: gameConfig?.arConfig || {},
            arSelectedStages: gameConfig?.arSelectedStages || {},
        };
    },
};

// --- COMPONENTE SUMMARY ---
const Summary = ({ config = {}, onBack }) => {
    // Estados para controlar la descarga de Android
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [jsZipReady, setJsZipReady] = useState(false);

    // Estados para el modal de descarga Web
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    const [isDownloadReady, setIsDownloadReady] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(-1));
    const state = location.state || null;

    // --- DATOS DE RESPALDO PARA PREVIEW ---
    const MOCK_DATA = {
        selectedAreas: ['technology'],
        selectedSkills: ['Pensamiento lógico', 'Resolución de problemas', 'Programación visual'],
        gameDetails: {
            gameName: "Programación Por Bloques (Preview)",
            description: "Juego de programación visual con Blockly para desarrollar habilidades de codificación.",
            version: "1.0.0",
            date: getCurrentDateString()
        },
        selectedPlatforms: ['android'],
        gameConfig: {
            difficulty: 'Básico',
            challengeCount: 3,
            time: 300
        }
    };

    const data = state ?? MOCK_DATA;

    // Obtener la configuración del juego
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

            console.log('fecha:', buildConfigData({ gameConfig, gameDetails, selectedPlatforms }).fecha);

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
            const nombreArchivo = `android-blockly-${configData.nivel}.zip`
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

    // --- FUNCIÓN PARA DESCARGAR WEB ZIP ---
    const handleDownloadZip = () => {
        if (!window.JSZip) { alert("Cargando librería ZIP..."); return; }
        setIsModalOpen(true);
        setIsDownloadReady(false);
        setProgress(0);
        setStatusText("Preparando archivos...");

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5;

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setStatusText("¡Completado!");
                generateAndDownloadZip();
            } else {
                if (currentProgress > 20 && currentProgress < 50) setStatusText("Generando código HTML...");
                if (currentProgress >= 50 && currentProgress < 80) setStatusText("Comprimiendo recursos...");
                if (currentProgress >= 80) setStatusText("Finalizando paquete...");
                setProgress(currentProgress);
            }
        }, 400);
    };

    const generateAndDownloadZip = async () => {
        try {
            const zip = new window.JSZip();

            // Obtener los desafíos según la dificultad
            const difficultyMap = {
                'Básico': ALL_CHALLENGES.filter(c => c.difficulty === 'Básico').slice(0, gameConfig.challengeCount || 3),
                'Intermedio': ALL_CHALLENGES.filter(c => c.difficulty === 'Intermedio').slice(0, gameConfig.challengeCount || 4),
                'Avanzado': ALL_CHALLENGES.filter(c => c.difficulty === 'Avanzado').slice(0, gameConfig.challengeCount || 5)
            };

            const challenges = difficultyMap[gameConfig.difficulty] || difficultyMap['Básico'];

            // Configuración segura con RA
            const safeConfig = {
                difficulty: gameConfig.difficulty || 'Básico',
                time: gameConfig.time || 300,
                challengeCount: gameConfig.challengeCount || 3,
                challenges: challenges,
                arConfig: gameConfig.arConfig || {},
                arSelectedStages: gameConfig.arSelectedStages || {},
                // Datos del generador
                appName: gameDetails.gameName || 'Programación por Bloques',
                appVersion: gameDetails.version || '1.0.0',
                appFecha: gameDetails.date || getCurrentDateString(),
                appPlataformas: selectedPlatforms || ['web'],
                appDescripcion: gameDetails.description || 'Juego de programación visual con Blockly'
            };

            const htmlContent = generateGameCode(safeConfig);
            zip.file("index.html", htmlContent);

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            const fileName = `juego-blockly-${safeConfig.difficulty}.zip`
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .toLowerCase();
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setProgress(100);
            setIsDownloadReady(true);
        } catch (error) {
            console.error("Error generando el ZIP:", error);
            setStatusText("Error al generar el archivo.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProgress(0);
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
            // Parsear YYYY-MM-DD manualmente para evitar problemas de timezone
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month es 0-indexed
            return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) { return "Fecha inválida"; }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Básico': '#22c55e',
            'Intermedio': '#f59e0b',
            'Avanzado': '#ef4444'
        };
        return colors[difficulty] || '#0077b6';
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
                        <div className="info-card-value">{gameDetails.gameName || 'Programación Por Bloques'}</div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Layers size={16} /> Versión</div>
                        <div className="info-card-value">{gameDetails.version || '1.0.0'}</div>
                    </div>

                    <div className="info-card full-width">
                        <div className="info-card-header"><FileText size={16} /> Descripción</div>
                        <div className="info-card-value" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                            {gameDetails.description || 'Juego de programación visual con Blockly para desarrollar habilidades de codificación.'}
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Calendar size={16} /> Fecha de Creación</div>
                        <div className="info-card-value">{formatDate(getCurrentDateString())}</div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header"><Monitor size={16} /> Plataformas</div>
                        <div className="info-card-value">
                            {selectedPlatforms?.length > 0
                                ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
                                : 'Android'}
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
                            <Zap size={18} /> Dificultad:
                        </span>
                        <strong style={{
                            fontSize: '1.1rem',
                            color: getDifficultyColor(gameConfig.difficulty),
                            padding: '0.25rem 0.75rem',
                            background: `${getDifficultyColor(gameConfig.difficulty)}15`,
                            borderRadius: '0.5rem'
                        }}>
                            {gameConfig.difficulty || 'Básico'}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Code size={18} /> Número de desafíos:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {gameConfig.challengeCount || 3}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b' }}>
                            <Clock size={18} /> Tiempo disponible:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077b6' }}>
                            {formatTime(gameConfig.time || 300)}
                        </strong>
                    </div>
                </div>

                {/* Sección de Realidad Aumentada */}
                {gameConfig.arSelectedStages?.Acierto && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={18} /> Realidad Aumentada Configurada
                        </h4>
                        <p style={{ margin: 0, color: '#15803d', fontSize: '0.9rem' }}>
                            La etapa "Acierto" está habilitada con contenido personalizado.
                        </p>
                    </div>
                )}

                {/* Botón "Volver a Editar" */}
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        className="btn-primary"
                        onClick={handleBack}
                        disabled={isGeneratingAndroid}
                        style={{ opacity: isGeneratingAndroid ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            {/* Sección de Descarga */}
            <div className="download-section">
                <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
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

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {/* Botón Web (HTML) */}
                    <button
                        onClick={handleDownloadZip}
                        disabled={isGeneratingAndroid}
                        style={{
                            backgroundColor: '#22c55e',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: isGeneratingAndroid ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
                            opacity: isGeneratingAndroid ? 0.6 : 1
                        }}
                    >
                        <Globe size={18} /> Web (HTML)
                    </button>

                    {/* Botón Android */}
                    <button
                        onClick={generarAndroidZipConConfig}
                        disabled={isGeneratingAndroid || !jsZipReady}
                        style={{
                            backgroundColor: '#3ddc84',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: (isGeneratingAndroid || !jsZipReady) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(61, 220, 132, 0.39)',
                            opacity: (isGeneratingAndroid || !jsZipReady) ? 0.6 : 1
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
                    <strong>Web:</strong> Archivo HTML listo para abrir en navegador.
                    {' '}<strong>Android:</strong> Proyecto React Native listo para compilar en Android Studio.
                </p>
            </div>

            {/* --- MODAL DE DESCARGA WEB --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {isDownloadReady && <button className="close-btn" onClick={closeModal}><X size={24} /></button>}

                        <div style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', background: isDownloadReady ? '#dcfce7' : '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isDownloadReady ? (
                                <CheckCircle size={48} color="#22c55e" className="icon-pulse" />
                            ) : (
                                <Package size={48} color="#3b82f6" className="icon-pulse" />
                            )}
                        </div>

                        <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>
                            {isDownloadReady ? '¡Descarga Lista!' : 'Empaquetando Juego'}
                        </h3>

                        <p style={{ color: '#6b7280', margin: 0 }}>
                            {statusText}
                        </p>

                        <div className="download-progress-container">
                            <div className="download-progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                            {progress}% completado
                        </p>

                        {isDownloadReady && (
                            <button onClick={closeModal} style={{ marginTop: '1rem', width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                Cerrar Ventana
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Summary;
