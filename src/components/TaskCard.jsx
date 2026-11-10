import { useState } from 'react';
import { CalendarDays, Check, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { daysUntil, STATUSES, stepProgress } from '../domain/tasks.js';
export default function TaskCard({ task, busy, onEdit, onStatus, onDelete, onToggleStep }) {
  const [open, setOpen] = useState(false);
  const days = daysUntil(task.dueDate);
  const done = task.status === 'entregada';
  const overdue = !done && days < 0;
  const progress = stepProgress(task);
  const urgency = done ? 'Finalizada' : days < 0 ? `Vencida hace ${Math.abs(days)} d` : days === 0 ? 'Vence hoy' : days === 1 ? 'Vence mañana' : `En ${days} días`;
  return <article className={`task-card ${done ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
    <div className="card-top"><span className="subject-label">{task.subject}</span>{task.priority === 'alta' && <span className="priority"><span />Alta prioridad</span>}</div>
    <h3>{task.title}</h3>
    <p className={`task-notes ${!task.notes ? 'no-notes' : ''}`}>{task.notes || 'Sin notas adicionales.'}</p>
    {progress.total > 0 && <div className="steps">
      <button type="button" className="steps-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{progress.done} de {progress.total} pasos</span>
        <span className="steps-bar" aria-hidden="true"><span style={{ width: `${progress.done / progress.total * 100}%` }} /></span>
        <ChevronDown size={16} className={open ? 'rotated' : ''} />
      </button>
      {open && <ul>{task.steps.map((step, index) => <li key={index}><label className={step.done ? 'step-done' : ''}><input type="checkbox" checked={step.done} disabled={busy} onChange={() => onToggleStep(task, index)} /><span className="check-box" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>{step.text}</label></li>)}</ul>}
    </div>}
    <div className="due"><CalendarDays size={16} /><time dateTime={task.dueDate}>{new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(new Date(`${task.dueDate}T12:00:00`))}</time><span className={days <= 1 && !done ? 'urgent' : ''}>{urgency}</span></div>
    <div className="card-bottom"><label className={`status-control ${task.status}`}><span className="sr-only">Estado de {task.title}</span><select aria-label={`Estado de ${task.title}`} value={task.status} disabled={busy} onChange={event => onStatus(task, event.target.value)}>{Object.entries(STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><div className="card-tools"><button className="icon-button" title="Editar entrega" aria-label={`Editar ${task.title}`} disabled={busy} onClick={() => onEdit(task)}><Pencil size={16} /></button><button className="icon-button danger" title="Eliminar entrega" aria-label={`Eliminar ${task.title}`} disabled={busy} onClick={() => onDelete(task)}><Trash2 size={16} /></button></div></div>
  </article>;
}
