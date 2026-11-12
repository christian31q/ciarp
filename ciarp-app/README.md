# CIARP

Aplicación Next.js unificada para la valoración de hojas de vida de ingreso
docente. La interfaz, reglas de puntuación y exportación documental provienen
de `ciarp-make`, que se conserva como referencia; el runtime activo es
`ciarp-app`.

## Desarrollo local

Desde `ciarp-app`:

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`. Las llamadas de
autenticación usan rutas relativas `/api`, por lo que no requieren un proxy ni
un segundo servidor.

## Variables de entorno

Configure estas variables en `.env.local` sin publicar sus valores:

- `MONGODB_URI`: URI privada de conexión a MongoDB.
- `MONGODB_DB`: nombre de la base de datos.
- `BETTER_AUTH_SECRET`: secreto privado para Better Auth.
- `BETTER_AUTH_URL`: URL base de la aplicación (`http://localhost:3000` en local).
- `BETTER_AUTH_TRUSTED_ORIGINS`: orígenes permitidos, separados por comas
  (`http://localhost:3000,http://127.0.0.1:3000` en local).
- `BETTER_AUTH_ALLOW_SIGN_UP`: `false` para impedir registros abiertos.
- `CIARP_TEST_USER_EMAIL`, `CIARP_TEST_USER_PASSWORD`,
  `CIARP_TEST_USER_NAME`: variables privadas opcionales para el script de
  creación de usuario de pruebas.

Consulta `.env.example` para los nombres y la configuración local esperada.
Nunca incluyas `.env.local` en commits.

## Comprobaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
```

El flujo de autenticación conserva las rutas locales de login, sesión y cierre
de sesión. La valoración, sus reglas, bitácora y exportación a PDF se ejecutan
en el navegador dentro de la aplicación unificada.
