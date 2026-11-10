# Bitácora del TP

## Base preparada el 3 de noviembre de 2026

**Idea:** Entrega, un organizador de trabajos y parciales para estudiantes. Agrega contexto a un gestor de tareas mediante materias, fechas límite, prioridad, un resumen de avance y una vista de próximos siete días.

**Desarrollo realizado:** modelo y validaciones; repositorios separados para demo y Firebase; operaciones CRUD; pantalla React con componentes, formulario y filtros; mensajes de carga, éxito y error; estilos responsive; reglas por usuario; documentación de configuración e integración.

**Decisiones de diseño:** una acción principal para crear; tarjetas con materia antes del título; fechas y estados visibles; próxima entrega destacada; navegación por activas, semana y finalizadas. Paleta verde sobria, superficies claras y tipografía legible. Los estados incluyen texto. El listado usa tres columnas en escritorio ancho, dos en tamaños intermedios y una en celular.

**IA utilizada:** Codex, para leer la consigna, generar y revisar la base de React, separar los adaptadores de datos, preparar reglas y documentación. Instrucción del usuario: “Quiero que me prepares la base para mandarle y luego me hagas un doc con un resumen de lo que hiciste y los pasos a seguir.” No se generaron imágenes. Cada alumno debe revisar el código y poder explicar las operaciones del SDK antes de presentar.

**Verificación realizada:** seis tests de lógica y compilación de producción. La verificación visual por navegador y la integración con servicios reales quedan pendientes. La herramienta de navegador de la sesión no estaba disponible. El build inicial encontró una restricción de lectura del sandbox; se resolvió ejecutando la compilación con permiso para la herramienta, sin cambiar código de la aplicación.

**Alcance:** esta preparación es una base local y no acredita tres versiones publicadas. No existen todavía enlaces ni evidencias de una publicación real. Las etapas siguientes son trabajo por realizar y registrar.

## Versión 1 conectada por completar

- Crear proyecto Firebase, activar autenticación y publicar reglas.
- Configurar variables y verificar CRUD real con recarga.
- Crear GitHub y publicar Vercel.
- Anotar fecha, commit, URL del despliegue, resultado de pruebas y dificultades.
- Agregar capturas propias de escritorio, móvil y datos en Firebase, sin credenciales.

## Versión 2 con mejoras por completar

- Elegir una mejora comprobable: por ejemplo, agregar una vista de entregas vencidas o exportar las entregas a CSV.
- Registrar necesidad, cambios concretos y pruebas efectuadas.
- Commit y push; verificar nuevo build y comportamiento en Vercel.
- Agregar capturas comparables con la versión anterior y describir el cambio.

## Versión 3 final por completar

- Recoger una observación de uso real y corregirla; anotar qué cambió y por qué.
- Repetir validaciones, CRUD, recarga, permisos y revisión responsive.
- Registrar commit y despliegue final; completar informe y mini video.

## Registro para completar en cada iteración

Fecha:

Versión y commit:

Necesidad detectada:

Cambios de diseño o funcionalidad:

Uso de IA e instrucciones representativas:

Pruebas y resultados observados:

Dificultades y solución:

URL y estado del despliegue:

Capturas o evidencias:
