import { Component, computed, inject, signal } from '@angular/core';
import { Movimiento } from '../../core/interfaces/movimiento.interface';
import { FacturaService } from '../../core/services/factura.service';
import { MovimientoService } from '../../core/services/movimiento.service';
import { aFechaIso } from '../../core/utils/calculos-factura';
import {
  Periodo,
  agruparPorCategoria,
  filtrarPorPeriodo,
  resumirFacturas,
  sumarPorTipo,
} from '../../core/utils/calculos-informe';
import { formatearEuros } from '../../core/utils/formato';
import { BarraCategoria } from '../../shared/components/barra-categoria/barra-categoria';
import {
  SelectorPeriodo,
  OpcionSelector,
} from '../../shared/components/selector-periodo/selector-periodo';
import {
  TarjetaResumen,
  TipoTarjeta,
} from '../../shared/components/tarjeta-resumen/tarjeta-resumen';

/** Categoría elegida para ver su detalle. */
interface Seleccion {
  tipo: Movimiento['tipo'];
  categoria: string;
}

/**
 * Página de informes: resume ingresos, gastos y saldo de un periodo, reparte cada tipo
 * por categorías y muestra el estado de las facturas. Solo lee datos de
 * `MovimientoService` y `FacturaService`; no modifica nada.
 *
 * Se recalcula sola cuando cambian los movimientos o las facturas (señales).
 */
@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [SelectorPeriodo, TarjetaResumen, BarraCategoria],
  templateUrl: './informes.html',
  styleUrl: './informes.css',
})
export class Informes {
  private readonly movimientoService = inject(MovimientoService);
  private readonly facturaService = inject(FacturaService);

  readonly opcionesPeriodo: OpcionSelector[] = [
    { valor: 'todo', etiqueta: 'Todo' },
    { valor: 'mes', etiqueta: 'Este mes' },
    { valor: 'anio', etiqueta: 'Este año' },
  ];

  /** Periodo elegido. Por defecto, todo el histórico. */
  readonly periodo = signal<Periodo>('todo');

  /** Categoría cuyo detalle se está viendo (o `null`). */
  readonly seleccion = signal<Seleccion | null>(null);

  private readonly hoy = computed(() => aFechaIso(new Date()));

  readonly movimientosPeriodo = computed(() =>
    filtrarPorPeriodo(this.movimientoService.movimientos(), this.periodo(), this.hoy()),
  );

  readonly totalIngresos = computed(() => sumarPorTipo(this.movimientosPeriodo(), 'Ingreso'));
  readonly totalGastos = computed(() => sumarPorTipo(this.movimientosPeriodo(), 'Gasto'));
  readonly saldo = computed(() => this.totalIngresos() - this.totalGastos());

  readonly ingresosPorCategoria = computed(() =>
    agruparPorCategoria(this.movimientosPeriodo(), 'Ingreso'),
  );
  readonly gastosPorCategoria = computed(() =>
    agruparPorCategoria(this.movimientosPeriodo(), 'Gasto'),
  );

  /** Facturas por estado. No depende del periodo: es la situación de cobro actual. */
  readonly facturasPorEstado = computed(() =>
    resumirFacturas(this.facturaService.facturas(), this.hoy()),
  );

  /** Movimientos de la categoría elegida, del más reciente al más antiguo. */
  readonly detalle = computed(() => {
    const elegida = this.seleccion();
    if (!elegida) {
      return [];
    }
    return this.movimientosPeriodo()
      .filter((m) => m.tipo === elegida.tipo && m.categoria === elegida.categoria)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  });

  /** Cambia el periodo y cierra el detalle (la categoría puede haber desaparecido). */
  cambiarPeriodo(valor: string): void {
    this.periodo.set(valor as Periodo);
    this.seleccion.set(null);
  }

  /** Abre el detalle de una categoría; si ya estaba abierto, lo cierra. */
  alternarCategoria(tipo: Movimiento['tipo'], categoria: string): void {
    const actual = this.seleccion();
    const mismaCategoria = actual?.tipo === tipo && actual.categoria === categoria;
    this.seleccion.set(mismaCategoria ? null : { tipo, categoria });
  }

  esActiva(tipo: Movimiento['tipo'], categoria: string): boolean {
    const actual = this.seleccion();
    return actual?.tipo === tipo && actual.categoria === categoria;
  }

  /** Tipo de tarjeta (color) según el estado de la factura. */
  tipoTarjetaEstado(estado: string): TipoTarjeta {
    return estado === 'Pagada' ? 'ingreso' : estado === 'Vencida' ? 'gasto' : 'saldo';
  }

  textoFacturas(cantidad: number): string {
    return cantidad === 1 ? '1 factura' : `${cantidad} facturas`;
  }

  euros(importe: number): string {
    return formatearEuros(importe);
  }
}
