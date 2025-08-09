export const getWeekDaysName = (): string[] => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayFullName = `${d.getDate()} ${getMonthName(d)}`;
    weekdays.push(dayFullName);
  }
  return weekdays;
};

export const getMonthName = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long' };
  return date.toLocaleDateString('es-ES', options);
};
