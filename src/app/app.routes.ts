import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Movimientos } from './features/movimientos/movimientos';
import { Facturas } from './features/facturas/facturas';
import { Informes } from './features/informes/informes';
import { Login } from './features/login/login';
import { autenticadoGuard } from './core/auth/autenticado.guard';

/** Todas las páginas menos Login exigen haber iniciado sesión (`autenticadoGuard`). */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [autenticadoGuard] },
  { path: 'movimientos', component: Movimientos, canActivate: [autenticadoGuard] },
  { path: 'facturas', component: Facturas, canActivate: [autenticadoGuard] },
  { path: 'informes', component: Informes, canActivate: [autenticadoGuard] },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'home' }
];
