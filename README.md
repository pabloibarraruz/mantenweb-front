# MantenWeb Frontend

Frontend de MantenWeb, sistema para gestionar ordenes de trabajo de mantenimiento en un entorno hospitalario.

## Requisitos

- Node.js
- npm
- Backend de MantenWeb ejecutandose en `http://localhost:8080`

## Instalacion

```bash
npm install
```

## Ejecucion local

```bash
npm start
```

La aplicacion queda disponible en:

```text
http://localhost:4200
```

El proxy local redirige las llamadas `/api` y `/actuator` hacia el backend.

## Compilacion

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`.

## Pruebas

```bash
npm test
```

## Estructura principal

- `src/app/pages`: pantallas de login, dashboard, jefatura, tecnico y recuperacion de contrasena.
- `src/app/services`: servicios HTTP usados por las pantallas.
- `src/app/core/auth`: manejo de sesion, guards e interceptor JWT.
- `src/environments`: configuracion de ambientes.
