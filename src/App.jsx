import { useEffect, useRef, useState } from 'react';
import { AlarmClock, ArrowDownWideNarrow, CalendarPlus, ArrowUpRight, BookOpen, CalendarDays, Check, CheckCheck, ChevronRight, CircleHelp, ClipboardList, GraduationCap, LayoutGrid, Plus, Search, UserRound, X } from 'lucide-react';
import TaskForm from './components/TaskForm.jsx';
import TaskCard from './components/TaskCard.jsx';
import { dataMode } from './data/repository.js';
import { daysUntil, isOverdue, selectTasks, validateTask } from './domain/tasks.js';
import { downloadIcs } from './domain/calendar.js';
import { subjectColor } from './domain/subjects.js';
import { friendlyError, useTasks } from './hooks/useTasks.js';
import { APP_VERSION } from './version.js';

const views = [{ id: 'activas', label: 'Mis entregas', icon: LayoutGrid }, { id: 'semana', label: 'Próximos 7 días', icon: CalendarDays }, { id: 'vencidas', label: 'Vencidas', icon: AlarmClock }, { id: 'entregadas', label: 'Entregadas', icon: CheckCheck }, { id: 'todas', label: 'Todas', icon: ClipboardList }];
export default function App() {
  const { tasks, loading, error, repository, retry } = useTasks();
  const [view, setView] = useState('activas');
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [sort, setSort] = useState('fecha');
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [help, setHelp] = useState(false);
  const busyRef = useRef(false);
  const previousFocus = useRef(null);
  const deleteDialog = useRef(null);
  const helpDialog = useRef(null);
  const subjects = [...new Set(tasks.map(task => task.subject))].sort((a, b) => a.localeCompare(b, 'es'));
  const active = tasks.filter(task => task.status !== 'entregada');
  const done = tasks.length - active.length;
  const overdue = active.filter(task => isOverdue(task));
  const next = [...active].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const visible = selectTasks(tasks, { view, search, subject, sort });
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  useEffect(() => { if (toDelete) deleteDialog.current.showModal(); }, [toDelete]);
  useEffect(() => { if (help) helpDialog.current.showModal(); }, [help]);
  useEffect(() => { if (notice && !notice.error) { const timer = setTimeout(() => setNotice(null), 5000); return () => clearTimeout(timer); } }, [notice]);
  useEffect(() => { if (!form && !toDelete && !help) previousFocus.current?.focus(); }, [form, toDelete, help]);
  function openModal(setter, value) { previousFocus.current = document.activeElement; setter(value); }
  async function mutate(operation, message) {
    if (busyRef.current || !repository) return false;
    busyRef.current = true; setBusy(true); setNotice(null);
    try { await operation(); setNotice({ text: message }); return true; }
    catch (err) { setNotice({ text: friendlyError(err), error: true }); return false; }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function save(task) {
    const success = await mutate(() => form.task ? repository.update(form.task.id, task) : repository.add(task), form.task ? 'Entrega actualizada.' : 'Entrega creada.');
    if (success) setForm(null);
    else throw new Error('No se pudo guardar. Revisá el aviso e intentá de nuevo.');
  }
  // Marcar un paso actualiza el documento en Firestore; si la entrega estaba pendiente, pasa a En curso.
  async function toggleStep(task, index) {
    const steps = task.steps.map((step, i) => i === index ? { ...step, done: !step.done } : step);
    const status = task.status === 'pendiente' && steps.some(step => step.done) ? 'en-curso' : task.status;
    await mutate(() => repository.update(task.id, validateTask({ ...task, steps, status })), status !== task.status ? 'Paso guardado. La entrega pasó a En curso.' : 'Paso guardado.');
  }
  async function changeStatus(task, status) { await mutate(() => repository.update(task.id, validateTask({ ...task, status })), 'Estado actualizado.'); }
  const ready = !loading && !!repository;
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#main" aria-label="Entrega, ir al contenido"><span className="brand-symbol"><Check size={23} strokeWidth={3} /></span>entrega<span className="brand-dot">.</span></a>
      <div className="workspace"><span className="workspace-icon"><GraduationCap size={21} /></span><div><strong>Mi cursada</strong><span>Espacio personal</span></div></div>
      <p className="nav-label">ORGANIZACIÓN</p>
      <nav aria-label="Entregas">{views.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${view === id ? 'selected' : ''}`} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}><Icon size={19} /><span>{label}</span>{id === 'activas' && <span className="nav-count">{active.length}</span>}{id === 'vencidas' && overdue.length > 0 && <span className="nav-count alert">{overdue.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="study-note"><BookOpen size={24} /><p>Una entrega a la vez.</p><span>Hacé lugar para lo que sigue.</span></div><button className="nav-item" onClick={() => openModal(setHelp, true)}><CircleHelp size={19} /><span>Acerca de Entrega</span></button><div className="profile"><span><UserRound size={17} /></span><div><strong>Mi espacio</strong><small>{dataMode === 'demo' ? 'Demostración local' : 'Sesión anónima'}</small></div></div></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb">Mi cursada<ChevronRight size={14} /><strong>{views.find(item => item.id === view).label}</strong></div><span className={`connection ${dataMode === 'demo' ? 'demo' : ''}`}><span />{dataMode === 'demo' ? 'Modo demo' : error ? 'Sin conexión' : loading ? 'Conectando…' : 'Firebase'}</span></header>
      <main id="main">
        {dataMode === 'demo' && <div className="demo-banner"><span>Estás en modo demo. Los datos se guardan solo en este navegador.</span><button onClick={() => openModal(setHelp, true)}>Ver detalles<ArrowUpRight size={14} /></button></div>}
        <div className="page-heading"><div><p className="eyebrow">TU CURSADA, EN ORDEN</p><h1>{view === 'activas' ? 'Mis entregas' : views.find(item => item.id === view).label}</h1><p>Menos pendientes en la cabeza. Más espacio para crear.</p></div><button className="button primary" disabled={!ready || busy} onClick={() => openModal(setForm, { task: null })}><Plus size={19} />Nueva entrega</button></div>
        <section className="overview" aria-label="Resumen de cursada">
          <div className="metric"><span>Por entregar<ClipboardList size={18} /></span><strong>{loading || error ? '—' : active.length.toString().padStart(2, '0')}</strong><small>{overdue.length ? `${overdue.length} fuera de fecha` : 'Seguí a tu ritmo'}</small></div>
          <div className="metric"><span>En curso<ArrowUpRight size={18} /></span><strong>{loading || error ? '—' : active.filter(task => task.status === 'en-curso').length.toString().padStart(2, '0')}</strong><small>Ideas en movimiento</small></div>
          <div className="metric progress-metric"><span>Tu avance<CheckCheck size={18} /></span><div><strong>{loading || error ? '—' : `${progress}%`}</strong><small>{done} de {tasks.length} entregadas</small></div><progress max="100" value={progress} aria-label="Porcentaje de entregas finalizadas" /></div>
        </section>
        {overdue.length > 0 && !error && !loading && view !== 'vencidas' && <button className="overdue-banner" onClick={() => setView('vencidas')}><AlarmClock size={18} /><span><strong>{overdue.length === 1 ? 'Tenés 1 entrega vencida.' : `Tenés ${overdue.length} entregas vencidas.`}</strong> Revisalas y actualizá la fecha o el estado.</span><ArrowUpRight size={16} /></button>}
        {next && !error && !loading && <section className="next-up" aria-label="Próxima entrega"><span className="next-icon"><CalendarDays size={21} /></span><div><p>PRÓXIMA EN TU LISTA</p><strong>{next.title}</strong><span><i className="dot" style={{ background: subjectColor(next.subject).stripe }} />{next.subject} · {new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' }).format(new Date(`${next.dueDate}T12:00:00`))}</span></div><span className={`countdown ${daysUntil(next.dueDate) <= 1 ? 'hot' : ''}`}>{daysUntil(next.dueDate) < 0 ? <><b>{Math.abs(daysUntil(next.dueDate))}</b>{Math.abs(daysUntil(next.dueDate)) === 1 ? 'día tarde' : 'días tarde'}</> : daysUntil(next.dueDate) === 0 ? <><b>Hoy</b>vence</> : <><b>{daysUntil(next.dueDate)}</b>{daysUntil(next.dueDate) === 1 ? 'día' : 'días'}</>}</span><button className="text-button" disabled={!ready || busy} onClick={() => openModal(setForm, { task: next })}>Ver entrega<ArrowUpRight size={17} /></button></section>}
        <section className="tasks-section" aria-labelledby="list-heading">
          <div className="section-heading"><h2 id="list-heading">{view === 'activas' ? 'Todo lo que viene' : 'Tus entregas'}<span>{visible.length}</span></h2><span className="section-caption">Cada avance cuenta.</span></div>
          <div className="toolbar"><label className="search"><Search size={18} /><span className="sr-only">Buscar por título o materia</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar una entrega…" /></label><label className="filter"><span className="sr-only">Filtrar por materia</span><select value={subject} onChange={event => setSubject(event.target.value)}><option value="">Todas las materias</option>{subjects.map(item => <option key={item}>{item}</option>)}</select></label><label className="filter sort"><ArrowDownWideNarrow size={17} /><span className="sr-only">Ordenar entregas</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="fecha">Por fecha</option><option value="prioridad">Por prioridad</option></select></label><button className="button secondary export" disabled={!visible.some(task => task.status !== 'entregada')} onClick={() => { downloadIcs(visible.filter(task => task.status !== 'entregada'), 'mis-entregas.ics'); setNotice({ text: 'Calendario descargado. Abrilo para sumarlo a tu agenda.' }); }} title="Descargar las entregas visibles como archivo de calendario"><CalendarPlus size={17} /><span>Exportar al calendario</span></button></div>
          {loading ? <div className="empty" role="status"><span className="spinner" /><h3>Cargando tus entregas…</h3></div> : error ? <div className="empty error-state" role="alert"><CircleHelp size={28} /><h3>No pudimos cargar tus entregas</h3><p>{error}</p><button className="button secondary" onClick={retry}>Volver a intentar</button></div> : visible.length ? <div className="task-grid" aria-busy={busy}>{visible.map(task => <TaskCard key={task.id} task={task} busy={busy || !ready} onEdit={task => openModal(setForm, { task })} onStatus={changeStatus} onToggleStep={toggleStep} onDelete={task => openModal(setToDelete, task)} />)}</div> : <div className="empty"><CheckCheck size={32} /><h3>{search || subject ? 'No encontramos coincidencias' : view === 'entregadas' ? 'Acá van tus próximos logros' : view === 'vencidas' ? 'Nada vencido. ¡Bien ahí!' : 'Todo despejado por acá'}</h3><p>{search || subject ? 'Probá con otro título o cambiá los filtros.' : view === 'entregadas' ? 'Marcá una entrega como entregada para verla acá.' : 'Sumá una entrega para empezar a organizarte.'}</p>{search || subject ? <button className="button secondary" onClick={() => { setSearch(''); setSubject(''); }}>Limpiar filtros</button> : <button className="button secondary" disabled={!ready || busy} onClick={() => openModal(setForm, { task: null })}>Nueva entrega</button>}</div>}
        </section>
        <footer>Hecho para llegar con más calma.<span>Entrega · Organizador de cursada · v{APP_VERSION}</span></footer>
      </main>
    </div>
    {notice && <div className={`toast ${notice.error ? 'toast-error' : ''}`} role={notice.error ? 'alert' : 'status'}><span>{notice.text}</span><button aria-label="Cerrar aviso" onClick={() => setNotice(null)}><X size={18} /></button></div>}
    {form && <TaskForm task={form.task} subjects={subjects} busy={busy} onSave={save} onClose={() => setForm(null)} />}
    {toDelete && <dialog ref={deleteDialog} onCancel={event => { event.preventDefault(); if (!busy) setToDelete(null); }} aria-labelledby="delete-title"><div className="confirm-content"><h2 id="delete-title">¿Eliminar esta entrega?</h2><p>Se eliminará “{toDelete.title}”. Esta acción no se puede deshacer.</p><div className="dialog-actions"><button className="button secondary" disabled={busy} onClick={() => setToDelete(null)}>Cancelar</button><button className="button destructive" disabled={busy} onClick={async () => { if (await mutate(() => repository.remove(toDelete.id), 'Entrega eliminada.')) setToDelete(null); }}>{busy ? 'Eliminando…' : 'Eliminar entrega'}</button></div></div></dialog>}
    {help && <dialog ref={helpDialog} onCancel={() => setHelp(false)} aria-labelledby="help-title"><div className="confirm-content"><div className="dialog-heading"><h2 id="help-title">Acerca de Entrega</h2><button className="icon-button" aria-label="Cerrar información" onClick={() => setHelp(false)}><X size={20} /></button></div><p>Organizá trabajos y parciales por materia, fecha, prioridad y estado.</p><p>{dataMode === 'demo' ? 'El modo demo incluye ejemplos ficticios. Los cambios se guardan en este navegador y no se envían a Firebase. Si borrás los datos del sitio, se pierde esta lista.' : 'Tus entregas se guardan en Firebase con una identidad anónima de este navegador. Otro dispositivo tendrá una lista diferente. Si borrás la sesión del sitio, podés perder el acceso a esta lista.'}</p><button className="button primary" onClick={() => setHelp(false)}>Entendido</button></div></dialog>}
  </div>;
}
