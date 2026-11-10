import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export async function createFirebaseRepository() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  if (Object.values(config).some(value => !value?.trim())) throw new Error('Falta completar la configuración de Firebase. Revisá las cuatro variables de .env y reiniciá Vite.');
  const app = initializeApp(config);
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  await auth.authStateReady();
  const user = auth.currentUser || (await signInAnonymously(auth)).user;
  const db = getFirestore(app);
  // Cada visitante solo puede acceder a su propia subcolección, según firestore.rules.
  const tasks = collection(db, 'users', user.uid, 'tasks');
  return {
    subscribe(onData, onError) { return onSnapshot(tasks, snapshot => onData(snapshot.docs.map(item => ({ ...item.data(), id: item.id }))), onError); },
    async add(task) { await addDoc(tasks, { ...task, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); },
    async update(id, task) { await updateDoc(doc(tasks, id), { ...task, updatedAt: serverTimestamp() }); },
    async remove(id) { await deleteDoc(doc(tasks, id)); }
  };
}
