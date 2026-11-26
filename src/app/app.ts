import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { ModalAcceso } from './shared/components/modal-acceso/modal-acceso';
import { AccesoModalService } from './core/auth/acceso-modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ModalAcceso],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly modalAcceso = inject(AccesoModalService);
}