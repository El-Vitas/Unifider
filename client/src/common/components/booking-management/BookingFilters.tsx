import { FilterOutlined, DeleteOutlined } from '@ant-design/icons';

interface BookingFiltersProps {
  selectedDay: string;
  searchTerm: string;
  filteredBookingsLength: number;
  daysOfWeek: Array<{ value: number; label: string }>;
  onDayChange: (day: string) => void;
  onSearchChange: (term: string) => void;
  onResetClick: () => void;
}

export const BookingFilters = ({
  selectedDay,
  searchTerm,
  filteredBookingsLength,
  daysOfWeek,
  onDayChange,
  onSearchChange,
  onResetClick,
}: BookingFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex items-center gap-2">
        <FilterOutlined
          className="w-4 h-4 text-gray-500"
          style={{ fontSize: '16px' }}
        />
        <select
          value={selectedDay}
          onChange={(e) => onDayChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
        >
          <option value="all">Todos los días</option>
          {daysOfWeek.map((day) => (
            <option key={day.value} value={day.value.toString()}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
        />
      </div>

      <button
        onClick={onResetClick}
        disabled={filteredBookingsLength === 0}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <DeleteOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
        Reset Reservas
      </button>
    </div>
  );
};
