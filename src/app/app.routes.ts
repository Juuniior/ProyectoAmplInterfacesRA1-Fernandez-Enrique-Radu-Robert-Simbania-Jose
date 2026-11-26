import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Movimientos } from './features/movimientos/movimientos';
import { Facturas } from './features/facturas/facturas';
import { Informes } from './features/informes/informes';
import { Login } from './features/login/login';

/**
 * Todas las rutas son accesibles sin iniciar sesión (modo vista previa con datos
 * de demostración). Cuando una persona sin sesión intenta realizar una acción
 * que modifica datos, se abre la ventana emergente de acceso (`ModalAcceso`).
 */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'movimientos', component: Movimientos },
  { path: 'facturas', component: Facturas },
  { path: 'informes', component: Informes },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'home' }
];
