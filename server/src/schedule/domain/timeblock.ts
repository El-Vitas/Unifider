export const timeBlock = [
  { id: 0, start: '08:15', end: '08:50' },
  { id: 1, start: '08:50', end: '09:25' },
  { id: 2, start: '09:35', end: '10:10' },
  { id: 3, start: '10:10', end: '10:45' },
  { id: 4, start: '10:55', end: '11:30' },
  { id: 5, start: '11:30', end: '12:05' },
  { id: 6, start: '12:15', end: '12:50' },
  { id: 7, start: '12:50', end: '13:25' },
  { id: 8, start: '14:30', end: '15:05' },
  { id: 9, start: '15:05', end: '15:40' },
  { id: 10, start: '15:50', end: '16:25' },
  { id: 11, start: '16:25', end: '17:00' },
  { id: 12, start: '17:10', end: '17:45' },
  { id: 13, start: '17:45', end: '18:20' },
  { id: 14, start: '18:30', end: '19:05' },
  { id: 15, start: '19:05', end: '19:40' },
  { id: 16, start: '19:50', end: '20:25' },
  { id: 17, start: '20:25', end: '21:00' },
  { id: 18, start: '21:10', end: '21:45' },
  { id: 19, start: '21:45', end: '22:20' },
];

export const validateTimeBlock = (
  startTime: string,
  endTime: string,
): boolean => {
  return timeBlock.some(
    (block) => block.start === startTime && block.end === endTime,
  );
};

export const getValidTimeBlocks = () => {
  return timeBlock.map((block) => ({
    start: block.start,
    end: block.end,
  }));
};
