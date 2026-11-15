import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  modo: 'login' | 'registro' = 'login';

  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
  }
}