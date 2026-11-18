import { describe, expect, it } from 'vitest';
import { Factura } from '../interfaces/factura.interface';
import {
  calcularTotales,
  estadoVisible,
  redondear,
  siguienteNumero,
  subtotalLinea,
  sumarDias,
} from './calculos-factura';

const base: Factura = {
  id: 1,
  numero: 'F-2026-001',
  cliente: 'Cliente',
  fechaEmision: '2026-11-01',
  fechaVencimiento: '2026-11-15',
  lineas: [{ descripcion: 'x', cantidad: 1, precioUnitario: 100 }],
  tipoIva: 21,
  aplicaIrpf: false,
  estado: 'Pendiente',
};

describe('calculos-factura', () => {
  it('redondea a céntimos', () => {
    expect(redondear(0.1 + 0.2)).toBe(0.3);
    expect(redondear(1.005)).toBe(1.01);
  });

  it('calcula el subtotal de una línea', () => {
    expect(subtotalLinea({ cantidad: 3, precioUnitario: 19.99 })).toBe(59.97);
  });

  it('calcula base, IVA y total sin IRPF', () => {
    const t = calcularTotales([{ cantidad: 2, precioUnitario: 90 }], 21, false);
    expect(t).toEqual({ baseImponible: 180, cuotaIva: 37.8, retencionIrpf: 0, total: 217.8 });
  });

  it('resta la retención de IRPF del total', () => {
    const t = calcularTotales(
      [
        { cantidad: 1, precioUnitario: 1200 },
        { cantidad: 1, precioUnitario: 120 },
      ],
      21,
      true,
    );
    expect(t).toEqual({ baseImponible: 1320, cuotaIva: 277.2, retencionIrpf: 198, total: 1399.2 });
  });

  it('aplica IVA reducido', () => {
    expect(calcularTotales([{ cantidad: 4, precioUnitario: 75 }], 10, false).total).toBe(330);
  });

  it('marca como vencida una pendiente cuyo vencimiento ya pasó', () => {
    expect(estadoVisible(base, '2026-11-16')).toBe('Vencida');
    expect(estadoVisible(base, '2026-11-15')).toBe('Pendiente');
    expect(estadoVisible({ ...base, estado: 'Pagada' }, '2026-12-31')).toBe('Pagada');
  });

  it('numera de forma correlativa por año', () => {
    const facturas = [{ numero: 'F-2026-001' }, { numero: 'F-2026-007' }, { numero: 'F-2025-020' }];
    expect(siguienteNumero(facturas, '2026-11-18')).toBe('F-2026-008');
    expect(siguienteNumero(facturas, '2027-01-02')).toBe('F-2027-001');
  });

  it('suma días cambiando de mes y de año', () => {
    expect(sumarDias('2026-12-15', 30)).toBe('2027-01-14');
  });
});
