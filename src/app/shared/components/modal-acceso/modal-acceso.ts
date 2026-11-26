import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Login, ModoAcceso } from '../../../features/login/login';
import { UsuarioPublico } from '../../../core/auth/autenticacion.model';

/**
 * Ventana emergente (modal) reutilizable que muestra los formularios de
 * inicio de sesión y registro cuando una persona sin sesión intenta realizar
 * una acción que requiere cuenta.
 */
@Component({
  selector: 'app-modal-acceso',
  standalone: true,
  imports: [Login],
  templateUrl: './modal-acceso.html',
  styleUrl: './modal-acceso.css',
})
export class ModalAcceso {
  /** Controla si la ventana emergente es visible. */
  @Input() abierto = false;
  /** Mensaje contextual que explica por qué se solicita iniciar sesión. */
  @Input() motivo: string | null = null;
  /** Pestaña inicial del formulario ('login' o 'registro'). */
  @Input() modoInicial: ModoAcceso = 'login';

  /** Se emite cuando el usuario cierra la ventana emergente. */
  @Output() cerrado = new EventEmitter<void>();
  /** Se emite cuando el usuario inicia sesión desde la ventana emergente. */
  @Output() sesionIniciada = new EventEmitter<UsuarioPublico>();

  @HostListener('document:keydown.escape')
  alPulsarEscape(): void {
    if (this.abierto) {
      this.cerrar();
    }
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  alIniciarSesion(usuario: UsuarioPublico): void {
    this.sesionIniciada.emit(usuario);
    this.cerrado.emit();
  }
}
