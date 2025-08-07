import React from 'react';

interface ScheduleBlock {
  id: number;
  start: string;
  end: string;
}

interface ScheduleCompactSummaryProps {
  scheduleByDay: Record<string, boolean[]>;
  capacityByDay: Record<string, Record<number, number>>;
  scheduleBlocks: ScheduleBlock[];
}

const ScheduleCompactSummary: React.FC<ScheduleCompactSummaryProps> = ({
  scheduleByDay,
  capacityByDay,
  scheduleBlocks,
}) => {
  if (Object.keys(scheduleByDay).length === 0) {
    return null;
  }

  // Calculate totals
  const totalDays = Object.keys(scheduleByDay).length;
  const totalAvailableBlocks = Object.values(scheduleByDay).reduce(
    (total, blocks) => total + blocks.filter(Boolean).length,
    0,
  );
  const totalPossibleBlocks = totalDays * scheduleBlocks.length;

  // Calculate total capacity
  const totalCapacity = Object.entries(scheduleByDay).reduce(
    (total, [day, blocks]) => {
      return (
        total +
        blocks.reduce((dayTotal, isAvailable, blockIndex) => {
          if (isAvailable) {
            const block = scheduleBlocks[blockIndex];
            const capacity = capacityByDay[day]?.[block?.id] || 20;
            return dayTotal + capacity;
          }
          return dayTotal;
        }, 0)
      );
    },
    0,
  );

  return (
    <div className="p-2 bg-primary/5 border border-primary/20 rounded-md">
      <div className="flex justify-between items-center text-xs">
        <div className="flex space-x-4 text-gray-600">
          <span>
            <span className="font-medium text-primary">
              {totalAvailableBlocks}
            </span>
            /{totalPossibleBlocks} bloques configurados
          </span>
          <span>
            Capacidad total:{' '}
            <span className="font-medium text-primary">{totalCapacity}</span>
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {totalDays} días configurados
        </div>
      </div>
    </div>
  );
};

export default ScheduleCompactSummary;
