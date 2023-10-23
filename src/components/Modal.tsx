import { useState } from 'react';
import { CreatureDetails } from '../types/types';
import styles from './Modal.module.css';

interface ModalProps extends Partial<HTMLDivElement> {
  show: boolean,
  onClose: () => void,
  creatureDetails: CreatureDetails,
  handleClaim?: () => void,
}

export function Modal({ show, onClose, creatureDetails, handleClaim }: ModalProps) {
  const [starkmonBeingClaimed, setStarkmonBeingClaimed] = useState(false);

  if (!show) {
    return null;
  }

  const handleClaimSubmission = () => {
    if (!handleClaim) {
      return;
    }
    handleClaim();
    setStarkmonBeingClaimed(true);
  }

  const renderModalContent = () => {
    if (starkmonBeingClaimed) {
      return (<>
        <div>
          <h4>Starkmon is being claimed...</h4>
          <p>You can continue your game after accept or decline to claim</p>
        </div>
      </>)
    } else {
      return (<>
        <img
          style={{
            backgroundImage: `url('${import.meta.env.VITE_PUBLIC_URL}/assets/starkmons/${name}.png')`
          }}
          width={256}
          height={256}
        />
        <div>
          <h4>Starkmon Details</h4>
          <p>Name: {name}</p>
          <p>Tier: {tier}</p>
        </div>
        <button onClick={handleClaimSubmission} className={styles.claimButton}>Claim</button>
      </>)
    }
  }

  const { name, tier } = creatureDetails;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton} />
        {
          renderModalContent()
        }
      </div>
    </div>
  );
}