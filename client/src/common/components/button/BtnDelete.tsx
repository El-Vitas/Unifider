import { useState } from 'react';
import BtnPrimary from './BtnPrimary';
import ConfirmDeletion from '../ConfirmDeletion';

type BtnDeleteProps = {
  onDelete: () => void;
  children?: React.ReactNode;
  className?: string;
  confirmTitle?: string;
  confirmMessage?: string;
}

const BtnDelete = ({
  onDelete,
  children,
  className,
  confirmTitle,
  confirmMessage,
}: BtnDeleteProps) => {
  const [showPopUp, setShowPopUp] = useState(false);

  const handleConfirm = () => {
    onDelete();
    setShowPopUp(false);
  };

  const handleCancel = () => {
    setShowPopUp(false);
  };

  const handleClick = () => {
    setShowPopUp(true);
  };

  return (
    <>
      <BtnPrimary onClick={handleClick} className={className}>
        {children || 'Eliminar'}
      </BtnPrimary>

      <ConfirmDeletion
        isOpen={showPopUp}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmTitle}
        message={confirmMessage}
      />
    </>
  );
};

export default BtnDelete;
