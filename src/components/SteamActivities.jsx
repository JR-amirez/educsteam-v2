import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { steamAreas, steamGames } from '../data/steamData';
import { IoArrowBackSharp, IoCloseSharp } from "react-icons/io5";
import { GrLinkNext } from "react-icons/gr";
import { Player } from '@lottiefiles/react-lottie-player';

import '../styles/theme.css';
import '../styles/screens.css';
import '../styles/game-card-hover.css';

const SteamActivities = () => {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showRAModal, setShowRAModal] = useState(false);

  const handleCloseRAModal = () => setShowRAModal(false);

  // Lista de juegos que soportan tecnología RA
  const gamesWithRA = ['CalculoMental', 'desarrollo-algoritmos', 'Blockly'];

  // Efecto para prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (showRAModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showRAModal]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    
    const container = document.querySelector('.screen-container');
    if (container) {
      container.scrollTop = 0;
    }
    
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        if (container) container.scrollTop = 0;
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const filterGames = () => {
      if (!state?.selectedSkills || !state?.selectedAreas) return;
      
      // Mapa para almacenar juegos únicos por ID
      const uniqueGamesMap = new Map();
      
      state.selectedAreas.forEach(areaId => {
        const areaGames = steamGames[areaId] || {};
        
        Object.entries(areaGames).forEach(([gameId, game]) => {
          // Verificar si el juego tiene al menos una habilidad seleccionada
          const hasSelectedSkill = game.skills.some(skill => 
            state.selectedSkills.includes(skill)
          );
          
          if (hasSelectedSkill) {
            // Si el juego ya existe en el mapa, agregamos el área adicional
            if (uniqueGamesMap.has(gameId)) {
              const existingGame = uniqueGamesMap.get(gameId);
              // Agregar área solo si no está ya en el array
              if (!existingGame.areas.includes(areaId)) {
                existingGame.areas.push(areaId);
                existingGame.areaNames.push(steamAreas[areaId].name);
              }
            } else {
              // Primera vez que vemos este juego, lo agregamos al mapa
              uniqueGamesMap.set(gameId, {
                ...game,
                id: gameId,
                areas: [areaId], // Array de áreas donde aparece
                areaNames: [steamAreas[areaId].name], // Nombres de las áreas
                primaryArea: steamAreas[areaId].name, // Primera área encontrada
                primaryAreaId: areaId
              });
            }
          }
        });
      });

      // Convertir el mapa a array
      const uniqueGamesArray = Array.from(uniqueGamesMap.values());
      
      setFilteredGames(uniqueGamesArray);
    };

    filterGames();
  }, [state]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleConfigureActivity = () => {
    if (selectedGame) {
      // Verificar si el juego seleccionado tiene tecnología RA
      if (gamesWithRA.includes(selectedGame.id)) {
        setShowRAModal(true);
      } else {
        // Si no tiene RA, ir directamente a platform
        navigate('/platform', {
          state: {
            ...state,
            selectedGame: selectedGame
          }
        });
      }
    }
  };

  const handleRAYes = () => {
    setShowRAModal(false);
    navigate('/TecnologiaRa', {
      state: {
        ...state,
        selectedGame: selectedGame 
      }
    });
  };

  const handleRANo = () => {
    setShowRAModal(false);
    console.log(selectedGame);
    navigate('/platform', {
      state: {
        ...state,
        selectedGame: selectedGame
      }
    });
  };

  return (
    <>
      <div className="screen-container">
        <div className="selection-container">
          <h2 className="selection-title">Actividades Disponibles</h2>
       
          {state?.selectedSkills?.length > 0 && (
            <div className="selected-skills-info">
              <p>Habilidades seleccionadas:</p>
              <div className="skills-tags">
                {state.selectedSkills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        
          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map(game => {
                const isSelected = selectedGame?.id === game.id;
              
                return (
                  <div 
                    key={game.id}
                    className={`game-card ${isSelected ? 'selected-card' : ''}`}
                    onClick={() => handleGameSelect(game)}
                    style={{ 
                      border: isSelected ? '3px solid #4A90E2' : '3px solid transparent',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <h4 className="game-title">{game.name}</h4>
                    <div className="area-icon-container">
                      <img
                        src={game.icon}
                        alt={`Icono ${game.name}`}
                        style={{ height: '80px', width: '80px' }}
                      />
                      {game.icon2 && (
                        <Player
                          src={game.icon2}
                          className="player"
                          loop
                          autoplay
                          style={{ height: '90px', width: '90px' }}
                        />
                      )}
                    </div>
                    
                    {/* Mostrar todas las áreas si el juego pertenece a múltiples */}
                    <span className="game-area">
                      {game.areaNames.length > 1 
                        ? `${game.areaNames.join(' / ')}`
                        : game.primaryArea
                      }
                      {game.tecno && ` - ${game.tecno}`}
                    </span>
                
                    <div className="game-skills">
                      <p>Desarrolla:</p>
                      <ul>
                        {game.skills.slice(0, 3).map((s, idx) => (
                          <li key={`${game.id}-skill-${idx}`}>{s}</li>
                        ))}
                        {game.skills.length > 3 && <li>+{game.skills.length - 3} más</li>}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-games-message">
              <p>No se encontraron actividades para las habilidades seleccionadas</p>
              <button 
                className="btn btn-outline"
                onClick={() => navigate(-1)}
              >
                Volver a selección
              </button>
            </div>
          )}
         
          <div className="action-buttons" style={{ gap: '15px' }}>
            <button
              className="no-rounded-button"
              onClick={() => navigate(-1)}
            >
              <IoArrowBackSharp /> Anterior
            </button>
         
            <button
              className="no-rounded-button"
              onClick={handleConfigureActivity}
              disabled={!selectedGame}
              style={{ 
                opacity: !selectedGame ? 0.5 : 1, 
                cursor: !selectedGame ? 'not-allowed' : 'pointer',
                color: 'white'
              }}
            >
              Seleccionar Plataforma <GrLinkNext />
            </button>
          </div>
        </div>
      </div>

      {/* Modal personalizado usando Portal */}
      {showRAModal && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
          onClick={handleCloseRAModal}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                Tecnología de Realidad Aumentada
              </h3>
              <button
                onClick={handleCloseRAModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}
              >
                <IoCloseSharp />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '30px 24px', textAlign: 'center' }}>
              <Player
                src="/images/juegos/VRAR.json" 
                className="player"
                loop
                autoplay
                style={{ 
                  maxWidth: '200px', 
                  height: '200px', 
                  margin: '0 auto 20px' 
                }}
              />
              <p style={{ 
                fontSize: '18px', 
                marginTop: '20px',
                marginBottom: '10px',
                color: '#333'
              }}>
                ¿Deseas integrar <strong>Tecnología de Realidad Aumentada</strong> en esta actividad?
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginTop: '10px',
                lineHeight: '1.5'
              }}>
                La tecnología RA te permitirá agregar elementos interactivos y experiencias inmersivas.
              </p>
            </div>

            {/* Footer */}
            <div style={{ 
              padding: '20px 24px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <button
                onClick={handleRANo}
                style={{
                  padding: '12px 24px',
                  minWidth: '180px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                No, continuar sin RA
              </button>
              <button
                onClick={handleRAYes}
                style={{
                  padding: '12px 24px',
                  minWidth: '180px',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0b5ed7'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0d6efd'}
              >
                Sí, integrar RA
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SteamActivities;