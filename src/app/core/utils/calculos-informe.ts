import { EstadoVisible, Factura } from '../interfaces/factura.interface';
import { Movimiento } from '../interfaces/movimiento.interface';
import { estadoVisible, redondear, totalFactura } from './calculos-factura';

/** Periodo que puede filtrar el informe. */
export type Periodo = 'todo' | 'mes' | 'anio';

/** Una categoría con lo que suma y su peso sobre el total de su tipo (0-100). */
export interface FilaCategoria {
  categoria: string;
  importe: number;
  porcentaje: number;
}

/** Facturas agrupadas por estado visible. */
export interface ResumenEstado {
  estado: EstadoVisible;
  cantidad: number;
  importe: number;
}

/** Deja solo los movimientos del periodo. `hoy` en formato AAAA-MM-DD. */
export function filtrarPorPeriodo(
  movimientos: Movimiento[],
  periodo: Periodo,
  hoy: string,
): Movimiento[] {
  if (periodo === 'mes') {
    return movimientos.filter((m) => m.fecha.startsWith(hoy.slice(0, 7)));
  }
  if (periodo === 'anio') {
    return movimientos.filter((m) => m.fecha.startsWith(hoy.slice(0, 4)));
  }
  return movimientos;
}

/** Suma los importes de los movimientos de un tipo. */
export function sumarPorTipo(movimientos: Movimiento[], tipo: Movimiento['tipo']): number {
  return redondear(
    movimientos.filter((m) => m.tipo === tipo).reduce((total, m) => total + m.importe, 0),
  );
}

/**
 * Agrupa por categoría los movimientos de un tipo, de mayor a menor importe.
 * El porcentaje de cada fila es su parte del total de ese tipo.
 */
export function agruparPorCategoria(
  movimientos: Movimiento[],
  tipo: Movimiento['tipo'],
): FilaCategoria[] {
  const sumas = new Map<string, number>();
  for (const m of movimientos.filter((x) => x.tipo === tipo)) {
    sumas.set(m.categoria, (sumas.get(m.categoria) ?? 0) + m.importe);
  }
  const total = [...sumas.values()].reduce((a, b) => a + b, 0);
  return [...sumas.entries()]
    .map(([categoria, importe]) => ({
      categoria,
      importe: redondear(importe),
      porcentaje: total > 0 ? (importe / total) * 100 : 0,
    }))
    .sort((a, b) => b.importe - a.importe || a.categoria.localeCompare(b.categoria, 'es'));
}

/** Cuenta y suma el total (con IVA e IRPF) de las facturas según su estado visible. */
export function resumirFacturas(facturas: Factura[], hoy: string): ResumenEstado[] {
  const estados: EstadoVisible[] = ['Pendiente', 'Vencida', 'Pagada'];
  return estados.map((estado) => {
    const delEstado = facturas.filter((f) => estadoVisible(f, hoy) === estado);
    return {
      estado,
      cantidad: delEstado.length,
      importe: redondear(delEstado.reduce((total, f) => total + totalFactura(f), 0)),
    };
  });
}
