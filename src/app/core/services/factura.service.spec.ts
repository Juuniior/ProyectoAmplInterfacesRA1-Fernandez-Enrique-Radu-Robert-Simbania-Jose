import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FacturaService } from './factura.service';
import { MovimientoService } from './movimiento.service';
import { NuevaFactura } from '../interfaces/factura.interface';

const NUEVA: NuevaFactura = {
  cliente: 'Cliente Nuevo',
  fechaEmision: '2026-11-18',
  fechaVencimiento: '2026-12-18',
  lineas: [{ descripcion: 'Consultoría', cantidad: 2, precioUnitario: 50 }],
  tipoIva: 21,
  aplicaIrpf: false,
};

describe('FacturaService', () => {
  let service: FacturaService;
  let movimientos: MovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaService);
    movimientos = TestBed.inject(MovimientoService);
  });

  it('arranca con las facturas de ejemplo', () => {
    expect(service.facturas().length).toBe(4);
  });

  it('la F-2026-001 está pagada porque su cobro existe en Movimientos', () => {
    const f1 = service.facturas().find((f) => f.numero === 'F-2026-001')!;
    const cobro = movimientos.movimientos().find((m) => m.facturaId === f1.id)!;
    expect(f1.estado).toBe('Pagada');
    expect(f1.fechaPago).toBe(cobro.fecha);
    expect(cobro.importe).toBe(1399.2);
  });

  it('si se borra el cobro en Movimientos, la factura vuelve a pendiente', () => {
    const cobro = movimientos.movimientos().find((m) => m.facturaId === 1)!;
    movimientos.eliminarMovimiento(cobro.id);
    const f1 = service.facturas().find((f) => f.id === 1)!;
    expect(f1.estado).toBe('Pendiente');
    expect(f1.fechaPago).toBeUndefined();
  });

  it('crea una factura pendiente con el siguiente número', () => {
    expect(service.siguienteNumero('2026-11-18')).toBe('F-2026-005');
    const creada = service.crearFactura(NUEVA);
    expect(creada.numero).toBe('F-2026-005');
    expect(creada.estado).toBe('Pendiente');
    expect(creada.id).toBe(5);
    expect(service.facturas().length).toBe(5);
  });

  it('al marcar como pagada añade un ingreso en Movimientos', () => {
    const creada = service.crearFactura(NUEVA);
    const antes = movimientos.movimientos().length;

    const pagada = service.marcarPagada(creada.id, '2026-11-20');

    expect(pagada?.estado).toBe('Pagada');
    expect(pagada?.fechaPago).toBe('2026-11-20');
    const lista = movimientos.movimientos();
    expect(lista.length).toBe(antes + 1);
    expect(lista.at(-1)).toMatchObject({
      tipo: 'Ingreso',
      importe: 121,
      fecha: '2026-11-20',
      concepto: 'Cobro factura F-2026-005 · Cliente Nuevo',
      facturaId: creada.id,
    });
  });

  it('no cobra dos veces la misma factura', () => {
    const creada = service.crearFactura(NUEVA);
    service.marcarPagada(creada.id, '2026-11-20');
    const antes = movimientos.movimientos().length;
    expect(service.marcarPagada(creada.id, '2026-11-21')).toBeNull();
    expect(movimientos.movimientos().length).toBe(antes);
  });

  it('elimina pendientes pero no pagadas', () => {
    expect(service.eliminarFactura(1)).toBe(false); // F-2026-001 está pagada
    expect(service.eliminarFactura(2)).toBe(true);
    expect(service.facturas().some((f) => f.id === 2)).toBe(false);
  });
});
