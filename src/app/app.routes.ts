import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Movimientos } from './features/movimientos/movimientos';
import { Login } from './features/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'movimientos', component: Movimientos },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'home' }
];