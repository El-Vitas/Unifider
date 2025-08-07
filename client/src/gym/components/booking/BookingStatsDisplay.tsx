interface BookingStatsDisplayProps {
  totalBookings: number;
  filteredCount: number;
  selectedDay: string;
  getDayName: (dayOfWeek: number) => string;
}

export const BookingStatsDisplay = ({
  totalBookings,
  filteredCount,
  selectedDay,
  getDayName,
}: BookingStatsDisplayProps) => {
  return (
    <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
      <span className="font-medium">Total: {totalBookings} reservas</span>
      <span>Mostrando: {filteredCount} reservas</span>
      {selectedDay !== 'all' && (
        <span className="text-[#005E90] font-medium">
          Día: {getDayName(parseInt(selectedDay))}
        </span>
      )}
    </div>
  );
};
