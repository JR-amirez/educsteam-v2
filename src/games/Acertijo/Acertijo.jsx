import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
    HelpCircle, RotateCcw, Timer, Trophy, Star, CheckCircle,
    Sun, Wind, Sprout, Leaf, Copy, Activity,
    Calculator, PieChart, Hash,
    Brain, Heart, Eye, Ear, Bone,
    Square, Circle, Triangle, Hexagon, Octagon, BoxSelect,
    Syringe, Shield, Thermometer, Pill, AlertTriangle,
    Box, Cylinder, Cone, Globe, Pyramid,
    ArrowLeft, Tag, FileText, Calendar, Monitor, Shapes, Clock, List, Layers, Puzzle, Type, Smartphone
} from 'lucide-react';

const getCurrentDateString = () => new Date().toLocaleDateString('en-CA');

// --- ESTILOS GLOBALES DEL JUEGO (ACERTIJO) ---
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
        .card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-card); }
        .level-select-container { width: 100%; max-width: 64rem; background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; height: 90vh; }
        
        /* Botones Generales */
        .start-btn { width: 100%; padding: 1rem; margin-top: 1rem; background-color: var(--primary-blue); color: white; border: none; border-radius: 0.8rem; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(0, 119, 182, 0.3); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .start-btn:disabled { background-color: var(--gray-secondary); cursor: not-allowed; box-shadow: none; transform: none; opacity: 0.7; }
        .start-btn:hover:not(:disabled) { transform: translateY(-2px); }
        
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

        /* Botón de selección más compacto para ver más */
        .acertijo-select-btn { 
            background: var(--soft-white); 
            padding: 0.75rem; 
            border-radius: 0.75rem; 
            border: 2px solid transparent; 
            transition: all 0.2s ease; 
            text-align: left; 
            display: flex; 
            align-items: center; 
            gap: 0.75rem; 
            cursor: pointer; 
            width: 100%; 
        }
        .acertijo-select-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .acertijo-select-btn.selected { background: var(--light-blue); border-color: var(--primary-blue); transform: scale(1.01); }
        
        .control-btn { width: 100%; padding: 0.8rem; border-radius: 0.75rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; }
        /* Modificado: btn-finish ahora usa el color azul primario */
        .btn-finish { background-color: var(--primary-blue); color: white; } 
        .btn-exit { background-color: white; color: var(--danger-red); border: 2px solid var(--danger-red); }

        /* Juego */
        .game-layout { display: grid; grid-template-columns: 250px 1fr 250px; gap: 2rem; width: 100%; max-width: 1200px; align-items: center; }
        @media (max-width: 1024px) { .game-layout { grid-template-columns: 1fr; } }
        
        .question-card { background: white; padding: 3rem 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-card); text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; }
        .question-text { font-family: 'Merriweather', serif; font-size: 1.8rem; color: var(--dark-blue); line-height: 1.6; }
        .topic-badge { position: absolute; top: 1.5rem; background: var(--light-blue); color: var(--primary-blue); padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; }
        
        .answer-btn-modern { background: white; border: 2px solid transparent; padding: 1rem; border-radius: 1rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; height: 120px; justify-content: center; width: 100%; }
        .answer-btn-modern:hover { transform: translateY(-5px); border-color: var(--primary-blue); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        
        /* Grid más denso para la lista de selección */
        .riddle-grid-compact {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 0.75rem;
            padding-right: 0.5rem;
        }
    `}</style>
);

// --- ESTILOS ESPECÍFICOS DEL SUMMARY ---
const summaryStyles = `
    .summary-screen {
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        background: #ffffff;
        color: #1f2937;
        border-radius: 1.5rem;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
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
        flex-direction: column;
        gap: 0.5rem;
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

// --- DATOS ---
const ACERTIJOS_POR_NIVEL = {
  "básico": [
    { id: "b1", tema: "Funciones Vitales", pregunta: "No me alimento como tú ni como un animal; con luz, agua y aire fabrico mi pan.", respuesta: "Fotosíntesis", opciones: ["Fotosíntesis", "Respiración", "Reproducción"] },
    { id: "b2", tema: "Funciones Vitales", pregunta: "No tengo pulmones como tú, pero día y noche respiro. Tomo aire por mis poros y en silencio sigo vivo. ¿Qué proceso realizo?", respuesta: "Respiración", opciones: ["Digestión", "Respiración", "Excreción"] },
    { id: "b3", tema: "Funciones Vitales", pregunta: "No necesito pedir comida ni pedir comida para llevar. Yo mismo me la preparo, ¿cómo me puedo llamar?", respuesta: "Autótrofo", opciones: ["Autótrofo", "Heterótrofo", "Trofólogo"] },
    { id: "b4", tema: "Funciones Vitales", pregunta: "De una semillita salgo yo, y luego hago miles más. Soy un proceso que hace copias para que la vida continúe sin parar. ¿Quién soy?", respuesta: "Reproducción", opciones: ["Nutrición", "Reproducción", "Deporte vegetal"] },
    { id: "b5", tema: "Funciones Vitales", pregunta: "Aunque no tengo pies ni ruedas, me muevo sin caminar. Si la luz aparece, hacia ella me verás girar. ¿Qué soy?", respuesta: "Fototropismo", opciones: ["Fototropismo", "Hibernación", "Fotosíntesis"] },
    { id: "b6", tema: "Lógica", pregunta: "Ana tiene el doble de años que Luis. Si entre los dos suman 18 años, ¿cuántos años tiene Ana?", respuesta: "12", opciones: ["6", "12", "9"] },
    { id: "b7", tema: "Lógica", pregunta: "Tenías 3/4 de una pizza. Te comes la mitad de lo que tenías. ¿Qué fracción de la pizza comiste?", respuesta: "3/8", opciones: ["3/8", "1/4", "1/2"] },
    { id: "b8", tema: "Lógica", pregunta: "A, B y C tienen canicas. A tiene el doble que B, y C tiene 5 menos que A. Si entre los tres suman 30 canicas, ¿cuántas tiene B?", respuesta: "7", opciones: ["5", "7", "10"] },
    { id: "b9", tema: "Lógica", pregunta: "Soy un número de dos cifras. La cifra de las decenas es 3 veces la cifra de las unidades, y la suma de mis cifras es 12. ¿Quién soy?", respuesta: "93", opciones: ["39", "84", "93"] },
    { id: "b10", tema: "Lógica", pregunta: "¿Cuál es el número más pequeño mayor que 100 que es divisible tanto por 5 como por 7?", respuesta: "105", opciones: ["105", "110", "140"] }
  ],
  "intermedio": [
    { id: "i1", tema: "Cuerpo Humano", pregunta: "Sin mí no puedes pensar, soñar ni recordar. Coordino lo que haces sin descansar. ¿Quién soy?", respuesta: "Cerebro", opciones: ["Corazón", "Cerebro", "Estómago"] },
    { id: "i2", tema: "Cuerpo Humano", pregunta: "Me inflo y me desinflo sin parar, gracias a mí puedes saltar, hablar y respirar. ¿Quién soy?", respuesta: "Pulmones", opciones: ["Pulmones", "Hígado", "Riñones"] },
    { id: "i3", tema: "Cuerpo Humano", pregunta: "Soy un saco que nunca cocina, pero con jugos y ácidos la comida tritura. ¿Quién soy?", respuesta: "Estómago", opciones: ["Estómago", "Intestino", "Páncreas"] },
    { id: "i4", tema: "Cuerpo Humano", pregunta: "Somos dos y trabajamos en silencio, limpiamos la sangre y expulsamos lo que no tiene uso. ¿Quiénes somos?", respuesta: "Riñones", opciones: ["Pulmones", "Riñones", "Corazón"] },
    { id: "i5", tema: "Cuerpo Humano", pregunta: "Transformo lo que comes, limpio tu sangre y te ayudo a digerir. Sin mí, te costaría mucho vivir. ¿Quién soy?", respuesta: "Hígado", opciones: ["Páncreas", "Hígado", "Estómago"] },
    { id: "i6", tema: "Cuerpo Humano", pregunta: "Soy largo, delgado y estoy en tu barriga. De lo que comes, tomo lo bueno y lo envío a la sangre enseguida. ¿Quién soy?", respuesta: "Intestino delgado", opciones: ["Intestino grueso", "Intestino delgado", "Páncreas"] },
    { id: "i7", tema: "Cuerpo Humano", pregunta: "Gracias a mí puedes brincar, correr y abrazar. Me estiro y me encojo para poder moverte sin parar. ¿Quién soy?", respuesta: "Músculo", opciones: ["Músculo", "Hueso", "Cerebro"] },
    { id: "i8", tema: "Cuerpo Humano", pregunta: "Abro y cierro mis cortinas cada día, y con mi ayuda ves colores, formas y alegría. ¿Quién soy?", respuesta: "Ojo", opciones: ["Oído", "Ojo", "Nariz"] },
    { id: "i9", tema: "Geometría", pregunta: "Todos mis lados son iguales, y mis ángulos son perfectos y rectales. ¿Quién soy?", respuesta: "Cuadrado", opciones: ["Cuadrado", "Rectángulo", "Rombo"] },
    { id: "i10", tema: "Geometría", pregunta: "Parezco un cuadrado girado, todos mis lados son iguales, pero mis ángulos algo inclinados. ¿Quién soy?", respuesta: "Rombo", opciones: ["Trapecio", "Rombo", "Hexágono"] },
    { id: "i11", tema: "Geometría", pregunta: "Si dibujas una estrella, seguro me ves, porque soy el polígono con cinco pies. ¿Quién soy?", respuesta: "Pentágono", opciones: ["Pentágono", "Hexágono", "Heptágono"] },
    { id: "i12", tema: "Geometría", pregunta: "Las abejas me usan para construir su hogar, tengo seis lados iguales, ¡me encanta trabajar!", respuesta: "Hexágono", opciones: ["Hexágono", "Octágono", "Heptágono"] },
    { id: "i13", tema: "Geometría", pregunta: "Cuando manejas, me ves en la esquina, tengo ocho lados y una forma divina.", respuesta: "Octágono", opciones: ["Octágono", "Hexágono", "Decágono"] },
    { id: "i14", tema: "Geometría", pregunta: "No tengo lados ni puntas tampoco, pero si me lanzas, ruedo poco a poco.", respuesta: "Círculo", opciones: ["Círculo", "Elipse", "Óvalo"] },
    { id: "i15", tema: "Geometría", pregunta: "Nací del círculo al partirlo en dos, parezco una sonrisa si me ves con atención. ¿Quién soy?", respuesta: "Semicírculo", opciones: ["Trapecio", "Triángulo", "Semicírculo"] },
    { id: "i16", tema: "Geometría", pregunta: "Tengo cuatro lados, pero solo dos son paralelos. Parecen mis techos inclinados, ¡no soy nada feo!", respuesta: "Trapecio", opciones: ["Romboide", "Trapecio", "Triángulo"] }
  ],
  "avanzado": [
    { id: "a1", tema: "Vacunas", pregunta: "Provoco fiebre, tos y puntitos rojos en la piel, soy muy contagioso. Gracias a una vacuna triple, ya no doy tanto miedo.", respuesta: "Triple viral (SRP)", opciones: ["Varicela", "Triple viral (SRP)", "Rotavirus"] },
    { id: "a2", tema: "Vacunas", pregunta: "Te dejo sin aire con mi garganta inflamada, y antes mi ataque era temido. Una vacuna con tres nombres me detuvo enseguida.", respuesta: "DTP (Difteria)", opciones: ["DTP (Difteria)", "BCG", "Hepatitis B"] },
    { id: "a3", tema: "Vacunas", pregunta: "Me gusta esconderme en los nervios y dejarte sin mover. Pero con una vacuna oral me hicieron desaparecer.", respuesta: "Polio (Sabin)", opciones: ["Triple viral", "Polio (Sabin)", "Rotavirus"] },
    { id: "a4", tema: "Vacunas", pregunta: "Si te cortas y no estás protegido, te dejo tieso y adolorido. Por suerte, hay una vacuna que evita el peligro.", respuesta: "DTP (Tétanos)", opciones: ["Hepatitis A", "DTP (Tétanos)", "BCG"] },
    { id: "a5", tema: "Vacunas", pregunta: "Me escondo en el agua y la comida contaminada, y dejo tu piel amarilla. Con una vacuna sencilla quedo derrotada.", respuesta: "Hepatitis A", opciones: ["Neumocócica", "Hepatitis A", "Hepatitis B"] },
    { id: "a6", tema: "Vacunas", pregunta: "Me encanta inflar tu cara y causar fiebre, antes era común entre niños. Una vacuna triple me deja sin poderes.", respuesta: "Triple viral (Paperas)", opciones: ["Triple viral (Paperas)", "Hepatitis A", "DTP"] },
    { id: "a7", tema: "Vacunas", pregunta: "Provoco diarrea y vómito sin parar, especialmente en bebés. Con unas gotitas en la boca me puedes derrotar.", respuesta: "Rotavirus", opciones: ["Neumocócica", "Rotavirus", "Hepatitis A"] },
    { id: "a8", tema: "Vacunas", pregunta: "Entro por el aire y ataco los pulmones, dejo tos y cansancio. Una vacuna deja marca en el brazo, y me detiene.", respuesta: "BCG", opciones: ["BCG", "DTP", "Influenza"] },
    { id: "a9", tema: "Vacunas", pregunta: "Cada año cambio de disfraz, te hago estornudar y moquear sin paz. Una vacuna anual me pone un alto eficaz.", respuesta: "Influenza", opciones: ["Influenza", "COVID-19", "Neumocócica"] },
    { id: "a10", tema: "Vacunas", pregunta: "Dejo granitos que dan picazón, y aunque soy leve, provoco irritación. Una vacuna evita mi invasión.", respuesta: "Varicela", opciones: ["Rotavirus", "Varicela", "Triple viral"] },
    { id: "a11", tema: "Geometría 3D", pregunta: "Tengo 6 caras rectangulares y todas se enfrentan con orden, guardo cosas, soy práctico y me encuentras en cualquier rincón.", respuesta: "Prisma rectangular", opciones: ["Cubo", "Prisma rectangular", "Pirámide"] },
    { id: "a12", tema: "Geometría 3D", pregunta: "Tengo 6 caras cuadradas, 8 vértices y 12 aristas bien contadas. Me usan en los juegos y también en matemáticas.", respuesta: "Cubo", opciones: ["Esfera", "Cilindro", "Cubo"] },
    { id: "a13", tema: "Geometría 3D", pregunta: "Tengo dos bases iguales y paralelas, mis caras laterales son rectángulos. Puedo ser triangular, cuadrangular o hexagonal.", respuesta: "Prisma", opciones: ["Prisma", "Pirámide", "Cono"] },
    { id: "a14", tema: "Geometría 3D", pregunta: "Tengo una base que puede ser cuadrada o triangular, y todas mis caras laterales se encuentran en un punto al brillar.", respuesta: "Pirámide", opciones: ["Cilindro", "Pirámide", "Prisma"] },
    { id: "a15", tema: "Geometría 3D", pregunta: "No tengo vértices ni caras planas, ruedo sin parar y soy totalmente suave. ¿Quién soy?", respuesta: "Esfera", opciones: ["Esfera", "Cono", "Cilindro"] },
    { id: "a16", tema: "Geometría 3D", pregunta: "Tengo dos círculos arriba y abajo, y un cuerpo recto que parece un tubo. Sirvo para guardar agua o lápices.", respuesta: "Cilindro", opciones: ["Cono", "Cilindro", "Prisma"] },
    { id: "a17", tema: "Geometría 3D", pregunta: "Tengo una base redonda y un solo vértice arriba, si me giras parezco un helado o una colina.", respuesta: "Cono", opciones: ["Cono", "Esfera", "Pirámide"] },
    { id: "a18", tema: "Geometría 3D", pregunta: "Tengo 4 caras, todas son triángulos iguales, no tengo base diferente ni lados desiguales.", respuesta: "Tetraedro", opciones: ["Tetraedro", "Octaedro", "Prisma triangular"] },
    { id: "a19", tema: "Geometría 3D", pregunta: "Parezco dos pirámides pegadas por la base, mis 8 caras son triángulos, ¡qué elegancia y clase!", respuesta: "Octaedro", opciones: ["Octaedro", "Dodecaedro", "Prisma hexagonal"] },
    { id: "a20", tema: "Geometría 3D", pregunta: "Mis caras son pentágonos perfectos, y aunque soy difícil de dibujar, ¡soy muy geométrico y correcto!", respuesta: "Dodecaedro", opciones: ["Dodecaedro", "Icosaedro", "Cubo"] }
  ]
};

const iconMap = {
    "Fotosíntesis": { icon: Sun }, "Respiración": { icon: Wind }, "Autótrofo": { icon: Sprout }, "Reproducción": { icon: Copy }, "Fototropismo": { icon: Leaf },
    "6": { icon: Hash }, "12": { icon: Calculator }, "9": { icon: Hash }, "3/8": { icon: PieChart }, "1/4": { icon: PieChart }, "1/2": { icon: PieChart },
    "7": { icon: Hash }, "5": { icon: Hash }, "10": { icon: Hash }, "93": { icon: Hash }, "39": { icon: Hash }, "84": { icon: Hash }, "105": { icon: Hash }, "110": { icon: Hash }, "140": { icon: Hash },
    "Cerebro": { icon: Brain }, "Corazón": { icon: Heart }, "Estómago": { icon: Activity }, "Pulmones": { icon: Wind }, "Hígado": { icon: Activity }, "Riñones": { icon: Activity },
    "Páncreas": { icon: Activity }, "Intestino": { icon: Activity }, "Intestino grueso": { icon: Activity }, "Intestino delgado": { icon: Activity }, "Músculo": { icon: Activity }, "Hueso": { icon: Bone }, "Ojo": { icon: Eye }, "Oído": { icon: Ear }, "Nariz": { icon: Activity },
    "Cuadrado": { icon: Square }, "Rectángulo": { icon: Square }, "Rombo": { icon: Square }, "Trapecio": { icon: BoxSelect }, "Hexágono": { icon: Hexagon }, "Pentágono": { icon: Hexagon }, "Heptágono": { icon: Hexagon }, "Octágono": { icon: Octagon }, "Decágono": { icon: Octagon }, "Círculo": { icon: Circle }, "Elipse": { icon: Circle }, "Óvalo": { icon: Circle }, "Semicírculo": { icon: Circle }, "Triángulo": { icon: Triangle }, "Romboide": { icon: Square },
    "Triple viral (SRP)": { icon: Syringe }, "Varicela": { icon: AlertTriangle }, "Rotavirus": { icon: Pill }, "DTP (Difteria)": { icon: Shield }, "DTP (Tétanos)": { icon: Shield }, "DTP": { icon: Shield }, "BCG": { icon: Syringe }, "Hepatitis B": { icon: Syringe }, "Hepatitis A": { icon: Pill }, "Polio (Sabin)": { icon: Syringe }, "Triple viral": { icon: Syringe }, "Triple viral (Paperas)": { icon: Syringe }, "Neumocócica": { icon: Syringe }, "Influenza": { icon: Thermometer }, "COVID-19": { icon: AlertTriangle },
    "Prisma rectangular": { icon: Box }, "Cubo": { icon: Box }, "Pirámide": { icon: Pyramid }, "Esfera": { icon: Globe }, "Cilindro": { icon: Cylinder }, "Cono": { icon: Cone }, "Prisma": { icon: Box }, "Tetraedro": { icon: Pyramid }, "Octaedro": { icon: Pyramid }, "Dodecaedro": { icon: Globe }, "Icosaedro": { icon: Globe }, "Prisma hexagonal": { icon: Box }, "Prisma triangular": { icon: Pyramid }
};

// --- GENERADOR HTML (MODIFICADO PARA MATCH SUMMARY) ---
const generateGameCode = (config, gameDetails, selectedPlatforms) => {
    // Si config no existe, usar valores por defecto para evitar error en el generador
    if (!config) config = { difficulty: "Básico", timeLimit: 60, riddles: [] };

    // Formatear datos para el HTML
    const formattedDate = gameDetails.date 
        ? new Date(gameDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Fecha no especificada';
    
    const platformsString = selectedPlatforms && selectedPlatforms.length > 0
        ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
        : 'Web';

    const iconMappingJS = `
        const iconMap = {
            "Fotosíntesis": "sun", "Respiración": "wind", "Autótrofo": "sprout", "Reproducción": "copy", "Fototropismo": "leaf",
            "6": "hash", "12": "calculator", "9": "hash", "3/8": "pie-chart", "1/4": "pie-chart", "1/2": "pie-chart",
            "7": "hash", "5": "hash", "10": "hash", "93": "hash", "39": "hash", "84": "hash", "105": "hash", "110": "hash", "140": "hash",
            "Cerebro": "brain", "Corazón": "heart", "Estómago": "activity", "Pulmones": "wind", "Hígado": "activity", "Riñones": "activity",
            "Páncreas": "activity", "Intestino": "activity", "Intestino grueso": "activity", "Intestino delgado": "activity",
            "Músculo": "activity", "Hueso": "bone", "Ojo": "eye", "Oído": "ear", "Nariz": "activity",
            "Cuadrado": "square", "Rectángulo": "square", "Rombo": "square", "Trapecio": "box-select", "Hexágono": "hexagon",
            "Pentágono": "hexagon", "Heptágono": "hexagon", "Octágono": "octagon", "Decágono": "octagon", "Círculo": "circle",
            "Elipse": "circle", "Óvalo": "circle", "Semicírculo": "circle", "Triángulo": "triangle", "Romboide": "square",
            "Triple viral (SRP)": "syringe", "Varicela": "alert-triangle", "Rotavirus": "pill", "DTP (Difteria)": "shield",
            "DTP (Tétanos)": "shield", "DTP": "shield", "BCG": "syringe", "Hepatitis B": "syringe", "Hepatitis A": "pill",
            "Polio (Sabin)": "syringe", "Triple viral": "syringe", "Triple viral (Paperas)": "syringe", "Neumocócica": "syringe",
            "Influenza": "thermometer", "COVID-19": "alert-triangle",
            "Prisma rectangular": "box", "Cubo": "box", "Pirámide": "pyramid", "Esfera": "globe", "Cilindro": "cylinder",
            "Cono": "cone", "Prisma": "box", "Tetraedro": "pyramid", "Octaedro": "pyramid", "Dodecaedro": "globe",
            "Icosaedro": "globe", "Prisma hexagonal": "box", "Prisma triangular": "pyramid"
        };
    `;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameDetails.gameName || 'Juego de Acertijos'} - ${config.difficulty}</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #0077b6; --dark: #023e8a; --light: #e0f7fa; --bg: #f0f2f5; --white: #ffffff; --green: #2a9d8f; --red: #e63946; --secondary: #1f2937; }
        body { font-family: 'Nunito', sans-serif; background: var(--bg); color: #212529; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden;}
        .game-layout { display: grid; grid-template-columns: 200px 1fr 200px; gap: 2rem; width: 100%; max-width: 1200px; }
        @media (max-width: 1024px) { .game-layout { grid-template-columns: 1fr; } }
        .card { background: var(--white); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .stats-card { display: flex; flex-direction: column; gap: 1rem; height: fit-content; }
        .stat-item { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #4b5563; font-size: 1.1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 0.5rem; }
        .question-card { padding: 3rem 2rem; text-align: center; min-height: 300px; display: flex; flex-direction: column; justify-content: center; position: relative; border-radius: 1.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .question-text { font-family: 'Merriweather', serif; font-size: 1.8rem; color: var(--dark); line-height: 1.6; font-weight: 700; }
        .topic-badge { position: absolute; top: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--light); color: var(--primary); padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; }
        .answers-column { display: flex; flex-direction: column; gap: 1rem; justify-content: center; }
        .answer-btn { background: var(--white); border: 2px solid transparent; padding: 1rem; border-radius: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100px; justify-content: center; }
        .answer-btn:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .answer-label { font-weight: 600; color: var(--dark); }
        .icon-large { width: 32px; height: 32px; color: var(--primary); }
        .control-btn { padding: 0.8rem; border-radius: 0.5rem; font-weight: 700; border: none; cursor: pointer; width: 100%; margin-top: 1rem; color: white; background: var(--red); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 50; transition: opacity 0.3s; padding: 20px; box-sizing: border-box; }
        .hidden { display: none !important; opacity: 0; pointer-events: none; }
        .big-btn { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 200px; }
        .big-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .btn-exit { background: var(--secondary); }
        .btn-retry { background: var(--primary); }
        .btn-info { background: white; color: var(--primary); border: 2px solid var(--primary); }
        
        /* Cuenta regresiva */
        .countdown-number { font-size: 8rem; font-weight: bold; color: var(--primary); animation: popIn 0.5s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        /* Estilos del Modal de Información */
        .info-modal-content {
            background: white; padding: 2.5rem; border-radius: 1rem; max-width: 600px; width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb; position: relative;
        }
        .info-header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .info-title { font-size: 1.8rem; color: var(--primary); margin: 0; font-weight: 800; }
        .info-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
        .info-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .info-item { background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; font-weight: 600; }
        .info-value { font-size: 1.1rem; color: #334155; font-weight: 500; }
        .info-desc { grid-column: 1 / -1; background: #fff; padding: 0; border: none; }
        .info-desc .info-value { font-size: 1rem; line-height: 1.6; color: #475569; }
        .close-info-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .close-info-btn:hover { color: var(--red); }
        .end-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 2rem; }
        @media(max-width: 768px) { .info-details-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div id="start-screen" class="overlay">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; text-align: center;">${gameDetails.gameName || 'Juego de Acertijos'}</h1>
        <div style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; margin-bottom: 2rem; display: inline-block;">
            Nivel: ${config.difficulty}
        </div>
        <p style="margin-bottom: 2rem; font-size: 1.1rem; color: #666;">
            Responde correctamente antes de que se agote el tiempo.
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <button class="big-btn" onclick="startGameSequence()">▶ Iniciar Juego</button>
            <button class="big-btn btn-info" onclick="toggleInfo(true)">ℹ Información</button>
        </div>
    </div>

    <!-- PANTALLA DE CUENTA REGRESIVA -->
    <div id="countdown-screen" class="overlay hidden">
        <div id="countdown-display" class="countdown-number">5</div>
    </div>

    <!-- MODAL DE INFORMACIÓN -->
    <div id="info-overlay" class="overlay hidden" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 100;">
        <div class="info-modal-content">
            <button class="close-info-btn" onclick="toggleInfo(false)">&times;</button>
            <div class="info-header">
                <h2 class="info-title">${gameDetails.gameName || 'Juego de Acertijos'}</h2>
                <div class="info-subtitle">Actividad configurada desde la plataforma Steam-G</div>
            </div>
            
            <div class="info-details-grid">
                <div class="info-item">
                    <span class="info-label">Versión</span>
                    <span class="info-value">${gameDetails.version || '1.0.0'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Fecha de Creación</span>
                    <span class="info-value">${formattedDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Plataformas</span>
                    <span class="info-value">${platformsString}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dificultad</span>
                    <span class="info-value" style="text-transform: capitalize;">${config.difficulty}</span>
                </div>
                <div class="info-item info-desc">
                    <span class="info-label">Descripción</span>
                    <p class="info-value">${gameDetails.description || 'Sin descripción disponible para este juego.'}</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 1.5rem;">
                <button class="big-btn" style="font-size: 1rem; padding: 0.75rem 2rem;" onclick="toggleInfo(false)">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- PANTALLA FINAL -->
    <div id="end-screen" class="overlay hidden">
        <h1 id="end-title" style="color:var(--secondary); font-size:3rem;">Juego Terminado</h1>
        <h2 style="color:var(--primary); font-size:2rem; margin:1rem 0;">Puntaje Final: <span id="final-score">0</span></h2>
        <div class="end-buttons">
             <button class="big-btn btn-exit" onclick="exitGame()">Finalizar el Juego</button>
             <button class="big-btn btn-retry" onclick="location.reload()">Volver a Jugar</button>
        </div>
    </div>

    <div class="game-layout" id="game-ui" style="display:none;">
        <div class="stats-card card">
            <div class="stat-item"><i data-lucide="timer"></i> <span id="timer">${config.timeLimit}s</span></div>
            <div class="stat-item"><i data-lucide="star"></i> <span id="score">0 pts</span></div>
            <div class="stat-item"><i data-lucide="help-circle"></i> <span id="progress">1/${config.riddles.length}</span></div>
            <hr style="border-top:1px solid #eee; width:100%; margin:1rem 0;">
            <button class="control-btn" onclick="finishGame(false)">Finalizar</button>
        </div>
        <div class="question-card card">
            <div class="topic-badge" id="topic">Tema</div>
            <h2 class="question-text" id="question">Pregunta...</h2>
        </div>
        <div class="answers-column" id="answers-container"></div>
    </div>
    <script>
        const config = ${JSON.stringify(config)};
        ${iconMappingJS}
        let state = { currentIndex: 0, score: 0, timeLeft: config.timeLimit, timer: null, active: false };
        
        function toggleInfo(show) {
            const modal = document.getElementById('info-overlay');
            if(show) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex'; // Forzar flex para centrado
            } else {
                modal.classList.add('hidden');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        }

        function exitGame() {
            window.close();
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;background:#1f2937;color:white;font-family:sans-serif;"><h1>Juego Finalizado</h1><p>Gracias por jugar. Ya puedes cerrar esta pestaña.</p></div>';
        }

        function startGameSequence() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('countdown-screen').classList.remove('hidden');
            let count = 5;
            const countDisplay = document.getElementById('countdown-display');
            countDisplay.innerText = count;
            const countInterval = setInterval(() => {
                count--;
                if(count > 0) {
                    countDisplay.innerText = count;
                    countDisplay.style.animation = 'none';
                    countDisplay.offsetHeight; 
                    countDisplay.style.animation = 'popIn 0.5s ease-out';
                } else {
                    clearInterval(countInterval);
                    document.getElementById('countdown-screen').classList.add('hidden');
                    startGame();
                }
            }, 1000);
        }

        function shuffle(array) { return array.sort(() => Math.random() - 0.5); }
        function getIconName(answer) { return iconMap[answer] || 'help-circle'; }
        function generateOptions(correctAnswer) {
            const allAnswers = Object.keys(iconMap);
            let distractors = [];
            while (distractors.length < 2) {
                const random = allAnswers[Math.floor(Math.random() * allAnswers.length)];
                if (random !== correctAnswer && !distractors.includes(random)) distractors.push(random);
            }
            return shuffle([correctAnswer, ...distractors]);
        }
        function startGame() {
            document.getElementById('game-ui').style.display = 'grid';
            state.active = true; state.score = 0; state.currentIndex = 0;
            loadRiddle();
        }
        function loadRiddle() {
            if (state.currentIndex >= config.riddles.length) return finishGame(true);
            const riddle = config.riddles[state.currentIndex];
            document.getElementById('question').innerText = riddle.pregunta;
            document.getElementById('topic').innerText = riddle.tema;
            document.getElementById('progress').innerText = (state.currentIndex + 1) + '/' + config.riddles.length;
            const options = riddle.opciones ? shuffle(riddle.opciones) : generateOptions(riddle.respuesta);
            const container = document.getElementById('answers-container');
            container.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button'); btn.className = 'answer-btn';
                const iconName = getIconName(opt);
                btn.innerHTML = '<i data-lucide="' + iconName + '" class="icon-large"></i><span class="answer-label">' + opt + '</span>';
                btn.onclick = () => handleAnswer(opt);
                container.appendChild(btn);
            });
            lucide.createIcons();
            clearInterval(state.timer);
            state.timeLeft = config.timeLimit;
            document.getElementById('timer').innerText = state.timeLeft + 's';
            state.timer = setInterval(() => {
                state.timeLeft--;
                document.getElementById('timer').innerText = state.timeLeft + 's';
                if (state.timeLeft <= 0) {
                    clearInterval(state.timer);
                    Swal.fire({ title: '¡Tiempo agotado!', icon: 'warning', confirmButtonText: 'Siguiente' }).then(() => { state.currentIndex++; loadRiddle(); });
                }
            }, 1000);
        }
        function handleAnswer(selected) {
            clearInterval(state.timer);
            const currentRiddle = config.riddles[state.currentIndex];
            const isCorrect = selected === currentRiddle.respuesta;
            if (isCorrect) {
                state.score += 10;
                document.getElementById('score').innerText = state.score + ' pts';
                Swal.fire({ title: '¡Correcto!', icon: 'success', timer: 1000, showConfirmButton: false }).then(() => next());
            } else {
                Swal.fire({ title: 'Incorrecto', html: 'La respuesta correcta era: <b>' + currentRiddle.respuesta + '</b>', icon: 'error', confirmButtonText: 'Continuar' }).then(() => next());
            }
        }
        function next() { state.currentIndex++; loadRiddle(); }
        function finishGame(completed) {
            clearInterval(state.timer); state.active = false;
            document.getElementById('game-ui').style.display = 'none';
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('final-score').innerText = state.score;
            document.getElementById('end-title').innerText = completed ? "¡Juego Completado!" : "Fin del Juego";
        }
        lucide.createIcons();
    </script>
</body>
</html>`;
};

// --- COMPONENTE SUMMARY (INTEGRADO Y MEJORADO) ---
const Summary = ({ config, onBack }) => {
    // Nuevos estados para controlar la descarga inline
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Iniciando...");
    // Estado para verificar si JSZip está listo
    const [jsZipReady, setJsZipReady] = useState(false);

    // Estados para Android
    const [isGeneratingAndroid, setIsGeneratingAndroid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const location = useLocation();
    // const navigate = useNavigate(); // Deshabilitado para mantener todo en una vista
    const state = location.state;

    // --- DATOS DE RESPALDO PARA PREVIEW ---
    const MOCK_DATA = {
        selectedAreas: ['Ciencia', 'Lógica'],
        selectedSkills: ['Razonamiento Deductivo', 'Memoria', 'Atención al Detalle'],
        gameDetails: {
          gameName: "Juego de Acertijos",
          description: "Desafío mental con preguntas de lógica, ciencia y geometría.",
          version: "1.0.0",
          date: getCurrentDateString(),
        },
        selectedPlatforms: ['web', 'mobile']
    };

    const { 
        selectedAreas = MOCK_DATA.selectedAreas, 
        selectedSkills = MOCK_DATA.selectedSkills, 
        gameDetails = MOCK_DATA.gameDetails, 
        selectedPlatforms = MOCK_DATA.selectedPlatforms
    } = state || MOCK_DATA;

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
            setStatusText("Error cargando librería ZIP");
        };
        document.body.appendChild(script);

        return () => {
            if(document.body.contains(script)){
                document.body.removeChild(script);
            }
        }
    }, []);
   
    // Función modificada para manejar la descarga en pantalla (sin modal)
    const handleDownloadZip = () => {
        if (isGenerating || !jsZipReady) return; 

        setIsGenerating(true);
        setProgress(0);
        setStatusText("Iniciando...");

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 2; 
            
            if (currentProgress >= 90) {
                clearInterval(interval);
                setStatusText("Procesando recursos...");
                generateAndDownloadZip();
            } else {
                if (currentProgress > 20 && currentProgress < 50) setStatusText("Generando código HTML...");
                if (currentProgress >= 50 && currentProgress < 80) setStatusText("Incrustando imágenes...");
                setProgress(currentProgress);
            }
        }, 200); 
    };

    const generateAndDownloadZip = async () => {
        if (!window.JSZip) {
            alert("La librería ZIP aún no está lista. Por favor intente de nuevo en unos segundos.");
            setIsGenerating(false);
            return;
        }

        try {
            const zip = new window.JSZip();
            setStatusText("Finalizando HTML...");
            
            // Usamos el generador de código de Acertijo, pasando los detalles
            const htmlContent = generateGameCode(config, gameDetails, selectedPlatforms);
            
            // AQUI SE CAMBIA EL NOMBRE DEL ARCHIVO HTML
            zip.file("Acertijos.html", htmlContent);
            
            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `juego-acertijos-${config.difficulty}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setProgress(100);
            setStatusText("¡Descarga iniciada!");
            setTimeout(() => {
                setIsGenerating(false);
                setProgress(0);
            }, 2000);

        } catch (error) {
            console.error("Error generando el ZIP:", error);
            setStatusText("Error al generar el archivo.");
            setIsGenerating(false);
        }
    };

    // --- FUNCIÓN PARA GENERAR ANDROID ZIP CON CONFIGURACIÓN ---
    const generarAndroidZipConConfig = async () => {
        try {
            if (!window.JSZip) {
                throw new Error('La librería JSZip aún no está cargada. Por favor, intenta de nuevo en unos segundos.');
            }

            setErrorMsg('');
            setIsGeneratingAndroid(true);

            const baseZipUrl = '/templates/acertijos/android-base.zip';
            const configPath = 'android/app/src/main/assets/public/config/acertijos-config.json';

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

            // Mapear la dificultad
            const nivelMap = {
                'Básico': 'basico',
                'Intermedio': 'intermedio',
                'Avanzado': 'avanzado',
            };

            // Construir el JSON de configuración
            const configData = {
                nivel: nivelMap[config.difficulty] || 'medio',
                tiempoLimite: config.timeLimit || 60,
                categoria: 'general',
                acertijos: Array.isArray(config.riddles)
                    ? config.riddles.map((r) => ({
                        id: r.id,
                        tema: r.tema,
                        pregunta: r.pregunta,
                        respuesta: r.respuesta,
                        opciones: r.opciones || []
                    }))
                    : [],
                nombreApp: gameDetails?.gameName || 'Juego de Acertijos',
                version: gameDetails?.version || '1.0.0',
                descripcion: gameDetails?.description || '',
                fecha: getCurrentDateString(),
                plataformas: Array.isArray(selectedPlatforms)
                    ? selectedPlatforms
                    : ['android'],
            };

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
            const nombreArchivo = `android-acertijo-${configData.nivel || 'juego'}.zip`
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

    return (
        <div className="summary-screen">
            <style>{summaryStyles}</style>

            <h2 style={{color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <CheckCircle size={32} color="#22c55e" /> ¡Configuración Exitosa!
            </h2>
            <p className="rules-text">Tu juego ha sido configurado correctamente. Revisa los detalles y descárgalo.</p>
            
            <h1 className="selection-title" style={{ textAlign: 'center', color: '#0077b6', marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>
                Resumen de la Configuración
            </h1>
                                  
            <div className="summary-details" style={{maxWidth: '800px', margin: '0 auto'}}>
                <div className="info-grid">
                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Tag size={16} /> Nombre del Juego</div>
                        <div className="info-card-value">{gameDetails.gameName || 'No disponible'}</div>
                    </div>

                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Layers size={16} /> Versión</div>
                        <div className="info-card-value">{gameDetails.version || '1.0.0'}</div>
                    </div>

                    <div className="info-card full-width" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><FileText size={16} /> Descripción</div>
                        <div className="info-card-value" style={{fontSize: '1rem', lineHeight: '1.5'}}>
                            {gameDetails.description || 'Sin descripción.'}
                        </div>
                    </div>

                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Calendar size={16} /> Fecha de Creación</div>
                        <div className="info-card-value">{formatDate(getCurrentDateString())}</div>
                    </div>

                    <div className="info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="info-card-header" style={{ justifyContent: 'center', width: '100%' }}><Monitor size={16} /> Plataformas</div>
                        <div className="info-card-value">
                            {selectedPlatforms?.length > 0 
                                ? selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
                                : 'No seleccionadas'}
                        </div>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />

                {/* --- AQUI SE APLICA LA ESTRUCTURA DE DOS COLUMNAS COMO EN SUMMARY --- */}
                {/* Modificado para asegurar 2 columnas horizontales */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div className="info-card" style={{borderLeft: '4px solid #3b82f6'}}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                            <Shapes size={20} color="#3b82f6"/> Áreas Seleccionadas
                        </h4>
                        {selectedAreas?.length > 0 ? (
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
                                {selectedAreas.map(areaId => (
                                    <span key={areaId} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                        padding: '0.5rem 0.75rem', background: '#eff6ff', 
                                        borderRadius: '0.5rem', fontSize: '0.95rem', color: '#1e40af' 
                                    }}>
                                        <img 
                                            src={getAreaIcon(areaId)} 
                                            alt=""
                                            style={{ width: '20px', height: '20px', borderRadius:'4px' }}
                                        />
                                        {getAreaName(areaId)}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No hay áreas seleccionadas.</p>
                        )}
                    </div>

                    <div className="info-card" style={{borderLeft: '4px solid #8b5cf6'}}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#0077b6' }}>
                            <Puzzle size={20} color="#8b5cf6"/> Habilidades Seleccionadas
                        </h4>
                        {selectedSkills?.length > 0 ? (
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155' }}>
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

            <div className="summary-card" style={{marginTop: '2.5rem'}}>
                <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#0077b6'}}>
                    Parámetros del Juego
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    
                    {/* MODIFICADO: Se cambió justifyContent de 'space-between' a 'flex-start' y se agregó gap */}
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b', whiteSpace: 'nowrap'}}><Type size={18}/> Dificultad:</span>
                        <strong style={{fontSize: '1.1rem',color: '#0077b6'}}>{config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1).toLowerCase()}</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b', whiteSpace: 'nowrap'}}><Clock size={18}/> Tiempo Límite:</span>
                        {/* CAMBIO REALIZADO: 'segundos' abreviado a 's' para evitar salto de línea */}
                        <strong style={{fontSize: '1.1rem', color: '#0077b6'}}>{config.timeLimit} seg.</strong>
                    </div>
                    <div className="summary-row" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px'}}>
                        <span style={{display:'flex', gap:'8px', alignItems:'center', color: '#64748b', whiteSpace: 'nowrap'}}><List size={18}/> Total Acertijos:</span>
                        <strong style={{fontSize: '1.1rem', color: '#0077b6'}}>{config.riddles.length}</strong>
                    </div>
                </div>
                
                <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9'}}>
                    <strong style={{display:'block', marginBottom:'0.75rem', color: '#334155'}}>Acertijos incluidos en el paquete:</strong>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {config.riddles.map(r => (
                            <span key={r.id} style={{
                                background:'white', padding:'6px 12px', 
                                borderRadius:'20px', fontSize:'0.9rem', border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#475569'
                            }}>
                                {r.tema}: <b>{r.respuesta}</b>
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- Botón "Volver a Editar" --- */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={onBack} disabled={isGenerating} style={{opacity: isGenerating ? 0.6 : 1, display:'flex', alignItems:'center', gap:'0.5rem'}}>
                        <ArrowLeft size={18} /> Volver a Editar
                    </button>
                </div>
            </div>

            <div className="download-section" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0'}}>
                
                <div style={{width: '100%', maxWidth: '600px', textAlign: 'center'}}>
                    <h3 style={{color: '#0077b6', marginBottom: '0.5rem'}}>Descargar Paquete del Juego</h3>
                    <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
                        Genera el archivo .zip listo para ser descargado en su computadora.
                    </p>

                    {/* Barra de Progreso Integrada */}
                    {isGenerating && (
                        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>
                                <span>{statusText}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="progress-container1" style={{ 
                                width: '100%', 
                                height: '14px', 
                                backgroundColor: '#e2e8f0', 
                                borderRadius: '7px', 
                                overflow: 'hidden',
                                marginTop: '0.5rem',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <div 
                                    className="progreso-barra" 
                                    style={{ 
                                        width: `${progress}%`, 
                                        height: '100%', 
                                        backgroundColor: '#005f92', // Usar color sólido explícito
                                        transition: 'width 0.3s ease-out',
                                        borderRadius: '7px'
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Indicador de generación Android */}
                {isGeneratingAndroid && (
                    <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe'}}>
                        <p style={{color: '#1e40af', margin: 0, fontWeight: '500'}}>
                            ⏳ Generando paquete Android... La descarga iniciará automáticamente.
                        </p>
                    </div>
                )}

                {/* Mensaje de error */}
                {errorMsg && (
                    <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fecaca'}} role="alert">
                        <p style={{color: '#991b1b', margin: 0, fontWeight: '500'}}>
                            ❌ Error: {errorMsg}
                        </p>
                    </div>
                )}

                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {/* Botón Web (HTML) */}
                    <button
                        className="btn-primary btn-success"
                        onClick={handleDownloadZip}
                        disabled={isGenerating || !jsZipReady || isGeneratingAndroid}
                        style={{
                            display:'flex', alignItems:'center', gap:'0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(40, 165, 238, 0.39)',
                            minWidth: '200px', justifyContent: 'center',
                            cursor: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 'wait' : 'pointer',
                            opacity: (isGenerating || !jsZipReady || isGeneratingAndroid) ? 0.8 : 1
                        }}
                    >
                        {(isGenerating || !jsZipReady) ? (
                           <>{!jsZipReady ? "Cargando librería..." : "Generando..."}</>
                        ) : (
                           <><Globe size={18} /> Web (HTML)</>
                        )}
                    </button>

                    {/* Botón Android */}
                    <button
                        className="btn-primary"
                        onClick={generarAndroidZipConConfig}
                        disabled={isGeneratingAndroid || !jsZipReady || isGenerating}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#3ddc84',
                            boxShadow: '0 4px 14px 0 rgba(61, 220, 132, 0.39)',
                            minWidth: '200px',
                            justifyContent: 'center',
                            cursor: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 'wait' : 'pointer',
                            opacity: (isGeneratingAndroid || !jsZipReady || isGenerating) ? 0.8 : 1
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

                <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', textAlign: 'center'}}>
                    <strong>Web:</strong> Archivo HTML listo para abrir en navegador.
                    {' '}<strong>Android:</strong> Proyecto React Native listo para compilar en Android Studio.
                </p>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL (ACERTIJO) ---
export default function Acertijo() {
    const [view, setView] = useState('home'); // 'home', 'game', 'summary'
    const [level, setLevel] = useState('Básico');
    const [selectedRiddles, setSelectedRiddles] = useState([]);
    const navigate = useNavigate(); // Hook para navegación
    const location = useLocation(); // 
    
    // Configuración de niveles actualizada
    const levelConfig = { 
        'Básico': { limit: 3, time: 10 }, 
        'Intermedio': { limit: 4, time: 20 }, 
        'Avanzado': { limit: 5, time: 30 } 
    };
    
    // Estados del Juego
    const [gameRiddles, setGameRiddles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [options, setOptions] = useState([]);
    const timerRef = useRef(null);

    // Inyectar SweetAlert
    useEffect(() => {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        s.async = true;
        document.body.appendChild(s);
    }, []);

    // NUEVO: Scroll al inicio al cargar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]); // Se ejecuta al cambiar de vista también

    // Reiniciar selección al cambiar nivel
    useEffect(() => {
        setSelectedRiddles([]);
    }, [level]);

    // Lógica del Timer
    useEffect(() => {
        if (view === 'game' && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (view === 'game' && timeLeft === 0) {
            clearInterval(timerRef.current);
            window.Swal?.fire({ title: '¡Tiempo Agotado!', icon: 'warning', confirmButtonText: 'Siguiente' }).then(() => nextRiddle(score));
        }
        return () => clearInterval(timerRef.current);
    }, [view, timeLeft]);

    // --- MANEJADORES ---
    
    const handleLevelChange = (e) => {
        setLevel(e.target.value);
    };

    const handleResetSelection = () => {
        setSelectedRiddles([]);
    };

    const handleRiddleToggle = (riddle) => {
        const config = levelConfig[level];
        if (selectedRiddles.some(r => r.id === riddle.id)) {
            setSelectedRiddles(selectedRiddles.filter(r => r.id !== riddle.id));
        } else if (selectedRiddles.length < config.limit) {
            setSelectedRiddles([...selectedRiddles, riddle]);
        }
    };

    const startGame = () => {
        const config = levelConfig[level];
        const shuffled = [...selectedRiddles].sort(() => Math.random() - 0.5);
        setGameRiddles(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setTimeLeft(config.time); // Usar tiempo específico del nivel
        
        if (shuffled.length > 0) {
            const r = shuffled[0];
            setOptions(r.opciones ? [...r.opciones].sort(() => Math.random() - 0.5) : [r.respuesta, "Opción X", "Opción Y"]);
        }
        
        setView('game');
    };

    const handleAnswer = (ans) => {
        clearInterval(timerRef.current);
        const correct = gameRiddles[currentIndex].respuesta;
        if (ans === correct) {
            const newScore = score + 10;
            setScore(newScore);
            window.Swal?.fire({ icon: 'success', title: '¡Correcto!', timer: 1000, showConfirmButton: false }).then(() => nextRiddle(newScore));
        } else {
            window.Swal?.fire({ icon: 'error', title: 'Incorrecto', text: `Era: ${correct}` }).then(() => nextRiddle(score));
        }
    };

    const nextRiddle = (currentScore) => {
        const config = levelConfig[level];
        const next = currentIndex + 1;
        if (next < gameRiddles.length) {
            setCurrentIndex(next);
            const r = gameRiddles[next];
            setOptions(r.opciones ? [...r.opciones].sort(() => Math.random() - 0.5) : [r.respuesta, "Opción X", "Opción Y"]);
            setTimeLeft(config.time); // Reiniciar timer con tiempo específico del nivel
        } else {
            finishGame(currentScore);
        }
    };

    const finishGame = (finalScore) => {
        window.Swal?.fire({ title: 'Juego Terminado', text: `Puntaje: ${finalScore}`, icon: 'info' }).then(() => setView('home'));
    };

     const goToSummary = () => {
    setView('summary');
    // Actualizar la URL para que el ProgressBar muestre 100% PERO manteniendo el state
    navigate('/settings?view=summary', { 
        replace: true,
        state: location.state // Pasar el state que ya existía
    });
};

    // --- RENDERIZADO PRINCIPAL ---
    const currentConfig = levelConfig[level];

    return (
        <main className="main-container">
            <GlobalStyles />

            {/* VISTA: RESUMEN */}
            {view === 'summary' && (
                <Summary 
                    config={{ difficulty: level, timeLimit: currentConfig.time, riddles: selectedRiddles}}
                    onBack={() => setView('home')} 
                />
            )}

            {/* VISTA: JUEGO */}
            {view === 'game' && (
                <div className="game-layout">
                    <div className="card" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                        <div style={{fontWeight:'bold', color:'var(--primary-blue)'}}><Timer size={20}/> {timeLeft}s</div>
                        <div style={{fontWeight:'bold', color:'#e6aa00'}}><Star size={20}/> {score} pts</div>
                        <div><HelpCircle size={20}/> {currentIndex + 1}/{gameRiddles.length}</div>
                        <hr style={{width:'100%', borderTop:'1px solid #eee'}}/>
                        <button className="control-btn btn-finish"  onClick={() => finishGame(score)}>Finalizar</button>
                       
                    </div>
                    <div className="question-card">
                        <span className="topic-badge">{gameRiddles[currentIndex]?.tema}</span>
                        <h2 className="question-text">"{gameRiddles[currentIndex]?.pregunta}"</h2>
                    </div>
                    <div style={{display:'grid', gap:'1rem'}}>
                        {options.map((opt, i) => {
                            const Icon = iconMap[opt]?.icon || HelpCircle;
                            return (
                                <button key={i} onClick={() => handleAnswer(opt)} className="answer-btn-modern">
                                    <Icon size={32} color="#0077b6" />
                                    <span style={{fontWeight:600}}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VISTA: INICIO (SELECCIÓN) */}
            {view === 'home' && (
                <div className="level-select-container">
                    <h1 style={{textAlign:'center', color:'var(--dark-blue)', fontSize:'2.5rem', fontWeight:800, marginBottom:'0.5rem'}}>Juego de Acertijos</h1>
                    
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', padding:'0 1rem'}}>
                        <div>
                            <label style={{fontWeight:'bold', display:'block', marginBottom:'0.5rem'}}>Nivel de Dificultad:</label>
                            <select value={level} onChange={handleLevelChange} style={{padding:'0.8rem', borderRadius:'0.5rem', border:'1px solid #ccc', minWidth:'180px'}}>
                                {Object.keys(levelConfig).map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <p style={{color:'var(--primary-blue)', fontWeight:'bold', fontSize:'1.1rem'}}>{selectedRiddles.length} / {currentConfig.limit} Seleccionados</p>
                            <button onClick={handleResetSelection} style={{background:'none', border:'none', color:'var(--danger-red)', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem', marginLeft:'auto'}}>
                                <RotateCcw size={16}/> Reiniciar
                            </button>
                        </div>
                    </div>

                    <div className="custom-scrollbar" style={{flexGrow:1, overflowY:'auto', padding:'0.5rem'}}>
                        <div className="riddle-grid-compact">
                            {ACERTIJOS_POR_NIVEL[level.toLowerCase()]?.map(r => {
                                const isSelected = selectedRiddles.some(sel => sel.id === r.id);
                                return (
                                    <button key={r.id} onClick={() => handleRiddleToggle(r)} className={`acertijo-select-btn ${isSelected ? 'selected' : ''}`}>
                                        <div style={{marginTop:2}}>{isSelected ? <Trophy size={18} color="var(--primary-blue)"/> : <HelpCircle size={18} color="#ccc"/>}</div>
                                        <div style={{overflow:'hidden'}}>
                                            <div style={{fontSize:'0.75rem', fontWeight:'800', color:'var(--gray-secondary)', textTransform:'uppercase'}}>{r.tema}</div>
                                            <div style={{fontSize:'0.9rem', color:'var(--dark-gray)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.pregunta}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* BOTONES MODIFICADOS: CENTRADOS, CON MISMA CLASE Y COLOR AZUL */}
                    <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem', padding:'0 1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="nav-action-btn"
                        >
                            <ArrowLeft size={20}/> Anterior
                        </button>
                        
                        <button 
                            onClick={startGame} 
                            disabled={selectedRiddles.length !== currentConfig.limit} 
                            className="nav-action-btn"
                        >
                            Vista Previa
                        </button>
                        
                        <button 
                            onClick={goToSummary} 
                            disabled={selectedRiddles.length !== currentConfig.limit} 
                            className="nav-action-btn"
                            style={{
                                // Se usa el color primario (azul) en lugar del verde
                                backgroundColor: selectedRiddles.length !== currentConfig.limit ? 'var(--gray-secondary)' : 'var(--primary-blue)',
                            }}
                        >
                            <CheckCircle/> Terminar Configuración
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}