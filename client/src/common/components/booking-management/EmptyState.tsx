import { UserOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  searchTerm: string;
}

export const EmptyState = ({ searchTerm }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <UserOutlined
        className="w-12 h-12 mb-4 opacity-50"
        style={{ fontSize: '48px' }}
      />
      <p className="text-lg font-medium">No hay reservas</p>
      <p className="text-sm">
        {searchTerm
          ? 'No se encontraron reservas con ese criterio de búsqueda'
          : 'Este gimnasio no tiene reservas activas'}
      </p>
    </div>
  );
};
