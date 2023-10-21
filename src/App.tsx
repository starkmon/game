import React, { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import './App.css'
import { getStarknet } from "get-starknet-core";

function App() {
  const { enable, getAvailableWallets } = getStarknet();
  const myRef = useRef(null);
  const [wallet, setWallet] = useState<unknown>();
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

  
  getAvailableWallets().then(res => enable(res[0]).then(res => setWallet(res)));

  console.log("Wallet ", wallet);

  return (
    <div className="App" ref={myRef}>
      {/* Your React components */}
    </div>
  );
}

export default App;
