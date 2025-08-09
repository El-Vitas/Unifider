import { useState, useMemo } from 'react';

interface TimeBlock {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isEnabled: boolean;
  currentBookings: number;
  isUserBooked: boolean;
}

interface BookingCalendarProps {
  timeBlocks: TimeBlock[];
  entityName: string;
  onReserve: (
    bookings: Array<{ scheduleTimeBlockId: string; bookingDate: string }>,
  ) => Promise<void>;
  onUnsubscribe: (timeBlockId: string) => Promise<void>;
}

const BookingCalendar = ({
  timeBlocks,
  entityName,
  onReserve,
  onUnsubscribe,
}: BookingCalendarProps) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slotsToUnsubscribe, setSlotsToUnsubscribe] = useState<string[]>([]);

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = useMemo(() => generateWeekDates(), []);

  const uniqueTimes = useMemo(() => {
    if (!timeBlocks) return [];
    const times = [...new Set(timeBlocks.map((block) => block.startTime))];
    return times.sort();
  }, [timeBlocks]);

  const availabilityMatrix = useMemo(() => {
    if (!timeBlocks) return [];

    return uniqueTimes.map((time) =>
      weekDates.map((date) => {
        if (date.getDay() === 0) {
          return { type: 'disabled', block: null };
        }

        const backendDayOfWeek = date.getDay();

        const block = timeBlocks.find(
          (b) => b.startTime === time && b.dayOfWeek === backendDayOfWeek,
        );

        if (!block || !block.isEnabled) {
          return { type: 'disabled', block: null };
        }

        if (block.isUserBooked) {
          return { type: 'booked', block };
        }

        if (block.currentBookings >= block.capacity) {
          return { type: 'full', block };
        }

        return { type: 'available', block };
      }),
    );
  }, [timeBlocks, weekDates, uniqueTimes]);

  const handleSlotClick = (timeIndex: number, dayIndex: number) => {
    const slot = `${timeIndex}-${dayIndex}`;
    const cellData = availabilityMatrix[timeIndex]?.[dayIndex];

    if (!cellData || cellData.type === 'disabled' || cellData.type === 'full')
      return;

    if (cellData.type === 'booked' && cellData.block?.isUserBooked) {
      setSlotsToUnsubscribe((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
      );
      return;
    }

    if (cellData.type === 'available') {
      setSelectedSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
      );
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (slotsToUnsubscribe.length > 0) {
        for (const slot of slotsToUnsubscribe) {
          const [timeIndex] = slot.split('-').map(Number);
          const cellData =
            availabilityMatrix[timeIndex]?.[parseInt(slot.split('-')[1])];
          if (cellData?.block) {
            await onUnsubscribe(cellData.block.id);
          }
        }
      }

      if (selectedSlots.length > 0) {
        const bookings = selectedSlots.map((slot) => {
          const [timeIndex, dayIndex] = slot.split('-').map(Number);
          const cellData = availabilityMatrix[timeIndex][dayIndex];
          const bookingDate = weekDates[dayIndex];

          if (!cellData.block) {
            throw new Error('Invalid booking slot');
          }

          return {
            scheduleTimeBlockId: cellData.block.id,
            bookingDate: bookingDate.toISOString().split('T')[0],
          };
        });

        await onReserve(bookings);
      }

      setSelectedSlots([]);
      setSlotsToUnsubscribe([]);
    } catch (error) {
      console.error('Error saving changes:', error);
      throw error;
    }
  };

  const getCellClass = (timeIndex: number, dayIndex: number) => {
    const slot = `${timeIndex}-${dayIndex}`;
    const cellData = availabilityMatrix[timeIndex]?.[dayIndex];

    if (!cellData) return 'bg-gray-200 cursor-not-allowed text-gray-500';

    switch (cellData.type) {
      case 'disabled':
        return 'bg-gray-200 cursor-not-allowed text-gray-500';
      case 'booked':
        if (cellData.block?.isUserBooked) {
          return slotsToUnsubscribe.includes(slot)
            ? 'bg-red-500 cursor-pointer text-white border-2 border-red-700'
            : 'bg-blue-400 cursor-pointer text-white hover:bg-blue-500 border-2 border-blue-600';
        }
        return 'bg-green-400 cursor-pointer text-white hover:bg-green-500';
      case 'full':
        return 'bg-red-400 cursor-not-allowed text-white';
      case 'available':
        return selectedSlots.includes(slot)
          ? 'bg-yellow-400 cursor-pointer text-gray-800 border-2 border-yellow-600'
          : 'bg-green-400 cursor-pointer text-white hover:bg-green-500';
      default:
        return 'bg-gray-200 cursor-not-allowed text-gray-500';
    }
  };

  const hasChanges = selectedSlots.length > 0 || slotsToUnsubscribe.length > 0;

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reservar - {entityName}
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg">
          Selecciona los horarios que deseas reservar o cancelar
        </p>
      </div>
      {/* Leyenda */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded border-2 border-yellow-600"></div>
          <span>Para reservar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded border-2 border-blue-600"></div>
          <span>Mis reservas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-700"></div>
          <span>Para cancelar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Completo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>No disponible</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto p-6">
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-fit">
            {/* Header con días */}
            <div className="grid grid-cols-8 gap-2 items-center mb-4">
              <div className="w-24"></div>
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className="text-center font-semibold p-2 min-w-20"
                >
                  <div
                    className={`${date.getDay() === 0 ? 'text-red-500' : ''}`}
                  >
                    {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {date.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 w-full">
              {uniqueTimes.map((time, timeIndex) => (
                <div
                  key={timeIndex}
                  className="grid grid-cols-8 gap-1 items-center w-full"
                >
                  <div className="w-24 p-2 text-center bg-gray-50 border border-gray-300 rounded-lg font-medium">
                    {time}
                  </div>

                  {weekDates.map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`min-w-20 h-12 border-2 rounded-md flex justify-center items-center transition-all duration-200 ${getCellClass(timeIndex, dayIndex)}`}
                      onClick={() => handleSlotClick(timeIndex, dayIndex)}
                    >
                      {availabilityMatrix[timeIndex]?.[dayIndex]?.type ===
                        'full' && (
                        <span className="text-xs text-white font-bold">
                          FULL
                        </span>
                      )}
                      {availabilityMatrix[timeIndex]?.[dayIndex]?.type ===
                        'booked' &&
                        availabilityMatrix[timeIndex]?.[dayIndex]?.block
                          ?.isUserBooked && (
                          <span className="text-xs font-bold">
                            {slotsToUnsubscribe.includes(
                              `${timeIndex}-${dayIndex}`,
                            )
                              ? '✗'
                              : '✓'}
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>{' '}
      <div className="text-center mt-8">
        <button
          className={`px-8 py-3 text-white rounded-lg font-bold focus:outline-none transition-all duration-300 ${
            hasChanges
              ? 'cursor-pointer bg-primary hover:bg-primary-dark transform hover:scale-105 shadow-lg'
              : 'cursor-not-allowed bg-gray-400'
          }`}
          onClick={handleSaveChanges}
          disabled={!hasChanges}
        >
          Guardar Cambios
          {selectedSlots.length > 0 && ` (+${selectedSlots.length})`}
          {slotsToUnsubscribe.length > 0 && ` (-${slotsToUnsubscribe.length})`}
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;
