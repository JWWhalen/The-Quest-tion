import React, { useState } from 'react';
import kirkImg from './assets/kirk.png';
import kyleImg from './assets/kyle.png';
import ryangImg from './assets/ryang.png';
import ryankImg from './assets/ryank.png';
import stephenImg from './assets/stephen.png';
import travisImg from './assets/travis.png';

function StartScreen({ onStart }) {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const characters = [
    { name: 'Ryan Guinchard', img: ryangImg },
    { name: 'Ryan King', img: ryankImg },
    { name: 'Travis Whalen', img: travisImg },
    { name: 'Stephen Lahey', img: stephenImg },
    { name: 'Kyle Leights', img: kyleImg },
    { name: 'Kirk Leights', img: kirkImg },
  ];

  const handleStart = () => {
    if (selectedPlayer) {
      onStart(selectedPlayer);
    } else {
      alert('Please select a character.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '0 20px' }}>
      <h1>Select Your Character</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {characters.map((character) => (
          <div
            key={character.name}
            onClick={() => setSelectedPlayer(character.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              cursor: 'pointer',
              border: selectedPlayer === character.name ? '2px solid blue' : '2px solid transparent',
              borderRadius: '10px',
              padding: '5px'
            }}
          >
            <img
              src={character.img}
              alt={character.name}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
                imageRendering: 'pixelated',  // Ensures sharp pixel art
              }}
            />
            <span>{character.name}</span>
          </div>
        ))}
      </div>
      
      {/* Instructions Section */}
      <div style={{ textAlign: 'left', marginTop: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <h3>Controls:</h3>
        <p>Arrow Keys: Move</p>
        <p>Hold the Spacebar to pull out your arrow,</p>
        <p>While holding spacebar, use arrow key to fire in that direction.</p>
        <p>You can push the blocks.</p>
        <p>____________________________________________________________________</p>
        <p>Collect all items and defeat all enemies to open the treasure chest!</p>
      </div>

      <button onClick={handleStart} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Start Quest
      </button>
    </div>
  );
}

export default StartScreen;
