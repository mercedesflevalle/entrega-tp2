# Entrega

Base del TP 2 de Desarrollo Frontend II. Organizador de trabajos, parciales y proyectos para estudiantes: materia, fecha límite, prioridad, notas y tres estados. React + Vite; integración preparada con Firebase Authentication anónima y Cloud Firestore.

## Empezar

Requiere Node.js 22.12 o superior y npm. Abrir una terminal **dentro de esta carpeta**, donde está `package.json`:

```sh
npm install
npm run dev
```

En PowerShell, usar `npm.cmd` si `npm.ps1` está bloqueado. Abrir la URL que imprime Vite. No abrir `index.html` con doble clic ni con Live Server.

Sin `.env`, arranca en **demo** con cinco ejemplos ficticios y persistencia en localStorage. Se puede agregar, buscar, editar, cambiar estados y eliminar. El modo aparece identificado en pantalla. **Esto no cumple por sí solo el requisito de persistencia en Firebase del TP.** No se copian automáticamente los ejemplos a Firebase.

```sh
npm test
npm run build
npm run preview
```

`npm ci` permite reinstalar exactamente las dependencias de `package-lock.json` en una instalación limpia.

## Activar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/) y registrar una app web. No hace falta Analytics ni Firebase Hosting.
2. En Authentication → Sign-in method, habilitar **Anonymous / Anónimo**.
3. Crear **Cloud Firestore Standard**, base `(default)`, en modo producción; elegir región (la consigna propone `southamerica-east1`).
4. Copiar **todo** `firestore.rules` en Firestore → Reglas y pulsar **Publicar**. No habilitar acceso público global.
5. Copiar `.env.example` a `.env`, cambiar `VITE_DATA_MODE=firebase` y completar las cuatro variables con los valores de la configuración web:

```dotenv
VITE_DATA_MODE=firebase
VITE_FIREBASE_API_KEY=valor_de_apiKey
VITE_FIREBASE_AUTH_DOMAIN=valor_de_authDomain
VITE_FIREBASE_PROJECT_ID=valor_de_projectId
VITE_FIREBASE_APP_ID=valor_de_appId
```

6. Reiniciar `npm run dev`. El indicador debe decir **Firebase**; la lista inicialmente estará vacía.
7. Revisar en Authentication → Settings → Authorized domains que estén permitidos los dominios usados para probar y publicar; agregar `localhost` si se prueba desde ese nombre y el dominio concreto de Vercel cuando corresponda.
8. Ejecutar las pruebas manuales de `docs/PRUEBAS.md` antes de entregar.

Las variables `VITE_` se incluyen en el navegador. Solo llevan configuración web de Firebase, **nunca claves privadas ni credenciales de service account**. La protección real está en las reglas.

### Modelo y operaciones

Ruta: `users/{uid}/tasks/{taskId}`. `uid` lo proporciona Authentication. Cada documento guarda `title` (1–100), `subject` (1–60), `dueDate` (YYYY-MM-DD), `priority` (`normal` o `alta`), `status` (`pendiente`, `en-curso`, `entregada`), `notes` (hasta 1000), `createdAt` y `updatedAt` (timestamps del servidor).

`src/data/firebase.js`: inicialización, sesión persistente y operaciones. `onSnapshot` consulta y escucha cambios; `addDoc` crea; `updateDoc` modifica; `deleteDoc` elimina. Las reglas verifican identidad, campos, tipos, longitudes, estados y timestamps; la validación de calendario completo se hace además en el cliente. No se utiliza un backend propio ni se necesitan índices compuestos.

El acceso es anónimo por navegador. Otro navegador/dispositivo tendrá otra lista; borrar los datos de sesión puede hacer perder acceso a los datos anteriores. Para compartir la misma lista entre dispositivos se debe ampliar con un proveedor de inicio de sesión y vincular la cuenta anónima. No cambiar las reglas a públicas para resolverlo.

El modo Firebase no vuelve silenciosamente a demo ante errores. Un mensaje de éxito de una escritura se muestra después de que la promesa del SDK se resuelve. La lista se actualiza mediante el listener de Firestore; una conexión interrumpida puede dejar una escritura esperando hasta recuperarse.

## Estructura

```text
src/App.jsx                 Estado y composición de la pantalla
src/components/TaskForm.jsx Formulario validado en un diálogo
src/components/TaskCard.jsx Tarjeta, estado y acciones
src/hooks/useTasks.js       Suscripción, carga, errores y reintento
src/domain/tasks.js         Validación, fechas, filtros y orden
src/data/repository.js      Selección explícita demo / firebase
src/data/demo.js            Datos ficticios y almacenamiento local
src/data/firebase.js        SDK real y CRUD por usuario
src/styles.css             Diseño responsive y estados de foco
firestore.rules            Reglas para publicar en Firebase
tests/tasks.test.js         Pruebas de las reglas de negocio
docs/                       Bitácora y plan de pruebas
```

## GitHub y Vercel

1. Crear un repositorio en la cuenta del alumno y subir **el contenido de esta carpeta**, incluyendo archivos ocultos `.gitignore` y `.env.example`. Revisar los archivos antes del primer commit. No subir `.env`, `node_modules` ni `dist`.
2. Importar el repositorio en [Vercel](https://vercel.com/). Seleccionar Vite, build `npm run build`, salida `dist`, Node 22 o superior compatible. Si se subió la carpeta `entrega` dentro del repositorio, seleccionar `entrega` como Root Directory.
3. Cargar las **cinco variables** anteriores para Production (y Preview si se usará): especialmente `VITE_DATA_MODE=firebase`.
4. Desplegar. Si cambian las variables, hacer un nuevo despliegue / Redeploy: Vite las incorpora durante el build.
5. Verificar CRUD y recarga desde la URL publicada. Las reglas se publican por separado en Firebase; Vercel no las actualiza.
6. Hacer una mejora propia, commit y push; comprobar que Vercel terminó el nuevo build y que el cambio se ve desde la URL final. Completar la bitácora con evidencia real.

## Estado de esta base

- Implementados frontend, demo, adaptador Firebase, autenticación anónima, reglas y documentación.
- Verificados seis tests de lógica, build de producción en demo y compilación del modo Firebase (ver resultados finales de la entrega).
- Pendientes: proyecto Firebase real, publicar reglas, comprobar permisos con el emulador o cuentas de prueba, pruebas visuales y de uso en navegador, repositorio GitHub, publicación Vercel y pruebas reales de persistencia.
- La base es una versión de partida. No se presentan tres versiones publicadas ni capturas inventadas. La consigna exige al menos tres versiones: completar la evolución documentada en `docs/BITACORA.md`.
- Para la entrega académica también faltan los enlaces finales, el informe completado con resultados reales y el mini video de explicación.

## Diseño y recursos

Interfaz de cursada con navegación lateral, resumen, próxima entrega y tarjetas. Verde oscuro para acciones, tonos neutros para lectura y etiquetas con texto para los estados; la urgencia no depende solo del color. Formularios con etiquetas, foco visible, diálogos nativos y confirmación antes de eliminar. Layout adaptable a celular. Fuentes DM Sans y Manrope desde Google Fonts con fallback local sans-serif; requiere conexión para las fuentes, pero no para el diseño base. Iconos Lucide (ISC). No se usan fotografías ni imágenes generadas.

## Documentación oficial

- [Vite y requisitos](https://vite.dev/guide/)
- [Variables de entorno en Vite](https://vite.dev/guide/env-and-mode)
- [Autenticación anónima](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Crear y modificar datos](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Escuchar cambios](https://firebase.google.com/docs/firestore/query-data/listen)
- [Reglas de acceso](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite)
