export const dataMode = import.meta.env.VITE_DATA_MODE || 'demo';
let pending;
// Una única inicialización, también bajo StrictMode. Un fallo no cambia silenciosamente a demo.
export function getRepository() {
  if (!pending) {
    pending = (async () => {
      if (dataMode === 'demo') return (await import('./demo.js')).createDemoRepository();
      if (dataMode === 'firebase') return (await import('./firebase.js')).createFirebaseRepository();
      throw new Error('VITE_DATA_MODE debe ser demo o firebase.');
    })();
    pending.catch(() => { pending = undefined; });
  }
  return pending;
}
