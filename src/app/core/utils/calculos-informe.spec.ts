import { describe, expect, it } from 'vitest';
import { Factura } from '../interfaces/factura.interface';
import { Movimiento } from '../interfaces/movimiento.interface';
import {
  agruparPorCategoria,
  filtrarPorPeriodo,
  resumirFacturas,
  sumarPorTipo,
} from './calculos-informe';

function mov(
  id: number,
  tipo: Movimiento['tipo'],
  categoria: string,
  importe: number,
  fecha: string,
): Movimiento {
  return { id, concepto: `Mov ${id}`, categoria, fecha, importe, tipo };
}

const MOVIMIENTOS: Movimiento[] = [
  mov(1, 'Ingreso', 'Trabajo', 1800, '2026-11-10'),
  mov(2, 'Gasto', 'Vivienda', 650, '2026-11-08'),
  mov(3, 'Gasto', 'Alimentación', 85, '2026-11-07'),
  mov(4, 'Gasto', 'Alimentación', 15, '2026-10-30'),
  mov(5, 'Ingreso', 'Otros', 200, '2025-12-31'),
];

function factura(id: number, estado: Factura['estado'], vencimiento: string, base = 100): Factura {
  return {
    id,
    numero: `F-2026-00${id}`,
    cliente: 'Cliente',
    fechaEmision: '2026-10-01',
    fechaVencimiento: vencimiento,
    lineas: [{ descripcion: 'Servicio', cantidad: 1, precioUnitario: base }],
    tipoIva: 21,
    aplicaIrpf: false,
    estado,
  };
}

describe('filtrarPorPeriodo', () => {
  it('"todo" devuelve todos los movimientos', () => {
    expect(filtrarPorPeriodo(MOVIMIENTOS, 'todo', '2026-11-18')).toHaveLength(5);
  });

  it('"mes" deja solo los del mes en curso', () => {
    const ids = filtrarPorPeriodo(MOVIMIENTOS, 'mes', '2026-11-18').map((m) => m.id);
    expect(ids).toEqual([1, 2, 3]);
  });

  it('"anio" deja solo los del año en curso', () => {
    const ids = filtrarPorPeriodo(MOVIMIENTOS, 'anio', '2026-11-18').map((m) => m.id);
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it('no modifica la lista original', () => {
    const copia = [...MOVIMIENTOS];
    filtrarPorPeriodo(MOVIMIENTOS, 'mes', '2026-11-18');
    expect(MOVIMIENTOS).toEqual(copia);
  });
});

describe('sumarPorTipo', () => {
  it('suma ingresos y gastos por separado', () => {
    expect(sumarPorTipo(MOVIMIENTOS, 'Ingreso')).toBe(2000);
    expect(sumarPorTipo(MOVIMIENTOS, 'Gasto')).toBe(750);
  });

  it('devuelve 0 si no hay movimientos', () => {
    expect(sumarPorTipo([], 'Gasto')).toBe(0);
  });

  it('evita errores de coma flotante', () => {
    const lista = [
      mov(1, 'Gasto', 'A', 0.1, '2026-01-01'),
      mov(2, 'Gasto', 'A', 0.2, '2026-01-01'),
    ];
    expect(sumarPorTipo(lista, 'Gasto')).toBe(0.3);
  });
});

describe('agruparPorCategoria', () => {
  it('agrupa por categoría y ordena de mayor a menor importe', () => {
    const filas = agruparPorCategoria(MOVIMIENTOS, 'Gasto');
    expect(filas.map((f) => f.categoria)).toEqual(['Vivienda', 'Alimentación']);
    expect(filas[1].importe).toBe(100);
  });

  it('calcula el porcentaje sobre el total del tipo', () => {
    const filas = agruparPorCategoria(MOVIMIENTOS, 'Gasto');
    expect(filas[0].porcentaje).toBeCloseTo((650 / 750) * 100, 5);
    expect(filas.reduce((total, f) => total + f.porcentaje, 0)).toBeCloseTo(100, 5);
  });

  it('desempata por nombre cuando el importe es igual', () => {
    const lista = [
      mov(1, 'Gasto', 'Zeta', 10, '2026-01-01'),
      mov(2, 'Gasto', 'Alfa', 10, '2026-01-01'),
    ];
    expect(agruparPorCategoria(lista, 'Gasto').map((f) => f.categoria)).toEqual(['Alfa', 'Zeta']);
  });

  it('devuelve una lista vacía si no hay movimientos de ese tipo', () => {
    expect(agruparPorCategoria([mov(1, 'Ingreso', 'A', 5, '2026-01-01')], 'Gasto')).toEqual([]);
  });
});

describe('resumirFacturas', () => {
  const hoy = '2026-11-18';

  it('devuelve siempre los tres estados, aunque no haya facturas', () => {
    const resumen = resumirFacturas([], hoy);
    expect(resumen.map((r) => r.estado)).toEqual(['Pendiente', 'Vencida', 'Pagada']);
    expect(resumen.every((r) => r.cantidad === 0 && r.importe === 0)).toBe(true);
  });

  it('separa pendientes, vencidas y pagadas según la fecha de vencimiento', () => {
    const facturas = [
      factura(1, 'Pagada', '2026-11-04'),
      factura(2, 'Pendiente', '2026-11-10'),
      factura(3, 'Pendiente', '2026-12-03'),
      factura(4, 'Pendiente', '2026-12-12', 200),
    ];
    const [pendiente, vencida, pagada] = resumirFacturas(facturas, hoy);
    expect(pendiente).toEqual({ estado: 'Pendiente', cantidad: 2, importe: 363 });
    expect(vencida).toEqual({ estado: 'Vencida', cantidad: 1, importe: 121 });
    expect(pagada).toEqual({ estado: 'Pagada', cantidad: 1, importe: 121 });
  });

  it('una factura pagada nunca cuenta como vencida', () => {
    const [, vencida, pagada] = resumirFacturas([factura(1, 'Pagada', '2020-01-01')], hoy);
    expect(vencida.cantidad).toBe(0);
    expect(pagada.cantidad).toBe(1);
  });
});
