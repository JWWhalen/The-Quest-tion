import React, { useState } from 'react';
import './App.css';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
function App() {
  const [playerName, setPlayerName] = useState('');
  const [showGameScreen, setShowGameScreen] = useState(false);

  const handleStart = (name) => {
    setPlayerName(name);
    setShowGameScreen(true);
  };

  const handleReplay = () => {
    setShowGameScreen(false);
    setTimeout(() => setShowGameScreen(true), 0);
  };

  const handleEnd = () => {
    setShowGameScreen(false);
    // Implement any additional logic when the game ends
  };

  return (
    <div>
      {!showGameScreen ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <GameScreen playerName={playerName} onReplay={handleReplay} onEnd={handleEnd} />
      )}
    </div>
  );
}

export default App;
