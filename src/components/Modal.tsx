import { CreatureDetails } from '../types/types';
import styles from './Modal.module.css';

interface ModalProps extends Partial<HTMLDivElement>  {
    show: boolean,
    onClose: () => void,
    creatureDetails: CreatureDetails,
    handleClaim?: () => void,
}

export function Modal({ show, onClose, creatureDetails, handleClaim }: ModalProps) {
  if (!show) {
    return null;
  }

  console.log(creatureDetails);
  const { name, stat } = creatureDetails;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton} />
        <div>
          <h4>Starkmon Details</h4>
          <p>Name: {name}</p>
          <p>Stat: {stat}</p>
        </div>
        <button onClick={handleClaim} className={styles.claimButton}>Claim</button>
      </div>
    </div>
  );
}