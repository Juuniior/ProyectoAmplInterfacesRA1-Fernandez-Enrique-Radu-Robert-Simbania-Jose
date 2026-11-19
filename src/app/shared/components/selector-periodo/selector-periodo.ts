import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Una opción del selector. */
export interface OpcionSelector {
  valor: string;
  etiqueta: string;
}

/**
 * Grupo de botones para elegir una opción (por ejemplo, el periodo de un informe).
 * Es presentacional: recibe las opciones y la elegida, y avisa cuando el usuario cambia.
 *
 * ```html
 * <app-selector-periodo [opciones]="opciones" valor="mes" (valorCambiado)="periodo = $event" />
 * ```
 */
@Component({
  selector: 'app-selector-periodo',
  standalone: true,
  templateUrl: './selector-periodo.html',
  styleUrl: './selector-periodo.css',
})
export class SelectorPeriodo {
  /** Opciones disponibles. Por defecto, ninguna. */
  @Input() opciones: OpcionSelector[] = [];
  /** `valor` de la opción elegida. */
  @Input() valor = '';
  /** Nombre accesible del grupo (lo lee el lector de pantalla). */
  @Input() etiqueta = 'Periodo';

  /** Se emite con el `valor` de la opción pulsada (solo si cambia). */
  @Output() valorCambiado = new EventEmitter<string>();

  elegir(valor: string): void {
    if (valor !== this.valor) {
      this.valorCambiado.emit(valor);
    }
  }
}
