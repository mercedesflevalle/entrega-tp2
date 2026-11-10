import { useEffect, useState } from 'react';
import { getRepository } from '../data/repository.js';
export function friendlyError(error) {
  if (error.code === 'permission-denied') return 'No tenés permiso para guardar. Revisá la sesión y las reglas de Firestore.';
  if (error.code === 'auth/operation-not-allowed') return 'Habilitá el acceso anónimo en Firebase Authentication.';
  if (error.code === 'unavailable' || error.code === 'auth/network-request-failed') return 'No pudimos conectar. Revisá tu conexión e intentá de nuevo.';
  if (error.code) return `No se pudo completar la operación (${error.code}). Revisá la configuración y volvé a intentar.`;
  return error.message || 'Ocurrió un error. Volvé a intentar.';
}
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [repository, setRepository] = useState(null);
  useEffect(() => {
    let active = true;
    let unsubscribe;
    setLoading(true); setError(''); setRepository(null);
    getRepository().then(repo => {
      if (!active) return;
      setRepository(repo);
      unsubscribe = repo.subscribe(items => { if (active) { setTasks(items); setLoading(false); setError(''); } }, err => { if (active) { setError(friendlyError(err)); setLoading(false); setRepository(null); } });
    }).catch(err => { if (active) { setError(friendlyError(err)); setLoading(false); } });
    return () => { active = false; unsubscribe?.(); };
  }, [retry]);
  return { tasks, loading, error, repository, retry: () => setRetry(value => value + 1) };
}
