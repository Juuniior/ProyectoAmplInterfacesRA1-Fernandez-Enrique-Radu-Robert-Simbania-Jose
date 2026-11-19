import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Login no depende de la sesión: se puede generar en el servidor.
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  // El resto de páginas están protegidas por `autenticadoGuard`, que lee la sesión del
  // navegador (sessionStorage). En el servidor no existe, así que se renderizan en el cliente.
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
