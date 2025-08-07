import { FilterOutlined, DeleteOutlined } from '@ant-design/icons';

interface BookingFiltersControlsProps {
  selectedDay: string;
  searchTerm: string;
  onDayFilterChange: (day: string) => void;
  onSearchTermChange: (term: string) => void;
  onResetClick: () => void;
  canReset: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export const BookingFiltersControls = ({
  selectedDay,
  searchTerm,
  onDayFilterChange,
  onSearchTermChange,
  onResetClick,
  canReset,
}: BookingFiltersControlsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2">
          <FilterOutlined
            className="w-4 h-4 text-gray-500"
            style={{ fontSize: '16px' }}
          />
          <select
            value={selectedDay}
            onChange={(e) => onDayFilterChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
          >
            <option value="all">Todos los días</option>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value.toString()}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o email del usuario..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
          />
        </div>

        <button
          onClick={onResetClick}
          disabled={!canReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <DeleteOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
          Reset Reservas
        </button>
      </div>
    </div>
  );
};
