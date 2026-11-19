import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatearEuros } from '../../../core/utils/formato';

/**
 * Fila de un gráfico de barras horizontal: etiqueta, barra proporcional e importe.
 * Es un botón: al pulsarla emite su etiqueta para que la página muestre el detalle.
 *
 * ```html
 * <app-barra-categoria etiqueta="Vivienda" [importe]="650" [porcentaje]="88" tipo="gasto"
 *   [activa]="elegida === 'Vivienda'" (seleccionada)="elegida = $event" />
 * ```
 */
@Component({
  selector: 'app-barra-categoria',
  standalone: true,
  templateUrl: './barra-categoria.html',
  styleUrl: './barra-categoria.css',
})
export class BarraCategoria {
  /** Nombre de la categoría. */
  @Input() etiqueta = '';
  /** Importe en euros. */
  @Input() importe = 0;
  /** Longitud de la barra, de 0 a 100. Los valores fuera de rango se recortan. */
  @Input() porcentaje = 0;
  /** Color de la barra: verde para ingresos, rojo para gastos. Por defecto, `'gasto'`. */
  @Input() tipo: 'ingreso' | 'gasto' = 'gasto';
  /** Resalta la fila (por ejemplo, la categoría cuyo detalle se está viendo). */
  @Input() activa = false;

  /** Se emite con la etiqueta cuando se pulsa la fila. */
  @Output() seleccionada = new EventEmitter<string>();

  get ancho(): number {
    return Math.min(100, Math.max(0, this.porcentaje));
  }

  get importeTexto(): string {
    return formatearEuros(this.importe);
  }
}
