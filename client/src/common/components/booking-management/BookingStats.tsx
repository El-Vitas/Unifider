interface BookingStatsProps {
  totalBookings: number;
  filteredCount: number;
  selectedDay: string;
  getDayName: (dayOfWeek: number) => string;
}

export const BookingStats = ({
  totalBookings,
  filteredCount,
  selectedDay,
  getDayName,
}: BookingStatsProps) => {
  return (
    <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
      <span>Total: {totalBookings} reservas</span>
      <span>Mostrando: {filteredCount} reservas</span>
      {selectedDay !== 'all' && (
        <span>Día: {getDayName(parseInt(selectedDay))}</span>
      )}
    </div>
  );
};
