import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { localDate, STATUSES, validateTask } from '../domain/tasks.js';
export default function TaskForm({ task, subjects, busy, onSave, onClose }) {
  const dialog = useRef(null);
  const [error, setError] = useState('');
  const [values, setValues] = useState(task || { title: '', subject: '', dueDate: localDate(), priority: 'normal', status: 'pendiente', notes: '' });
  useEffect(() => { dialog.current.showModal(); }, []);
  const field = name => ({ value: values[name], onChange: event => setValues({ ...values, [name]: event.target.value }) });
  async function submit(event) {
    event.preventDefault(); setError('');
    try { await onSave(validateTask(values)); } catch (err) { setError(err.message); }
  }
  return <dialog ref={dialog} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} aria-labelledby="form-title">
    <form onSubmit={submit}>
      <div className="dialog-heading"><div><p className="eyebrow">TU CURSADA</p><h2 id="form-title">{task ? 'Editar entrega' : 'Nueva entrega'}</h2></div><button type="button" className="icon-button" onClick={onClose} disabled={busy} aria-label="Cerrar formulario"><X size={21} /></button></div>
      <fieldset disabled={busy}>
        <label>Título<input {...field('title')} required maxLength={100} autoFocus placeholder="Ej. TP 3 · Prototipo interactivo" /></label>
        <label>Materia<input {...field('subject')} list="subjects" required maxLength={60} placeholder="Ej. Experiencia de Usuario" /><datalist id="subjects">{subjects.map(subject => <option key={subject} value={subject} />)}</datalist></label>
        <div className="form-grid"><label>Fecha de entrega<input {...field('dueDate')} type="date" required /></label><label>Prioridad<select {...field('priority')}><option value="normal">Normal</option><option value="alta">Alta</option></select></label></div>
        <label>Estado<select {...field('status')}>{Object.entries(STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>Notas <span className="optional">Opcional</span><textarea {...field('notes')} rows={3} maxLength={1000} placeholder="Qué te falta, qué necesitás recordar…" /></label>
      </fieldset>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button secondary" onClick={onClose} disabled={busy}>Cancelar</button><button className="button primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar entrega'}</button></div>
    </form>
  </dialog>;
}
