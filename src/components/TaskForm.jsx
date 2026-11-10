import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { localDate, MAX_STEPS, STATUSES, validateTask } from '../domain/tasks.js';
export default function TaskForm({ task, subjects, busy, onSave, onClose }) {
  const dialog = useRef(null);
  const [error, setError] = useState('');
  const [values, setValues] = useState(task ? { ...task, steps: task.steps || [] } : { title: '', subject: '', dueDate: localDate(), priority: 'normal', status: 'pendiente', notes: '', steps: [] });
  const [newStep, setNewStep] = useState('');
  useEffect(() => { dialog.current.showModal(); }, []);
  const field = name => ({ value: values[name], onChange: event => setValues({ ...values, [name]: event.target.value }) });
  function addStep() {
    const text = newStep.trim();
    if (!text) return;
    if (values.steps.length >= MAX_STEPS) { setError(`Podés cargar hasta ${MAX_STEPS} pasos por entrega.`); return; }
    setValues({ ...values, steps: [...values.steps, { text, done: false }] }); setNewStep(''); setError('');
  }
  const setStep = (index, patch) => setValues({ ...values, steps: values.steps.map((step, i) => i === index ? { ...step, ...patch } : step) });
  const removeStep = index => setValues({ ...values, steps: values.steps.filter((_, i) => i !== index) });
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
        <div className="steps-editor">
          <span className="steps-label">Pasos <span className="optional">Opcional · dividí la entrega en partes chicas</span></span>
          {values.steps.length > 0 && <ul>{values.steps.map((step, index) => <li key={index}><input type="checkbox" checked={step.done} onChange={event => setStep(index, { done: event.target.checked })} aria-label={`Marcar paso ${index + 1} como hecho`} /><input value={step.text} maxLength={80} onChange={event => setStep(index, { text: event.target.value })} aria-label={`Texto del paso ${index + 1}`} /><button type="button" className="icon-button" onClick={() => removeStep(index)} aria-label={`Quitar paso ${index + 1}`}><X size={16} /></button></li>)}</ul>}
          <div className="step-add"><input value={newStep} maxLength={80} onChange={event => setNewStep(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addStep(); } }} placeholder="Ej. Investigar referentes" aria-label="Nuevo paso" /><button type="button" className="button secondary" onClick={addStep} disabled={!newStep.trim()}><Plus size={16} />Agregar</button></div>
        </div>
        <label>Notas <span className="optional">Opcional</span><textarea {...field('notes')} rows={3} maxLength={1000} placeholder="Qué te falta, qué necesitás recordar…" /></label>
      </fieldset>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button secondary" onClick={onClose} disabled={busy}>Cancelar</button><button className="button primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar entrega'}</button></div>
    </form>
  </dialog>;
}
