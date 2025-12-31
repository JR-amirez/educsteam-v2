import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationButtons from './NavigationButtons';
import GameViewer from './GameViewer';
import '../styles/theme.css';
import '../styles/screens.css';

const AppSettings = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedGame, selectedPlatforms, gameDetails, selectedAreas, selectedSkills } = state || {};
  const [activeTab, setActiveTab] = useState(0);
  const [platformConfigs, setPlatformConfigs] = useState({});
  const [isFinishButtonDisabled, setIsFinishButtonDisabled] = useState(true);

  useEffect(() => {
    console.log('Selected Platforms:', selectedPlatforms);
  }, [selectedPlatforms]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsFinishButtonDisabled(false);
    }, 9000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleFinishConfiguration = () => {
    // CAMBIO AQUÍ: Agregar el parámetro ?view=summary para que el ProgressBar llegue al 100%
    navigate('/settings?view=Summary', {
      state: {
        selectedAreas,
        selectedSkills,
        selectedGame,
        selectedPlatforms,
        gameDetails,
        platformConfigs
      }
    });
  };

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

  const updatePlatformConfig = (platform, config) => {
    setPlatformConfigs(prev => ({
      ...prev,
      [platform]: config
    }));
  };

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
              <h3></h3>
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

const MobileConfigForm = ({ platform, config, onChange }) => {
  const [fileName, setFileName] = useState(config.fileName || '');
  const [version, setVersion] = useState(config.version || '1.0.0');
  const [author, setAuthor] = useState(config.author || '');

  const handleChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    onChange(newConfig);
    
    if (field === 'fileName') setFileName(value);
    if (field === 'version') setVersion(value);
    if (field === 'author') setAuthor(value);
  };

  return (
    <div className="customization-form">
      <div className="form-group">
        <label>Nombre del archivo:</label>
        <input 
          type="text" 
          value={fileName}
          onChange={(e) => handleChange('fileName', e.target.value)}
          className="form-input"
          placeholder="Ingresa el nombre del archivo"
        />
      </div>
      <div className="form-group">
        <label>Versión:</label>
        <input 
          type="text" 
          value={version}
          onChange={(e) => handleChange('version', e.target.value)}
          className="form-input"
          placeholder="Ej: 1.0.0"
        />
      </div>
      <div className="form-group">
        <label>Autor:</label>
        <input 
          type="text" 
          value={author}
          onChange={(e) => handleChange('author', e.target.value)}
          className="form-input"
          placeholder="Tu nombre o organización"
        />
      </div>
    </div>
  );
};

export default AppSettings;