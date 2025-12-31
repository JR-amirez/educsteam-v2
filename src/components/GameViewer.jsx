import { useState, useEffect } from 'react';
import { games } from '../data/gameComponents';

const GameViewer = ({ gameId, platforms }) => {
  const [gameComponent, setGameComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Loading game with ID:', gameId);
    console.log('Platforms:', platforms);

    const loadGame = async () => {
      try {
        if (games[gameId]) {
          setGameComponent(games[gameId]);
        } else {
          console.error(`Game component not found for: ${gameId}`);
        }
      } catch (error) {
        console.error('Error loading game component:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, platforms]);

  if (loading) {
    return (
      <div className="game-loading">
        <p>Cargando juego...</p>
      </div>
    );
  }

  if (!gameComponent) {
    return (
      <div className="game-error">
        <p>No se pudo cargar el juego. Inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      {gameComponent}
    </div>
  );
};

export default GameViewer;