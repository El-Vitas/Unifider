import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';

interface BookingPageHeaderProps {
  onBackClick: () => void;
}

export const BookingPageHeader = ({ onBackClick }: BookingPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeftOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
          Volver
        </button>
        <div className="flex items-center gap-3">
          <UserOutlined
            className="w-8 h-8 text-[#005E90]"
            style={{ fontSize: '32px', color: '#005E90' }}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestionar Reservas
            </h1>
            <p className="text-lg text-gray-600">Gestión de Reservas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
