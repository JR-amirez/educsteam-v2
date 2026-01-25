import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tipoContenido } from '../data/steamData';
import { IoArrowBackSharp } from "react-icons/io5";
import { GrLinkNext } from "react-icons/gr";
import { FiUpload } from "react-icons/fi";
import { Player } from '@lottiefiles/react-lottie-player';

import '../styles/theme.css';
import '../styles/screens.css';

const TipoContenido = () => {
  const [selectedContenido, setSelectedContenido] = useState([]);
  const [contenidoPersonalizado, setContenidoPersonalizado] = useState({});
  const fileInputRefs = useRef({});
  const navigate = useNavigate();

  const toggleContenido = (ContenidoId) => {
    setSelectedContenido(prev =>
      prev.includes(ContenidoId)
        ? prev.filter(id => id !== ContenidoId)
        : [...prev, ContenidoId]
    );
  };

  const handleTextoChange = (id, value) => {
    setContenidoPersonalizado(prev => ({
      ...prev,
      [id]: { tipo: 'texto', contenido: value }
    }));
  };

  const handleFileChange = (id, file, tipo) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContenidoPersonalizado(prev => ({
          ...prev,
          [id]: {
            tipo: tipo,
            contenido: e.target.result,
            nombreArchivo: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getAcceptedFileTypes = (tipo) => {
    switch (tipo) {
      case 'imagen': return 'image/*';
      case 'video': return 'video/*';
      case 'audio': return 'audio/*';
      default: return '*/*';
    }
  };

  return (
    <div className="screen-container">
      <div className="selection-container">
        <h2 className="selection-title">Selecciona el tipo de contenido para incluir en la Tecnología RA</h2>
        <p className="selection-instruction">
          Puedes seleccionar una o varios de tipo de contenido RA que desee
        </p>
        
        <div className="areas-grid">
          {Object.entries(tipoContenido).map(([id, contenido]) => (
            <div
              key={id}
              className={`area-card ${selectedContenido.includes(id) ? 'selected' : ''}`}
            >
              <div
                className="area-card-header"
                onClick={() => toggleContenido(id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="area-icon-container">
                  <Player
                    src={contenido.icon}
                    className="player"
                    alt={`Icono ${contenido.name}`}
                    loop
                    autoplay
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>
                <h3 className="area-name">{contenido.name}</h3>
                <p className="area-description">{contenido.description}</p>
              </div>

              {selectedContenido.includes(id) && (
                <div className="contenido-personalizado" onClick={(e) => e.stopPropagation()}>
                  {id === 'texto' ? (
                    <textarea
                      placeholder="Escribe tu mensaje aquí..."
                      value={contenidoPersonalizado[id]?.contenido || ''}
                      onChange={(e) => handleTextoChange(id, e.target.value)}
                      className="texto-input"
                      rows={4}
                    />
                  ) : (
                    <div className="file-upload-container">
                      <input
                        type="file"
                        ref={(el) => fileInputRefs.current[id] = el}
                        accept={getAcceptedFileTypes(id)}
                        onChange={(e) => handleFileChange(id, e.target.files[0], id)}
                        style={{ display: 'none' }}
                      />
                      <button
                        className="upload-button"
                        onClick={() => fileInputRefs.current[id]?.click()}
                      >
                        <FiUpload /> Cargar {contenido.name}
                      </button>
                      {contenidoPersonalizado[id]?.nombreArchivo && (
                        <p className="file-name">
                          {contenidoPersonalizado[id].nombreArchivo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="action-buttons">
          <button
             className="no-rounded-button"
            onClick={() => navigate(-1)}
          ><IoArrowBackSharp />


            Anterior
          </button>
          <button
            className="no-rounded-button"
            disabled={selectedContenido.length === 0}
            onClick={() => navigate('/Ra', { state: { selectedContenido, contenidoPersonalizado } })}
          >
            Siguiente <GrLinkNext />



          </button>
        </div>
      </div>
    </div>
  );
};

export default TipoContenido;