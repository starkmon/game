import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import './App.css'

function App() {
  const myRef = useRef(null);
  useEffect(() => {
    if (myRef.current) {
      const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt: true,
        physics: {
          default: 'arcade'
        },
        scene: [GameScene], // Add your game scenes here
        parent: myRef.current,
      };

      const game = new Phaser.Game(gameConfig);

      return () => {
        game.destroy(true);
      };
    }
  }, [myRef]);

  return (
    <div className="App" ref={myRef}>
      {/* Your React components */}
    </div>
  );
}

export default App;
