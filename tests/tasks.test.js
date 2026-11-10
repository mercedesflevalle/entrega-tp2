import test from 'node:test';
import assert from 'node:assert/strict';
import { daysUntil, localDate, selectTasks, validateTask } from '../src/domain/tasks.js';
const task = { title: '  Parcial  ', subject: ' Matemática ', dueDate: '2026-11-13', priority: 'alta', status: 'pendiente', notes: '  Repasar  ' };
test('normaliza los campos y excluye información ajena al modelo', () => {
  assert.deepEqual(validateTask({ ...task, id: 'x' }), { ...task, title: 'Parcial', subject: 'Matemática', notes: 'Repasar' });
});
test('rechaza fechas inexistentes, campos vacíos y estados o prioridades inválidos', () => {
  for (const patch of [{ title: '  ' }, { subject: '' }, { dueDate: '2026-02-30' }, { dueDate: '' }, { status: 'otro' }, { priority: 'urgente' }, { notes: 'x'.repeat(1001) }]) assert.throws(() => validateTask({ ...task, ...patch }));
});
test('calcula los días sin depender del horario de verano', () => {
  assert.equal(daysUntil('2026-11-13', '2026-11-03'), 10);
  assert.equal(daysUntil('2026-11-02', '2026-11-03'), -1);
});
test('buscar ignora tildes y mayúsculas y filtra las entregadas', () => {
  const tasks = [{ ...task, id: 'a' }, { ...task, id: 'b', status: 'entregada' }];
  assert.deepEqual(selectTasks(tasks, { search: 'matematica' }).map(item => item.id), ['a']);
  assert.deepEqual(selectTasks(tasks, { view: 'entregadas' }).map(item => item.id), ['b']);
});
test('prioridad alta primero y no modifica el array original', () => {
  const tasks = [{ ...task, id: 'normal', priority: 'normal' }, { ...task, id: 'alta' }];
  assert.equal(selectTasks(tasks, { sort: 'prioridad' })[0].id, 'alta');
  assert.equal(tasks[0].id, 'normal');
});
test('próximos siete días excluye vencidas y finalizadas', () => {
  const today = localDate();
  assert.deepEqual(selectTasks([{ ...task, dueDate: today, id: 'hoy' }, { ...task, dueDate: '2000-01-01', id: 'vieja' }, { ...task, dueDate: today, id: 'lista', status: 'entregada' }], { view: 'semana' }).map(item => item.id), ['hoy']);
});
