import React, { useState, useEffect } from 'react';

type WeeklyScheduleSelectorProps = {
  blocks: { id: number; start: string; end: string }[];
  onChange: (scheduleByDay: Record<string, boolean[]>) => void;
  onCapacityChange?: (
    capacityByDay: Record<string, Record<number, number>>,
  ) => void;
  initialSchedule?: Record<string, boolean[]>;
  initialCapacity?: Record<string, Record<number, number>>;
  isOpen: boolean;
  onClose: () => void;
};

const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({
  blocks,
  onChange,
  onCapacityChange,
  initialSchedule,
  initialCapacity,
  isOpen,
  onClose,
}) => {
  const days = [
    { key: 'monday', label: 'Lun' },
    { key: 'tuesday', label: 'Mar' },
    { key: 'wednesday', label: 'Mié' },
    { key: 'thursday', label: 'Jue' },
    { key: 'friday', label: 'Vie' },
    { key: 'saturday', label: 'Sáb' },
  ];

  // Initialize schedule with all blocks available for each day
  const initializeSchedule = () => {
    const schedule: Record<string, boolean[]> = {};
    days.forEach((day) => {
      schedule[day.key] = Array(blocks.length).fill(true);
    });
    return schedule;
  };

  // Initialize capacity with default value for each day and block
  const initializeCapacity = () => {
    const capacity: Record<string, Record<number, number>> = {};
    days.forEach((day) => {
      capacity[day.key] = {};
      blocks.forEach((block) => {
        capacity[day.key][block.id] = 20; // Default capacity
      });
    });
    return capacity;
  };

  // Temporary states - only committed on save
  const [tempScheduleByDay, setTempScheduleByDay] = useState<
    Record<string, boolean[]>
  >(initialSchedule || initializeSchedule());

  const [tempCapacityByDay, setTempCapacityByDay] = useState<
    Record<string, Record<number, number>>
  >(initialCapacity || initializeCapacity());

  useEffect(() => {
    if (initialSchedule) {
      setTempScheduleByDay(initialSchedule);
    }
  }, [initialSchedule]);

  useEffect(() => {
    if (initialCapacity) {
      setTempCapacityByDay(initialCapacity);
    }
  }, [initialCapacity]);

  const handleCapacityChange = (
    dayKey: string,
    blockId: number,
    capacity: number,
  ) => {
    const updatedCapacity = { ...tempCapacityByDay };
    if (!updatedCapacity[dayKey]) {
      updatedCapacity[dayKey] = {};
    }
    updatedCapacity[dayKey] = { ...updatedCapacity[dayKey] };
    updatedCapacity[dayKey][blockId] = capacity;
    setTempCapacityByDay(updatedCapacity);
    // Don't call onCapacityChange here - only on save
  };

  const handleSlotClick = (dayKey: string, blockIndex: number) => {
    const updatedSchedule = { ...tempScheduleByDay };
    updatedSchedule[dayKey] = [...updatedSchedule[dayKey]];
    updatedSchedule[dayKey][blockIndex] = !updatedSchedule[dayKey][blockIndex];

    setTempScheduleByDay(updatedSchedule);
    // Don't call onChange here - only on save
  };

  const toggleAllDay = (dayKey: string, selectAll: boolean) => {
    const updatedSchedule = { ...tempScheduleByDay };
    updatedSchedule[dayKey] = Array(blocks.length).fill(selectAll);

    setTempScheduleByDay(updatedSchedule);
    // Don't call onChange here - only on save
  };

  const toggleAllTime = (blockIndex: number, selectAll: boolean) => {
    const updatedSchedule = { ...tempScheduleByDay };
    days.forEach((day) => {
      if (!updatedSchedule[day.key]) {
        updatedSchedule[day.key] = Array(blocks.length).fill(true);
      }
      updatedSchedule[day.key] = [...updatedSchedule[day.key]];
      updatedSchedule[day.key][blockIndex] = selectAll;
    });

    setTempScheduleByDay(updatedSchedule);
    // Don't call onChange here - only on save
  };

  const handleSave = () => {
    // Only now we commit the changes
    onChange(tempScheduleByDay);
    onCapacityChange?.(tempCapacityByDay);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial values
    setTempScheduleByDay(initialSchedule || initializeSchedule());
    setTempCapacityByDay(initialCapacity || initializeCapacity());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleCancel} // Click outside to cancel
    >
      <div
        className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Configurar Disponibilidad Horaria
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="mb-3 p-3 bg-primary/10 border border-primary/25 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Selecciona los bloques horarios disponibles para cada día.
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-xs text-accent">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-disabled rounded-sm"></div>
                <span>No disponible</span>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col"
            style={{ height: 'calc(100% - 100px)' }}
          >
            {/* Header Row - Fixed */}
            <div className="flex bg-gray-50 border border-gray-200 rounded-md p-2 mb-2 flex-shrink-0">
              <div className="w-20 flex flex-col items-center space-y-1">
                <div className="h-4 text-xs font-semibold text-center text-gray-700">
                  Horario
                </div>
                <button
                  type="button"
                  className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors font-medium"
                  onClick={() => {
                    const allSelected = days.every(
                      (day) =>
                        tempScheduleByDay[day.key] &&
                        tempScheduleByDay[day.key].every((slot) => slot),
                    );

                    const updatedSchedule = { ...tempScheduleByDay };
                    days.forEach((day) => {
                      updatedSchedule[day.key] = Array(blocks.length).fill(
                        !allSelected,
                      );
                    });

                    setTempScheduleByDay(updatedSchedule);
                  }}
                >
                  Todo
                </button>
                <button
                  type="button"
                  className="text-xs px-1 py-0.5 bg-accent text-white rounded hover:bg-accent/90 transition-colors font-medium"
                  onClick={() => {
                    const capacity = prompt(
                      'Capacidad para todos los bloques disponibles:',
                      '20',
                    );
                    if (capacity && !isNaN(parseInt(capacity))) {
                      const cap = parseInt(capacity);
                      const updatedCapacity = { ...tempCapacityByDay };
                      days.forEach((day) => {
                        if (!updatedCapacity[day.key])
                          updatedCapacity[day.key] = {};
                        blocks.forEach((block) => {
                          if (
                            tempScheduleByDay[day.key]?.[blocks.indexOf(block)]
                          ) {
                            updatedCapacity[day.key][block.id] = cap;
                          }
                        });
                      });
                      setTempCapacityByDay(updatedCapacity);
                    }
                  }}
                >
                  Cap
                </button>
              </div>

              {days.map((day) => (
                <div
                  key={day.key}
                  className="flex-1 flex flex-col items-center min-w-0 mx-1 space-y-1"
                >
                  <div className="text-center font-semibold text-xs text-gray-700">
                    {day.label}
                  </div>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap font-medium"
                    onClick={() => {
                      const allSelected = tempScheduleByDay[day.key]?.every(
                        (slot: boolean) => slot,
                      );
                      toggleAllDay(day.key, !allSelected);
                    }}
                  >
                    Todo
                  </button>
                  <button
                    type="button"
                    className="text-xs px-1 py-0.5 bg-accent text-white rounded hover:bg-accent/90 transition-colors whitespace-nowrap font-medium"
                    onClick={() => {
                      const capacity = prompt(
                        `Capacidad para todos los bloques de ${day.label}:`,
                        '20',
                      );
                      if (capacity && !isNaN(parseInt(capacity))) {
                        const cap = parseInt(capacity);
                        const updatedCapacity = { ...tempCapacityByDay };
                        if (!updatedCapacity[day.key])
                          updatedCapacity[day.key] = {};
                        blocks.forEach((block) => {
                          if (
                            tempScheduleByDay[day.key]?.[blocks.indexOf(block)]
                          ) {
                            updatedCapacity[day.key][block.id] = cap;
                          }
                        });
                        setTempCapacityByDay(updatedCapacity);
                      }
                    }}
                  >
                    Cap
                  </button>
                </div>
              ))}
            </div>

            {/* Time Blocks Rows - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              <div className="pb-4">
                {blocks.map((block, blockIndex) => (
                  <div
                    key={block.id}
                    className="flex items-center min-h-[3rem] bg-white border border-gray-100 rounded-md p-2 hover:bg-gray-50 transition-colors mb-1"
                  >
                    <div className="w-20 flex flex-col items-center">
                      <div className="px-2 py-1 text-center bg-gray-100 border border-gray-200 rounded text-xs font-medium min-h-[1.5rem] flex items-center justify-center text-gray-700">
                        {block.start} - {block.end}
                      </div>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 mt-1 bg-accent text-white rounded hover:bg-accent/90 transition-colors whitespace-nowrap font-medium"
                        onClick={() => {
                          const allSelected = days.every(
                            (day) =>
                              tempScheduleByDay[day.key] &&
                              tempScheduleByDay[day.key][blockIndex],
                          );
                          toggleAllTime(blockIndex, !allSelected);
                        }}
                      >
                        Todo
                      </button>
                      <button
                        type="button"
                        className="text-xs px-1 py-0.5 mt-1 bg-primary/80 text-white rounded hover:bg-primary transition-colors whitespace-nowrap font-medium"
                        onClick={() => {
                          const capacity = prompt(
                            `Capacidad para el bloque ${block.start}-${block.end} en todos los días:`,
                            '20',
                          );
                          if (capacity && !isNaN(parseInt(capacity))) {
                            const cap = parseInt(capacity);
                            const updatedCapacity = { ...tempCapacityByDay };
                            days.forEach((day) => {
                              if (tempScheduleByDay[day.key]?.[blockIndex]) {
                                if (!updatedCapacity[day.key])
                                  updatedCapacity[day.key] = {};
                                updatedCapacity[day.key][block.id] = cap;
                              }
                            });
                            setTempCapacityByDay(updatedCapacity);
                          }
                        }}
                      >
                        Cap
                      </button>
                    </div>

                    <div className="flex-1 flex space-x-1 ml-2">
                      {days.map((day) => (
                        <div
                          key={`${day.key}-${block.id}`}
                          className="flex-1 flex flex-col items-center space-y-1"
                        >
                          <div
                            className={`w-full h-8 border rounded flex justify-center items-center cursor-pointer transition-colors ${
                              tempScheduleByDay[day.key]?.[blockIndex]
                                ? 'bg-green-500 border-green-600 hover:bg-green-600 text-white'
                                : 'bg-disabled border-gray-400 hover:bg-disabled/80 text-white'
                            }`}
                            onClick={() => handleSlotClick(day.key, blockIndex)}
                          >
                            <div className="text-xs font-semibold">
                              {tempScheduleByDay[day.key]?.[blockIndex]
                                ? '✓'
                                : '✗'}
                            </div>
                          </div>
                          {tempScheduleByDay[day.key]?.[blockIndex] && (
                            <input
                              type="number"
                              min="1"
                              max="999"
                              value={
                                tempCapacityByDay[day.key]?.[block.id] || 20
                              }
                              onChange={(e) =>
                                handleCapacityChange(
                                  day.key,
                                  block.id,
                                  parseInt(e.target.value) || 20,
                                )
                              }
                              className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded text-center focus:border-primary focus:outline-none"
                              placeholder="Cap"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleSelector;
