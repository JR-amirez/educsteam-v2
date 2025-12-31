import React from 'react';
// Asegúrate de tener react-router-dom instalado: npm install react-router-dom
import { NavLink, useLocation } from 'react-router-dom';

// Asumiendo que importas los iconos de react-icons
import { GiVrHeadset, GiPlatform } from 'react-icons/gi';
import { FaHome, FaReact, FaDownload } from 'react-icons/fa';
import { IoCreateOutline } from 'react-icons/io5';
import { LuSquareActivity } from 'react-icons/lu';
import { SiUbisoft } from 'react-icons/si';

const Sidebar = () => {
  // 2. Obtenemos la ubicación actual para leer los query params (?view=...)
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title"><GiVrHeadset /> STEAM-G</div>
      </div>
      
      <nav>
        {/*
          MODIFICADO: Ahora, la clase de cada NavLink se determina por su estado.
          Si está activo ('isActive'), se le pone la clase 'active'.
          Si no lo está, se le pone la clase 'disabled' para bloquearlo.
        */}
        <ul className="menu">
        
          <li>
            <NavLink 
              to="/WelcomeScreen" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <FaHome />  Inicio
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/areas" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <FaReact />  Áreas STEAM
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/skills" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <IoCreateOutline />  Habilidades STEAM
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/activities" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <LuSquareActivity />  Actividades STEAM
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/platform" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <GiPlatform />  Plataforma
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/TecnologiaRa"   
              className="menu-item disabled" // Este se mantiene permanentemente deshabilitado
            >
              <IoCreateOutline />  Tecnologia RA
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/TipoContenido" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <IoCreateOutline />  Tipo de Contenido
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/Ra" 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : 'disabled'}`}
            >
              <IoCreateOutline />  Biblioteca RA
            </NavLink>
          </li>
          {/* BOTÓN 1: Configuración App */}
          <li>
            <NavLink 
              to="/settings" 
              end // El 'end' ayuda a que no coincida con subrutas como /settings/otro
              className={({ isActive }) => {
                // LÓGICA CORREGIDA:
                // Solo activamos si isActive es true Y ADEMÁS NO estamos en la vista de resumen
                const isSummaryView = location.search.includes('view=summary');
                return `menu-item ${isActive && !isSummaryView ? 'active' : 'disabled'}`;
              }}
            >
              <SiUbisoft />  Configuración App
            </NavLink>
          </li>

          {/* BOTÓN 2: Resumen y Descarga */}
          <li>
            <NavLink 
              to="/settings?view=summary" 
              className={() => {
                // LÓGICA CORREGIDA:
                // Verificamos manualmente si la ruta base es settings Y si el search es exactamente el que buscamos
                const isSummaryActive = location.pathname === '/settings' && location.search === '?view=summary';
                return `menu-item ${isSummaryActive ? 'active' : 'disabled'}`;
              }}
            >
              <FaDownload />  Resumen y Descarga
            </NavLink>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
