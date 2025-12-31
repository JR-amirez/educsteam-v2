import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationButtons from './NavigationButtons';
import GameViewer from './GameViewer';
import '../styles/theme.css';
import '../styles/screens.css';

const AppSettings = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedGame, selectedPlatforms, gameDetails } = state || {};

  useEffect(() => {
    console.log('Selected Platforms:', selectedPlatforms);
  }, [selectedPlatforms]);

  if (!selectedGame || !gameDetails) {
    return (
      <div className="screen-container">
        <div className="selection-container" style={{textAlign: 'center'}}>
          <h2 className="selection-title">Datos no disponibles</h2>
          <p className="selection-instruction">
            Por favor, completa el formulario anterior primero.
          </p>
          <button className="no-rounded-button" onClick={() => navigate(-1)} style={{margin: 'auto'}}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!selectedGame || !selectedPlatforms || selectedPlatforms.length === 0) {
    return (
      <div className="screen-container">
        <div className="selection-container">
          <h2 className="selection-title">Configuración no disponible</h2>
          <p className="selection-instruction">
            Completa la selección de plataforma primero
          </p>
          <NavigationButtons 
            onBack={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
        <div
          className={`tab-panel active`}
        >
          {/* {platform === 'web' ? ( */}
            <div className="web-config">
              <div className="game-preview">
                <GameViewer gameId={selectedGame.id} platforms={selectedPlatforms} />
              </div>
            </div>
          {/* ) : (
            <div className="mobile-config">
              <h3>Configuración {platform === 'ios' ? 'iOS' : 'Android'}</h3>
              <MobileConfigForm
                platform={platform}
                config={platformConfigs[platform] || {}}
                onChange={(config) => updatePlatformConfig(platform, config)}
              />
            </div>
          )} */}
        </div>
    
      
    </div>
  );
};

export default AppSettings;