import { Component, Input } from '@angular/core';
import { formatearEuros } from '../../../core/utils/formato';

/** Tipo de tarjeta: decide el color y el icono. */
export type TipoTarjeta = 'ingreso' | 'gasto' | 'saldo';

const ICONOS: Record<TipoTarjeta, string> = { ingreso: '↗', gasto: '↘', saldo: '€' };

/**
 * Tarjeta presentacional con un título, un importe en euros y un detalle opcional.
 * No tiene lógica ni servicios: solo muestra lo que recibe.
 *
 * ```html
 * <app-tarjeta-resumen titulo="Ingresos" [importe]="3399.2" tipo="ingreso" detalle="3 movimientos" />
 * ```
 */
@Component({
  selector: 'app-tarjeta-resumen',
  standalone: true,
  templateUrl: './tarjeta-resumen.html',
  styleUrl: './tarjeta-resumen.css',
})
export class TarjetaResumen {
  /** Título de la tarjeta, por ejemplo «Ingresos». */
  @Input() titulo = '';
  /** Importe en euros. */
  @Input() importe = 0;
  /** Tipo de tarjeta (color e icono). Por defecto, `'saldo'`. */
  @Input() tipo: TipoTarjeta = 'saldo';
  /** Texto pequeño bajo el importe. Si está vacío, no se muestra. */
  @Input() detalle = '';

  get icono(): string {
    return ICONOS[this.tipo];
  }

  get importeTexto(): string {
    return formatearEuros(this.importe);
  }
}
