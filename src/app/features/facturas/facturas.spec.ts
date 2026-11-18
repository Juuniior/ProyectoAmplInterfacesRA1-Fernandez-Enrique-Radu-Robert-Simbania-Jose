import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Facturas } from './facturas';
import { MovimientoService } from '../../core/services/movimiento.service';

describe('Facturas', () => {
  let fixture: ComponentFixture<Facturas>;
  let component: Facturas;

  beforeEach(async () => {
    // Fijamos "hoy" para que los estados (vencida/pendiente) no dependan del día en que se ejecute.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 18, 12)); // 18/11/2026

    await TestBed.configureTestingModule({
      imports: [Facturas],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Facturas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function texto(): string {
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  function rellenarFormulario() {
    component.formulario.patchValue({ cliente: 'Cliente de prueba', tipoIva: 21, aplicaIrpf: true });
    component.lineas.at(0).setValue({ descripcion: 'Diseño', cantidad: 2, precioUnitario: 100 });
  }

  it('muestra todas las facturas ordenadas de la más reciente a la más antigua', () => {
    const numeros = component.facturasFiltradas().map((f) => f.factura.numero);
    expect(numeros).toEqual(['F-2026-004', 'F-2026-003', 'F-2026-002', 'F-2026-001']);
  });

  it('calcula el estado vencido y el resumen', () => {
    const estados = Object.fromEntries(component.facturasFiltradas().map((f) => [f.factura.numero, f.estado]));
    expect(estados['F-2026-002']).toBe('Vencida');
    expect(estados['F-2026-001']).toBe('Pagada');

    const resumen = component.resumen();
    expect(resumen.vencidasCantidad).toBe(1);
    expect(resumen.vencidasImporte).toBe(217.8);
    // F-002 (217,80) + F-003 (630 + 132,30 − 94,50) + F-004 (330)
    expect(resumen.pendienteCobro).toBeCloseTo(1215.6, 2);
    // Emitidas en noviembre: F-003 y F-004
    expect(resumen.facturadoMes).toBeCloseTo(997.8, 2);
  });

  it('filtra por estado y busca por cliente o número', () => {
    component.filtro.set('Pendiente');
    expect(component.facturasFiltradas().map((f) => f.factura.numero)).toEqual(['F-2026-004', 'F-2026-003']);

    component.filtro.set('Todas');
    component.busqueda.set('panadería');
    expect(component.facturasFiltradas().map((f) => f.factura.numero)).toEqual(['F-2026-002']);

    component.busqueda.set('f-2026-001');
    expect(component.facturasFiltradas().map((f) => f.factura.numero)).toEqual(['F-2026-001']);
  });

  it('propone fechas por defecto y el siguiente número', () => {
    expect(component.formulario.controls.fechaEmision.value).toBe('2026-11-18');
    expect(component.formulario.controls.fechaVencimiento.value).toBe('2026-12-18');
    expect(component.numeroPrevisto).toBe('F-2026-005');
  });

  it('añade y quita líneas, dejando siempre al menos una', () => {
    component.agregarLinea();
    component.agregarLinea();
    expect(component.lineas.length).toBe(3);
    component.quitarLinea(1);
    component.quitarLinea(0);
    component.quitarLinea(0);
    expect(component.lineas.length).toBe(1);
  });

  it('recalcula los totales en directo', () => {
    rellenarFormulario();
    component.agregarLinea();
    component.lineas.at(1).setValue({ descripcion: 'Hosting', cantidad: 1, precioUnitario: 50 });
    expect(component.subtotal(0)).toBe(200);
    expect(component.totales).toEqual({ baseImponible: 250, cuotaIva: 52.5, retencionIrpf: 37.5, total: 265 });
    expect(texto()).toContain('265,00 €');
  });

  it('no crea la factura si el formulario no es válido', () => {
    component.crearFactura();
    expect(component.facturasFiltradas().length).toBe(4);
    expect(texto()).toContain('Indica el cliente');
  });

  it('valida que el vencimiento no sea anterior a la emisión', () => {
    rellenarFormulario();
    component.formulario.patchValue({ fechaVencimiento: '2026-11-01' });
    expect(component.formulario.hasError('vencimientoAnterior')).toBe(true);
  });

  it('crea la factura y reinicia el formulario', () => {
    rellenarFormulario();
    component.crearFactura();

    const creada = component.facturasFiltradas()[0];
    expect(creada.factura.numero).toBe('F-2026-005');
    expect(creada.estado).toBe('Pendiente');
    expect(creada.total).toBe(212); // 200 + 42 − 30
    expect(component.formulario.controls.cliente.value).toBe('');
    expect(component.lineas.length).toBe(1);
    expect(component.lineas.at(0).value.cantidad).toBe(1);
    expect(component.numeroPrevisto).toBe('F-2026-006');
    expect(component.aviso()?.texto).toContain('F-2026-005');
  });

  it('al marcar como pagada crea un ingreso en Movimientos', () => {
    const movimientos = TestBed.inject(MovimientoService);
    const antes = movimientos.movimientos().length;
    const fila = component.facturasFiltradas().find((f) => f.factura.numero === 'F-2026-002')!;

    component.marcarPagada(fila.factura);

    const actualizada = component.facturasFiltradas().find((f) => f.factura.numero === 'F-2026-002')!;
    expect(actualizada.estado).toBe('Pagada');
    expect(actualizada.factura.fechaPago).toBe('2026-11-18');
    expect(movimientos.movimientos().length).toBe(antes + 1);
    expect(movimientos.movimientos().at(-1)?.importe).toBe(217.8);
    expect(texto()).toContain('Se ha añadido un ingreso de 217,80 €');
  });

  it('solo permite eliminar facturas pendientes', () => {
    const pagada = component.facturasFiltradas().find((f) => f.factura.numero === 'F-2026-001')!;
    component.eliminar(pagada.factura);
    expect(component.facturasFiltradas().length).toBe(4);

    const pendiente = component.facturasFiltradas().find((f) => f.factura.numero === 'F-2026-004')!;
    component.eliminar(pendiente.factura);
    expect(component.facturasFiltradas().length).toBe(3);
  });
});
