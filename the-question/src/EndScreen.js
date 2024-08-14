// src/EndScreen.js
import React from 'react';

function EndScreen() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Congratulations!</h1>
      <p>You've found the treasure!</p>
      <h2>Will you be my best man?</h2>
      <button onClick={() => alert('Thank you!')}>Yes!</button>
    </div>
  );
}

export default EndScreen;
