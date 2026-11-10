// Genera un archivo .ics (estándar iCalendar) que se puede importar en Google Calendar, Apple o Outlook.
const escape = text => String(text).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const compact = date => date.replaceAll('-', '');
function nextDay(date) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}
export function buildIcs(tasks, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const events = tasks.map(task => [
    'BEGIN:VEVENT',
    `UID:${task.id}@entrega`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(task.dueDate)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(task.dueDate))}`,
    `SUMMARY:${escape(`Entrega: ${task.title} (${task.subject})`)}`,
    ...(task.notes ? [`DESCRIPTION:${escape(task.notes)}`] : []),
    'END:VEVENT'
  ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Entrega//Organizador de cursada//ES', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n');
}
export function downloadIcs(tasks, filename) {
  const url = URL.createObjectURL(new Blob([buildIcs(tasks)], { type: 'text/calendar;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
