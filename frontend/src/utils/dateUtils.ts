function getCurrentWeekRange(): { startOfWeek: Date; endOfWeek: Date } {
  const now = new Date();
  const day = now.getDay(); // Chủ nhật = 0, Thứ hai = 1, ...
  const diffToMonday = day === 0 ? -6 : 1 - day; // Nếu CN thì lùi 6 ngày
  const diffToSunday = day === 0 ? 0 : 7 - day;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + diffToSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "--"; // check invalid date
  return d.toLocaleDateString('en-GB'); // "DD/MM/YYYY"
}

export function getDuration (endDate: Date): number {
  const duration = Date.now() - endDate.getTime()
  return duration / (1000 * 3600 * 24)
}

export function formatTime(time: string|undefined): string {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
