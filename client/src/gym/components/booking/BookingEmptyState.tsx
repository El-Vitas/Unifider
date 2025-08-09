import { UserOutlined } from '@ant-design/icons';

interface BookingEmptyStateProps {
  searchTerm: string;
}

export const BookingEmptyState = ({ searchTerm }: BookingEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <UserOutlined
        className="w-16 h-16 mb-4 opacity-50"
        style={{ fontSize: '64px' }}
      />
      <p className="text-xl font-medium mb-2">No hay reservas</p>
      <p className="text-sm text-center max-w-md">
        {searchTerm
          ? 'No se encontraron reservas con ese criterio de búsqueda. Intenta con otros términos.'
          : 'Este gimnasio no tiene reservas activas en este momento.'}
      </p>
    </div>
  );
};
