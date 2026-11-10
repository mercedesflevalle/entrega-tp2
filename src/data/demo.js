import { localDate } from '../domain/tasks.js';
const KEY = 'entrega-demo-v2';
function dateIn(days) { const date = new Date(); date.setDate(date.getDate() + days); return localDate(date); }
function initialTasks() {
  return [
    { id: 'demo-1', title: 'TP 2 · Aplicación en React', subject: 'Desarrollo Frontend II', dueDate: dateIn(3), priority: 'alta', status: 'en-curso', notes: 'Revisar componentes, conectar Firebase y preparar la demostración.', steps: [{ text: 'Crear proyecto en Firebase', done: true }, { text: 'Subir a GitHub', done: false }, { text: 'Publicar en Vercel', done: false }, { text: 'Grabar el mini video', done: false }] },
    { id: 'demo-2', title: 'Sistema de identidad visual', subject: 'Diseño Visual', dueDate: dateIn(5), priority: 'normal', status: 'pendiente', notes: 'Preparar las aplicaciones de marca y el manual.' },
    { id: 'demo-3', title: 'Prototipo de navegación', subject: 'Experiencia de Usuario', dueDate: dateIn(7), priority: 'alta', status: 'en-curso', notes: 'Probar el recorrido principal en una pantalla pequeña.' },
    { id: 'demo-4', title: 'Lectura y síntesis de la unidad 4', subject: 'Comunicación', dueDate: dateIn(12), priority: 'normal', status: 'pendiente', notes: '' },
    { id: 'demo-6', title: 'Moodboard de referencias', subject: 'Diseño Visual', dueDate: dateIn(-1), priority: 'alta', status: 'pendiente', notes: 'Se pasó la fecha: pedir prórroga.' },
    { id: 'demo-5', title: 'Análisis de una interfaz', subject: 'Experiencia de Usuario', dueDate: dateIn(-2), priority: 'normal', status: 'entregada', notes: 'Trabajo de ejemplo finalizado.' }
  ].map(task => ({ ...task, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
}
// Solo es una demostración local. No sustituye la persistencia de Firestore exigida por el TP.
export function createDemoRepository() {
  let tasks;
  const listeners = new Set();
  const read = () => {
    if (tasks) return tasks;
    const raw = localStorage.getItem(KEY);
    tasks = raw ? JSON.parse(raw) : initialTasks();
    if (!Array.isArray(tasks)) throw new Error('Los datos de demo no son válidos. Borrá la clave entrega-demo-v1 del almacenamiento del sitio.');
    return tasks;
  };
  const save = next => {
    localStorage.setItem(KEY, JSON.stringify(next));
    tasks = next;
    listeners.forEach(listener => listener([...tasks]));
  };
  return {
    subscribe(onData, onError) {
      const sync = event => { if (event.key === KEY) { try { tasks = undefined; onData([...read()]); } catch (error) { onError(error); } } };
      try { onData([...read()]); listeners.add(onData); window.addEventListener('storage', sync); } catch (error) { onError(error); }
      return () => { listeners.delete(onData); window.removeEventListener('storage', sync); };
    },
    async add(task) { save([...read(), { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]); },
    async update(id, task) { save(read().map(item => item.id === id ? { ...item, ...task, updatedAt: new Date().toISOString() } : item)); },
    async remove(id) { save(read().filter(item => item.id !== id)); }
  };
}
