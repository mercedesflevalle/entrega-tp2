# Pruebas de aceptación

## Verificaciones automatizadas realizadas

`npm test`: seis pruebas de normalización de entradas, validaciones, fechas, búsqueda sin tildes, estados, prioridad y filtro semanal. `npm run build`: compilación para producción. Estas pruebas no verifican servicios externos ni reemplazan la revisión del navegador.

## Recorrido local y responsive pendiente de ejecutar en navegador

1. Iniciar en demo. Confirmar que el aviso explica el almacenamiento local.
2. Crear una entrega con título, materia y fecha; ver el aviso de éxito y la tarjeta. Rechazar campos vacíos o compuestos solo por espacios.
3. Editar título, notas, prioridad y fecha. Cambiar a En curso y luego Entregada; debe aparecer en esa vista y actualizar el resumen.
4. Buscar una materia con y sin tildes, filtrar y ordenar. Provocar una búsqueda sin resultados y limpiar los filtros.
5. Recargar: verificar que persiste en demo. Esto solo prueba localStorage.
6. Cancelar una eliminación y luego confirmar otra sobre un registro de prueba; verificar que desaparece.
7. Abrir y cerrar los diálogos con teclado; Tab debe permanecer en el diálogo, Escape debe cerrarlo cuando no está guardando y el foco debe regresar al control anterior.
8. Revisar 375, 768, 1024 y 1440 px: sin superposiciones ni scroll horizontal; probar títulos de 100 caracteres, materia de 60 y notas de 1000. En móvil revisar además el campo fecha y el teclado.
9. Bloquear el almacenamiento del navegador o la red y revisar que los errores no informan un guardado exitoso.

## Funciones agregadas en v2 y v3

1. Crear una entrega con 3 pasos; marcar uno desde la tarjeta: si estaba Pendiente pasa a En curso. Verificar el campo `steps` en Firestore.
2. Recargar: los pasos marcados siguen marcados.
3. Poner una fecha pasada: aparece en Vencidas, con contador en el menú y aviso arriba.
4. Exportar una entrega y toda la lista al calendario; abrir el .ics en Google Calendar o en el calendario del celular.
5. Revisar que dos entregas de la misma materia tengan el mismo color.

## Integración Firebase pendiente

1. Activar `firebase`, publicar reglas y habilitar sesión anónima. Confirmar que no se muestran ejemplos de demo.
2. Crear un registro de prueba y localizarlo en `users/{uid}/tasks` en la consola. Revisar datos y timestamps.
3. Recargar y comprobar que el mismo registro sigue disponible bajo la misma identidad.
4. Editar y cambiar estado. Verificar cada cambio en Firestore y en la app.
5. Abrir otra pestaña con la misma sesión: los cambios deben reflejarse por `onSnapshot`.
6. Eliminar el registro de prueba y verificar que desaparece de la base.
7. En un navegador privado, confirmar una identidad/lista diferente. Esa separación es el comportamiento esperado.
8. Con Rules Playground o Emulator Suite, probar: acceso sin autenticar denegado; usuario A no puede leer/escribir en la ruta B; propietario puede crear/leer/actualizar/eliminar registros válidos; campos extra, estados no válidos y cambios de `createdAt` denegados. Para escrituras con `serverTimestamp`, preferir el SDK contra el emulador.
9. Probar una configuración incompleta y reglas que denieguen la operación en un proyecto de prueba. Debe verse un error y nunca cambiarse automáticamente a demo.

## Producción Vercel pendiente

Repetir el CRUD y la recarga desde la URL real, desde computadora y celular. Verificar que la etiqueta sea Firebase. Hacer una mejora, push, comprobar build exitoso y que la URL muestre el cambio. Guardar capturas con fecha y una descripción del resultado en la bitácora. No usar la compilación local como evidencia de producción.
