import React, { useState } from 'react';

interface ScheduleBlock {
  id: number;
  start: string;
  end: string;
}

interface ScheduleSummaryProps {
  scheduleByDay: Record<string, boolean[]>;
  capacityByDay: Record<string, Record<number, number>>;
  scheduleBlocks: ScheduleBlock[];
}

const DAY_LABELS = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
};

const DAY_LABELS_SHORT = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
};

const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({
  scheduleByDay,
  capacityByDay,
  scheduleBlocks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (Object.keys(scheduleByDay).length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-50 border rounded-md">
      {/* Header with toggle button */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h4 className="text-sm font-medium">Configuración de Horarios</h4>
        <button
          type="button"
          onClick={toggleExpanded}
          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          {isExpanded ? 'Ocultar Resumen' : 'Mostrar Resumen'}
        </button>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-3">
          <div className="text-xs text-gray-600 space-y-1">
            {/* Available Blocks Summary */}
            {Object.entries(scheduleByDay).map(([day, blocks]) => {
              const availableCount = blocks.filter(Boolean).length;
              const dayLabel = DAY_LABELS[day as keyof typeof DAY_LABELS];
              return (
                <div key={day} className="flex justify-between">
                  <span>{dayLabel}:</span>
                  <span>
                    {availableCount} de {blocks.length} bloques disponibles
                  </span>
                </div>
              );
            })}

            {/* Capacity Details */}
            {Object.keys(capacityByDay).length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-300">
                <div className="text-xs font-medium text-gray-700 mb-1">
                  Capacidades configuradas:
                </div>
                {scheduleBlocks.map((block, blockIndex) => (
                  <div key={block.id} className="mb-1">
                    <div className="text-xs font-medium text-gray-600">
                      {block.start}-{block.end}:
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                      {Object.entries(capacityByDay).map(
                        ([day, blockCapacities]) => {
                          const dayLabel =
                            DAY_LABELS_SHORT[
                              day as keyof typeof DAY_LABELS_SHORT
                            ];
                          // Check if this block is available for this day
                          const isBlockAvailable =
                            scheduleByDay[day]?.[blockIndex] || false;
                          const capacity = isBlockAvailable
                            ? blockCapacities[block.id] || 20
                            : 0;

                          return (
                            <span key={day} className="mr-2">
                              {dayLabel}: {capacity}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSummary;
