import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTENTICACION } from './autenticacion.token';

/**
 * Guard de rutas: solo deja entrar a la página si hay una sesión iniciada.
 *
 * Si no la hay, redirige a `/login` y guarda en `returnUrl` la página que se quería
 * visitar, para volver a ella después de iniciar sesión.
 *
 * Uso en `app.routes.ts`:
 * ```ts
 * { path: 'informes', component: Informes, canActivate: [autenticadoGuard] }
 * ```
 *
 * Importante: la sesión vive en `sessionStorage` (solo existe en el navegador), por eso
 * las rutas protegidas se renderizan solo en el cliente (ver `app.routes.server.ts`).
 */
export const autenticadoGuard: CanActivateFn = (_ruta, estado) => {
  const auth = inject(AUTENTICACION);
  const router = inject(Router);

  if (auth.usuarioActual()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: estado.url } });
};
