import type { ScheduleTimeBlockRequest } from '../../gym/entities';

interface ScheduleBlock {
  id: number;
  start: string;
  end: string;
}

const DAY_TO_NUMBER: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const NUMBER_TO_DAY: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

export const convertScheduleForSubmission = (
  scheduleByDay: Record<string, boolean[]>,
  capacityByDay: Record<string, Record<number, number>>,
  scheduleBlocks: ScheduleBlock[],
): ScheduleTimeBlockRequest[] => {
  const timeBlocks: ScheduleTimeBlockRequest[] = [];

  Object.entries(scheduleByDay).forEach(([dayKey, blockMatrix]) => {
    const dayOfWeek = DAY_TO_NUMBER[dayKey];
    if (dayOfWeek === undefined) return;

    blockMatrix.forEach((isEnabled, blockIndex) => {
      const block = scheduleBlocks[blockIndex];
      if (!block) return;

      const capacity = capacityByDay[dayKey]?.[block.id] || 20;

      timeBlocks.push({
        dayOfWeek,
        startTime: block.start,
        endTime: block.end,
        capacity: isEnabled ? capacity : 0,
        isEnabled,
      });
    });
  });

  return timeBlocks;
};

export const convertTimeBlocksToScheduleFormat = (
  timeBlocks: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
    isEnabled: boolean;
  }>,
  scheduleBlocks: ScheduleBlock[],
): {
  scheduleByDay: Record<string, boolean[]>;
  capacityByDay: Record<string, Record<number, number>>;
} => {
  const scheduleByDay: Record<string, boolean[]> = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };

  const capacityByDay: Record<string, Record<number, number>> = {
    sunday: {},
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
  };

  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[day] = new Array(scheduleBlocks.length).fill(false);
  });

  timeBlocks.forEach((timeBlock) => {
    const dayKey = NUMBER_TO_DAY[timeBlock.dayOfWeek];
    if (!dayKey) return;

    const blockIndex = scheduleBlocks.findIndex((block) => {
      return block.start === timeBlock.startTime && block.end === timeBlock.endTime;
    });

    if (blockIndex !== -1) {
      scheduleByDay[dayKey][blockIndex] = timeBlock.isEnabled;
      const block = scheduleBlocks[blockIndex];
      capacityByDay[dayKey][block.id] = timeBlock.capacity;
    }
  });

  return { scheduleByDay, capacityByDay };
};
