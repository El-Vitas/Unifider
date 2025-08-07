import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface ResetConfirmationModalProps {
  isVisible: boolean;
  selectedDay: string;
  filteredCount: number;
  isResetting: boolean;
  getDayName: (dayOfWeek: number) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmationModal = ({
  isVisible,
  selectedDay,
  filteredCount,
  isResetting,
  getDayName,
  onConfirm,
  onCancel,
}: ResetConfirmationModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined
            className="w-6 h-6 text-red-600"
            style={{ fontSize: '24px', color: '#dc2626' }}
          />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirmar eliminación masiva
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
            Esta acción no se puede deshacer y afectará a {filteredCount}{' '}
            usuarios.
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
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isResetting ? (
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
