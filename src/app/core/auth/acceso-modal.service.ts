import { Injectable, signal } from '@angular/core';
import { ModoAcceso } from '../../features/login/login';

/**
 * Servicio que controla la ventana emergente (modal) de acceso cuando el
 * usuario navega sin haber iniciado sesión e intenta realizar una acción
 * que requiere cuenta (añadir o eliminar movimientos, emitir o cobrar facturas, etc.).
 */
@Injectable({ providedIn: 'root' })
export class AccesoModalService {
  private readonly estadoAbierto = signal(false);
  private readonly estadoMotivo = signal<string | null>(null);
  private readonly estadoModo = signal<ModoAcceso>('login');

  /** Indica si la ventana emergente de acceso está abierta. */
  readonly abierto = this.estadoAbierto.asReadonly();
  /** Mensaje contextual que explica por qué se pide iniciar sesión. */
  readonly motivo = this.estadoMotivo.asReadonly();
  /** Pestaña inicial que muestra el modal ('login' o 'registro'). */
  readonly modoInicial = this.estadoModo.asReadonly();

  /**
   * Abre la ventana emergente de inicio de sesión o registro.
   * @param motivo Explicación opcional de la acción que requiere cuenta.
   * @param modo Pestaña inicial ('login' por defecto).
   */
  solicitar(motivo?: string, modo: ModoAcceso = 'login'): void {
    this.estadoMotivo.set(
      motivo ?? 'Inicia sesión o crea una cuenta para guardar tus propios datos en ContaLite.',
    );
    this.estadoModo.set(modo);
    this.estadoAbierto.set(true);
  }

  /** Cierra la ventana emergente de acceso. */
  cerrar(): void {
    this.estadoAbierto.set(false);
    this.estadoMotivo.set(null);
  }
}
