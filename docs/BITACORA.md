# Bitácora del TP 2 · Entrega

> Los campos marcados como **[COMPLETAR]** se llenan con datos reales: fechas, links, capturas y resultados de las pruebas.

## Idea inicial

**Necesidad:** en la facultad las entregas se acumulan en distintas materias y cada TP tiene varias partes. Las apps de tareas genéricas no muestran cuánto falta para cada entrega ni cuánto avancé dentro de un mismo trabajo.

**Público:** estudiantes universitarios, en especial de carreras de diseño, que manejan varios TPs, parciales y proyectos en paralelo.

**Qué se guarda:** cada entrega con título, materia, fecha límite, prioridad, estado, notas y pasos. Ruta en Firestore: `users/{uid}/tasks/{taskId}`.

**Vuelta de tuerca respecto de un gestor de tareas común:** la unidad no es la tarea suelta sino la entrega, con su materia, su fecha y una checklist interna de pasos. Se suma la lectura de urgencia (vencidas, vence hoy o mañana, cuenta regresiva) y la exportación al calendario.

---

## Versión 1 · Base funcional conectada a Firebase

**Fecha:** [COMPLETAR] · **Commit:** "V1: versión visible en el pie…" · **URL:** [COMPLETAR]

**Qué tiene:** alta, edición, cambio de estado y borrado de entregas en Firestore; búsqueda sin tildes; filtro por materia; orden por fecha o prioridad; vistas Mis entregas, Próximos 7 días, Entregadas y Todas; resumen de avance; próxima entrega destacada; mensajes de carga, éxito y error; confirmación antes de eliminar; diseño responsive.

**Cambios respecto de la base generada con IA:** se reemplazaron las iniciales de plantilla del perfil por un ícono (la sesión es anónima, no hay nombre real) y se agregó el número de versión en el pie para poder comprobar en Vercel qué versión está publicada.

**Decisiones de diseño:** paleta verde sobria, porque la app tiene que bajar la ansiedad de la cursada y no sumar ruido. Una sola acción principal ("Nueva entrega"). La materia aparece antes del título porque es como los estudiantes agrupan mentalmente sus pendientes. Los estados siempre llevan texto: no dependen solo del color.

**Pruebas:** [COMPLETAR: crear, recargar, editar, borrar y verificar cada cambio en Firestore → Data. Probar en el celular.]

**Dificultades y solución:** [COMPLETAR: por ejemplo, variables de entorno, dominio autorizado en Firebase Auth, Root Directory en Vercel.]

**Capturas:** [COMPLETAR: escritorio, celular, documento en Firestore, deploy en Vercel.]

---

## Versión 2 · Pasos dentro de cada entrega y vencidas

**Fecha:** [COMPLETAR] · **Commit:** "V2: pasos por entrega guardados en Firestore…" · **URL:** [COMPLETAR]

**Necesidad detectada:** probando la V1 con mis propias entregas, el estado "En curso" decía poco: un TP grande puede estar "en curso" durante semanas. También, una entrega con la fecha pasada quedaba mezclada con las demás y era fácil no verla.

**Cambios de funcionalidad:**
- Checklist de pasos dentro de cada entrega (hasta 15), editable desde el formulario y marcable desde la tarjeta. Se guarda en Firestore en el campo `steps`.
- Al marcar el primer paso de una entrega pendiente, pasa sola a "En curso".
- Nueva vista "Vencidas", contador en el menú y aviso arriba de la lista.

**Cambios de diseño:** barra de progreso de pasos en la tarjeta, plegable para que la grilla no crezca de más. Las tarjetas dejaron de estirarse a la altura de la vecina. El rojo apagado se usa solo para lo vencido.

**Cambio en Firebase:** se actualizaron las reglas para aceptar el campo `steps` (lista de hasta 15 elementos) y se volvieron a publicar en la consola de Firebase. Sin ese paso, guardar una entrega con pasos devolvía "permiso denegado".

**Pruebas:** [COMPLETAR: crear una entrega con pasos, marcar uno, recargar, verificar `steps` en Firestore; poner una fecha pasada y verla en Vencidas.]

**Dificultades y solución:** [COMPLETAR]

**Capturas:** [COMPLETAR: antes/después de la tarjeta con pasos y la vista Vencidas.]

---

## Versión 3 · Lectura rápida por materia y calendario

**Fecha:** [COMPLETAR] · **Commit:** "V3: color por materia, exportar al calendario…" · **URL:** [COMPLETAR]

**Necesidad detectada:** con varias entregas, todas las tarjetas se veían iguales y había que leer cada etiqueta para saber de qué materia eran. Además, los estudiantes ya usan Google Calendar o el calendario del celular y no quieren cargar las fechas dos veces.

**Cambios de diseño:**
- Cada materia tiene un color propio, siempre el mismo (se calcula a partir del nombre). Se ve en la etiqueta y en un borde lateral de la tarjeta, para escanear la lista sin leer.
- Se excluyó el rojo de la paleta de materias: en una primera prueba "Comunicación" quedó roja y se confundía con una entrega vencida.
- La próxima entrega muestra una cuenta regresiva grande ("3 días", "Hoy vence", "1 día tarde").
- Las entregas que vencen hoy o mañana tienen un contorno cálido que las separa del resto.

**Cambios de funcionalidad:** exportar al calendario (.ics) una entrega desde su tarjeta o todas las entregas activas visibles desde la barra de filtros.

**Pruebas:** [COMPLETAR: importar el .ics en Google Calendar; revisar que dos entregas de la misma materia tengan el mismo color; repetir CRUD y recarga desde la URL final.]

**Dificultades y solución:** [COMPLETAR]

**Capturas:** [COMPLETAR: comparación V1 / V2 / V3 de la pantalla principal.]

---

## Uso de IA

- **Codex:** generó la base del proyecto a partir de la consigna (estructura de componentes, adaptador de Firebase, reglas y documentación).
- **Claude:** revisó qué faltaba respecto de la consigna, propuso y programó las mejoras de V2 y V3, y ayudó con la documentación.

Instrucciones representativas:
- "Tengo que hacer este TP 2 para la materia Frontend 2. Tengo una base del TP pero no sé qué faltaría."
- [COMPLETAR con tus pedidos: por ejemplo, ajustes de color, errores de Firebase o Vercel que le pasaste a la IA.]

Todo el código se revisó y se probó en el navegador antes de publicarlo.
