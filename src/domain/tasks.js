export const STATUSES = { pendiente: 'Pendiente', 'en-curso': 'En curso', entregada: 'Entregada' };
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function daysUntil(date, today = localDate()) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
export function validateTask(input) {
  const task = { title: input.title.trim(), subject: input.subject.trim(), dueDate: input.dueDate, priority: input.priority, status: input.status, notes: input.notes.trim() };
  if (!task.title || task.title.length > 100) throw new Error('El título debe tener entre 1 y 100 caracteres.');
  if (!task.subject || task.subject.length > 60) throw new Error('La materia debe tener entre 1 y 60 caracteres.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) || !Number.isFinite(Date.parse(task.dueDate)) || new Date(`${task.dueDate}T12:00:00Z`).toISOString().slice(0, 10) !== task.dueDate) throw new Error('Ingresá una fecha válida.');
  if (!['normal', 'alta'].includes(task.priority) || !Object.hasOwn(STATUSES, task.status)) throw new Error('Revisá el estado y la prioridad.');
  if (task.notes.length > 1000) throw new Error('Las notas pueden tener hasta 1000 caracteres.');
  return task;
}
export function selectTasks(tasks, { search = '', subject = '', view = 'activas', sort = 'fecha' } = {}) {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return tasks.filter(task => {
    const days = daysUntil(task.dueDate);
    const active = task.status !== 'entregada';
    return (!subject || task.subject === subject)
      && normalize(`${task.title} ${task.subject}`).includes(normalize(search))
      && (view === 'todas' || (view === 'activas' && active) || (view === 'semana' && active && days >= 0 && days <= 7) || (view === 'entregadas' && !active));
  }).sort((a, b) => sort === 'prioridad' && a.priority !== b.priority ? (a.priority === 'alta' ? -1 : 1) : a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title, 'es'));
}
