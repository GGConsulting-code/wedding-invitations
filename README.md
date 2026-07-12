# Invitaciones digitales de boda

Proyecto React sencillo para ejecutar en local. Incluye:

- Login administrativo protegido.
- Panel con métricas de asistencia.
- Edición de nombres de la pareja, presentación, fecha, ubicación, fotografías y música.
- Generación de una URL única por invitado.
- Tabla de invitaciones y estatus RSVP.
- Invitación pública para celular con contador, mapa, galería 3D, audio y confirmación de asistencia.
- Redux Toolkit, actions, reducers y servicios separados.

## Requisitos

- Node.js 20.19 o superior.
- npm.

## Levantar el proyecto

Desde la carpeta raíz:

```bash
npm install
npm run dev
```

Abre:

```text
http://127.0.0.1:3000/login
```

Credenciales locales:

```text
Usuario: admin
Contraseña: BodaAdmin2026!
```

Invitación de ejemplo:

```text
http://127.0.0.1:3000/invitacion?token=11111111-1111-4111-8111-111111111111
```

## Modo local sin backend

El archivo `.env` viene configurado así:

```dotenv
VITE_DATA_MODE=local
VITE_API_BASE_URL=http://localhost:8080
VITE_PUBLIC_APP_URL=auto
VITE_HTTP_TIMEOUT_MS=15000
VITE_DEFAULT_TIME_ZONE=America/Mexico_City
```

Con `VITE_DATA_MODE=local` la aplicación funciona sin backend. Los datos se guardan en `localStorage`, por lo que puedes:

- iniciar sesión;
- editar y guardar la boda;
- generar invitaciones;
- abrir la URL generada en el mismo navegador;
- confirmar o rechazar asistencia;
- ver los totales actualizados en administración.

`VITE_PUBLIC_APP_URL=auto` hace que las URLs se generen con el host y puerto desde donde abriste la aplicación.

> Importante: el modo local es para desarrollo y demostración. Una URL abierta desde otro teléfono no tendrá acceso a los datos guardados en tu navegador. Para compartir invitaciones entre dispositivos debes implementar el backend REST.

## Conectar el backend REST

Cambia en `.env`:

```dotenv
VITE_DATA_MODE=rest
VITE_API_BASE_URL=http://localhost:8080
VITE_PUBLIC_APP_URL=http://127.0.0.1:3000
```

El frontend consumirá los endpoints documentados en:

```text
docs/openapi-invitaciones-boda.yaml
```

## Compilar para producción

```bash
npm run build
npm run preview
```

## Estructura principal

```text
src/
  app/                 router y store Redux
  components/          componentes comunes
  config/              constantes y variables de entorno
  data/                datos iniciales del modo local
  features/
    auth/              login
    admin/             panel administrativo
    invitation/        invitación pública
  hooks/               audio, contador y WebGL
  schemas/             validaciones Zod
  services/            modo local y consumo REST
  store/
    actions/           createAsyncThunk
    reducers/          Redux slices
    selectors/         selectores
  styles/              estilos globales
  utils/               utilidades
```

## Solución aplicada al error original

El proyecto original mezclaba Next.js, Vinext, Vite y Cloudflare. Durante `npm run dev`, las solicitudes de archivos JavaScript terminaban recibiendo HTML, provocando el error:

```text
Expected a JavaScript module script but the server responded with MIME type text/html
```

Esta versión usa únicamente React + Vite. El punto de entrada es `src/main.jsx`, el servidor de desarrollo entrega los módulos como `text/javascript` y las rutas se administran con React Router.
