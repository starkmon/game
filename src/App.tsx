import React, { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import './App.css'
import { StarknetWindowObject, connect } from "get-starknet";

function App() {
  const myRef = useRef(null);
  const [starknetWallet, setWallet] = useState<StarknetWindowObject | null>(null);
  useEffect(() => {
    if (myRef.current) {
      if (!starknetWallet) {
        connect({ modalMode: 'neverAsk' }).then(starknet => {
          setWallet(starknet);
        });
      }
      const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt: true,
        physics: {
          default: 'arcade'
        },
        scene: [new GameScene(starknetWallet)], // Add your game scenes here
        parent: myRef.current,
      };

      const game = new Phaser.Game(gameConfig);

      return () => {
        game.destroy(true);
      };
    }
  }, [myRef, starknetWallet]);

  return (
    <div className="App">
      {!starknetWallet || !starknetWallet.isConnected ?
        <>
          <h4>Wallet not connected, exploration only mode.</h4>
          <button onClick={() => connect()}>
            Connect wallet
          </button>
        </> : <></>
      }
      <div ref={myRef}></div>
    </div>
  );
}

export default App;
