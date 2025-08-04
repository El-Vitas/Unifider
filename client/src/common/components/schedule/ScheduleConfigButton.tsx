import React from 'react';

interface ScheduleConfigButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const ScheduleConfigButton: React.FC<ScheduleConfigButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
      disabled={disabled || isLoading}
    >
      Configurar Horario Disponible
    </button>
  );
};

export default ScheduleConfigButton;
