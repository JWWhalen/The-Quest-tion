import React, { useEffect, useRef, useState } from 'react';
import arrowImg from './assets/arrow.png';
import arrowDownImg from './assets/arrowdown.png';
import bowTieImg from './assets/bowtie.png';
import chestImg from './assets/chest.png';
import enemyImg1 from './assets/enemy1.png';
import enemyImg2 from './assets/enemy2.png';
import kirkImg from './assets/kirk.png';
import kyleImg from './assets/kyle.png';
import ringImg from './assets/ring.png';
import ryangImg from './assets/ryang.png';
import ryankImg from './assets/ryank.png';
import shoesImg from './assets/shoes.png';
import stephenImg from './assets/stephen.png';
import travisImg from './assets/travis.png';
import wallImg from './assets/wall.png';

const gridSize = 10;

function GameScreen({ playerName, onReplay, onEnd }) {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectedItems, setCollectedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [arrows, setArrows] = useState([]);
  const [facingDirection, setFacingDirection] = useState('right');
  const [aiming, setAiming] = useState(false);
  const [enemyAnimationFrame, setEnemyAnimationFrame] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [itemsOnGround, setItemsOnGround] = useState([]);

  const gameScreenRef = useRef(null);

  const characterImages = {
    'Ryan Guinchard': ryangImg,
    'Ryan King': ryankImg,
    'Travis Whalen': travisImg,
    'Stephen Lahey': stephenImg,
    'Kyle Leights': kyleImg,
    'Kirk Leights': kirkImg,
  };

  const initialEnemies = [
    { id: 1, position: { x: 2, y: 1 }, item: 'Ring' },
    { id: 2, position: { x: 5, y: 4 }, item: 'Bow Tie' },
    { id: 3, position: { x: 7, y: 6 }, item: 'Shoes' }
  ];

  const [enemies, setEnemies] = useState(initialEnemies);

  const initialWalls = [
    { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 4 },
    { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 3, y: 6 },
    { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 6 },
    { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 8 },
    { x: 9, y: 0 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 6 },
    { x: 0, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 3 }, { x: 6, y: 3 }, { x: 8, y: 3 },
    { x: 0, y: 5 }, { x: 2, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 8, y: 5 },
    { x: 2, y: 7 }, { x: 4, y: 7 }, { x: 6, y: 7 }, { x: 8, y: 7 }
  ];

  const [walls, setWalls] = useState(initialWalls);

  const treasurePosition = { x: 9, y: 9 };

  const handleKeyPress = (e) => {
    if (!aiming) {
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      if (e.key === 'ArrowUp' && newY > 0) newY--;
      if (e.key === 'ArrowDown' && newY < gridSize - 1) newY++;
      if (e.key === 'ArrowLeft' && newX > 0) newX--;
      if (e.key === 'ArrowRight' && newX < gridSize - 1) newX++;

      const isWall = walls.some(wall => wall.x === newX && wall.y === newY);
      if (isWall) {
        const wallIndex = walls.findIndex(wall => wall.x === newX && wall.y === newY);
        const newWallX = walls[wallIndex].x + (newX - playerPosition.x);
        const newWallY = walls[wallIndex].y + (newY - playerPosition.y);

        if (
          newWallX >= 0 && newWallX < gridSize &&
          newWallY >= 0 && newWallY < gridSize &&
          !walls.some(wall => wall.x === newWallX && wall.y === newWallY)
        ) {
          const updatedWalls = [...walls];
          updatedWalls[wallIndex] = { x: newWallX, y: newWallY };
          setWalls(updatedWalls);
          setPlayerPosition({ x: newX, y: newY });
        }
        return;
      }

      setPlayerPosition({ x: newX, y: newY });

      const isTreasure = newX === treasurePosition.x && newY === treasurePosition.y;
      if (isTreasure && allEnemiesDefeated && allItemsCollected) {
        setShowPopup(true);
        return;
      }

      const itemIndex = itemsOnGround.findIndex(item => item.position.x === newX && item.position.y === newY);
      if (itemIndex !== -1) {
        const pickedItem = itemsOnGround[itemIndex];
        setCollectedItems([...collectedItems, pickedItem.name]);
        setItemsOnGround(itemsOnGround.filter((_, i) => i !== itemIndex));
        setMessage(`You picked up the ${pickedItem.name}!`);
        setTimeout(() => setMessage(''), 400);
      }
    } else {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        shootArrow(playerPosition.x, playerPosition.y, e.key.replace('Arrow', '').toLowerCase());
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      setAiming(true);
    }
    handleKeyPress(e);
  };
  
  const handleKeyUp = (e) => {
    if (e.key === ' ') {
      setAiming(false);
    }
  };
  const shootArrow = (x, y, direction) => {
    const arrow = { x, y, direction };
    setArrows([...arrows, arrow]);
  };

  const handleArrowMovement = () => {
    setArrows(prevArrows => {
      return prevArrows.map(arrow => {
        let newX = arrow.x;
        let newY = arrow.y;

        if (arrow.direction === 'up') newY--;
        if (arrow.direction === 'down') newY++;
        if (arrow.direction === 'left') newX--;
        if (arrow.direction === 'right') newX++;

        if (
          newX < 0 || newX >= gridSize || 
          newY < 0 || newY >= gridSize || 
          walls.some(wall => wall.x === newX && wall.y === newY)
        ) {
          return null;
        }

        const enemyIndex = enemies.findIndex(enemy => enemy.position.x === newX && enemy.position.y === newY);
        if (enemyIndex !== -1) {
          const hitEnemy = enemies[enemyIndex];
          const droppedItem = hitEnemy.item;

          setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.id !== hitEnemy.id));
          setItemsOnGround([...itemsOnGround, { name: droppedItem, position: { x: newX, y: newY }, img: droppedItem === 'Ring' ? ringImg : droppedItem === 'Bow Tie' ? bowTieImg : shoesImg }]);

          return null;
        }

        return { ...arrow, x: newX, y: newY };
      }).filter(Boolean);
    });
  };

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setEnemyAnimationFrame(prevFrame => (prevFrame === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    if (gameScreenRef.current) {
      gameScreenRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const arrowInterval = setInterval(handleArrowMovement, 100);
    return () => clearInterval(arrowInterval);
  }, [arrows]);

  const getArrowStyle = (arrow) => {
    if (arrow.direction === 'up') {
      return {
        width: '48px',
        height: '48px',
        transform: 'rotate(180deg)',
        imageRendering: 'pixelated',  // Ensures sharp pixel art
      };
    } else if (arrow.direction === 'down') {
      return {
        width: '48px',
        height: '48px',
        imageRendering: 'pixelated',  // Ensures sharp pixel art
      };
    } else if (arrow.direction === 'left') {
      return {
        width: '48px',
        height: '48px',
        transform: 'scaleX(-1)',
        imageRendering: 'pixelated',  // Ensures sharp pixel art
      };
    } else {
      return {
        width: '48px',
        height: '48px',
        imageRendering: 'pixelated',  // Ensures sharp pixel art
      };
    }
  };
  
  const handleMobileControl = (direction) => {
    handleKeyPress({ key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}` });

    setFacingDirection(direction);
  };
  
  const handleMobileShoot = () => {
    setAiming(true);
    setTimeout(() => {
      shootArrow(playerPosition.x, playerPosition.y, facingDirection);
      setAiming(false);
    }, 200);
  };
  
  const resetGame = () => {
    setPlayerPosition({ x: 0, y: 0 });
    setCollectedItems([]);
    setMessage('');
    setArrows([]);
    setEnemies(initialEnemies);
    setItemsOnGround([]);
    setWalls(initialWalls);
    setShowPopup(false);
    setFinalMessage('');
  };

  const allEnemiesDefeated = enemies.length === 0;
  const allItemsCollected = itemsOnGround.length === 0 && collectedItems.length === 3;

  const getMessageBasedOnPlayer = () => {
    if (playerName === 'Ryan Guinchard') {
      return 'Will you be my best man?';
    } else {
      return 'Will you be my groomsman?';
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ marginRight: '20px', textAlign: 'left' }}>
        <h3>Controls:</h3>
        <p>Arrow Keys: Move</p>
        <p>Hold the Spacebar to pull out your arrow,</p>
        <p>while holding spacebar use arrow key to fire in that direction</p>
        <p>You can push the blocks</p>
        <p>____________________________________________________________________</p>
        <p>Collect all items and defeat all enemies to open the treasure chest!</p>
      </div>
      <div
        id="gameScreen"
        ref={gameScreenRef}
        style={{ textAlign: 'center', marginTop: '50px', position: 'relative' }}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <h2>Collected Items: {collectedItems.join(', ')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 50px)`, gap: '5px', justifyContent: 'center' }}>
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const isPlayer = x === playerPosition.x && y === playerPosition.y;
            const isEnemy = enemies.find(enemy => enemy.position.x === x && enemy.position.y === y);
            const isWall = walls.some(wall => wall.x === x && wall.y === y);
            const isTreasure = x === treasurePosition.x && y === treasurePosition.y;
            const arrowInCell = arrows.find(arrow => arrow.x === x && arrow.y === y);
            const itemOnGround = itemsOnGround.find(item => item.position.x === x && item.position.y === y);

            return (
              <div
                key={index}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: isWall ? 'black' : 'lightgray',
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {isPlayer && (
                  <div>
                    <img src={characterImages[playerName]} alt={playerName} style={{ width: '48px', height: '48px', imageRendering: 'pixelated', }} />
                    {aiming && <img src={facingDirection === 'up' || facingDirection === 'down' ? arrowDownImg : arrowImg} alt="Arrow" style={getArrowStyle({ direction: facingDirection })} />}
                    {message && <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                      padding: '5px',
                      borderRadius: '5px',
                      border: '1px solid black',
                      zIndex: 10
                    }}>{message}</div>}
                  </div>
                )}
                {isEnemy && <img src={enemyAnimationFrame === 0 ? enemyImg1 : enemyImg2} alt="Enemy" style={{ width: '48px', height: '48px', imageRendering: 'pixelated', }} />}
                {arrowInCell && (
                  <img 
                    src={arrowInCell.direction === 'up' || arrowInCell.direction === 'down' ? arrowDownImg : arrowImg}
                    alt="Arrow"
                    style={getArrowStyle(arrowInCell)}
                  />
                )}
                {itemOnGround && <img src={itemOnGround.img} alt={itemOnGround.name} style={{ width: '48px', height: '48px' }} />}
                {isTreasure && allEnemiesDefeated && allItemsCollected && <img src={chestImg} alt="Treasure Chest" style={{ width: '48px', height: '48px' }} />}
                {isWall && <img src={wallImg} alt="Wall" style={{ width: '48px', height: '48px' }} />}
              </div>
            );
          })}
        </div>
        {showPopup && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid black',
            padding: '20px',
            zIndex: 20,
            textAlign: 'center'
          }}>
            {finalMessage ? (
              <>
                <h2>{finalMessage}</h2>
                <button onClick={() => { resetGame(); onReplay(); }}>Replay</button>
                <button onClick={() => { resetGame(); onEnd(); }}>Exit</button>
              </>
            ) : (
              <>
                <h1>{getMessageBasedOnPlayer()}</h1>
                <button onClick={() => setFinalMessage('Thank you!')}>Yes</button>
                <button onClick={() => setFinalMessage('Okay, thank you')}>No</button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="mobile-controls">
  <div className="control-row">
    <button className="control-btn" onClick={() => handleMobileControl('up')}>↑</button>
  </div>
  <div className="control-row">
    <button className="control-btn" onClick={() => handleMobileControl('left')}>←</button>
    <button className="control-btn" onClick={() => handleMobileControl('down')}>↓</button>
    <button className="control-btn" onClick={() => handleMobileControl('right')}>→</button>
  </div>
  <div className="control-row">
    <button className="control-btn" onClick={handleMobileShoot}>Fire</button>
  </div>


</div>



    </div>
  );
}

export default GameScreen;
