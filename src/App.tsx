import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import './App.css'
import { StarknetWindowObject, connect } from "get-starknet";
import { fetch_creature_reveal_data } from './utils/reveal_creatures';
import { Modal } from './components/Modal';
import starknetUtils, { contractsConfig } from './utils/starknetUtils';
import { CreatureDetails } from './types/types';

function App() {
  const myRef = useRef(null);
  const [starknetWallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [creatureDetails, setCreatureDetails] = useState<CreatureDetails>();

  const handleModalVisibility = (show: boolean, details: CreatureDetails) => {
    setShowModal(show);
    setCreatureDetails(details);
  }

  useEffect(() => {
    if (myRef.current) {
      if (!starknetWallet) {
        connect({ modalMode: 'neverAsk' }).then(async starknet => {
          setWallet(starknet);
          await fetch_creature_reveal_data()
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
        scene: [new GameScene(starknetWallet, handleModalVisibility)], // Add your game scenes here
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
      {showModal &&
        <Modal
          show={showModal}
          onClose={() => handleModalVisibility(false, creatureDetails)}
          creatureDetails={creatureDetails}
          handleClaim={() => {
            starknetWallet && starknetUtils.operate(
              starknetWallet,
              contractsConfig.CREATURE_SYSTEM,
              "claim_creature_on_coordinates",
              [creatureDetails.x, creatureDetails.y]);
          }}
        />
      }
      <div ref={myRef}></div>
    </div>
  );
}



export default App;
