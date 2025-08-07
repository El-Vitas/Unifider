import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  selectedDay: string;
  filteredBookingsLength: number;
  getDayName: (dayOfWeek: number) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  isLoading,
  selectedDay,
  filteredBookingsLength,
  getDayName,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined
            className="w-6 h-6 text-red-600"
            style={{ fontSize: '24px', color: '#dc2626' }}
          />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirmar eliminación
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar{' '}
          {selectedDay === 'all'
            ? 'TODAS'
            : `las reservas del ${getDayName(parseInt(selectedDay))}`}{' '}
          las reservas de este gimnasio?
          <br />
          <br />
          <strong>
            Esta acción no se puede deshacer y afectará a{' '}
            {filteredBookingsLength} usuarios.
          </strong>
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Eliminando...
              </>
            ) : (
              <>
                <DeleteOutlined
                  className="w-4 h-4"
                  style={{ fontSize: '16px' }}
                />
                Confirmar eliminación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
