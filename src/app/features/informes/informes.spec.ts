import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FacturaService } from '../../core/services/factura.service';
import { MovimientoService } from '../../core/services/movimiento.service';
import { Informes } from './informes';

const normal = (texto: string | null | undefined) =>
  (texto ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

describe('Informes', () => {
  let fixture: ComponentFixture<Informes>;
  let componente: Informes;
  const html = () => fixture.nativeElement as HTMLElement;
  const texto = () => normal(html().textContent);

  async function crear(fecha = new Date(2026, 10, 18, 12)) {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(fecha);
    await TestBed.configureTestingModule({ imports: [Informes] }).compileComponents();
    fixture = TestBed.createComponent(Informes);
    componente = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function refrescar() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const botonPeriodo = (etiqueta: string) =>
    Array.from(html().querySelectorAll<HTMLButtonElement>('.selector__opcion')).find(
      (b) => b.textContent?.trim() === etiqueta,
    ) as HTMLButtonElement;

  const barra = (etiqueta: string) =>
    Array.from(html().querySelectorAll<HTMLButtonElement>('.barra')).find((b) =>
      b.querySelector('.barra__etiqueta')?.textContent?.includes(etiqueta),
    ) as HTMLButtonElement;

  afterEach(() => vi.useRealTimers());

  describe('con los datos de ejemplo (18/11/2026)', () => {
    beforeEach(() => crear());

    it('se crea y empieza con todo el histórico', () => {
      expect(componente).toBeTruthy();
      expect(componente.periodo()).toBe('todo');
      expect(componente.seleccion()).toBeNull();
    });

    it('calcula ingresos, gastos y saldo de todo el histórico', () => {
      expect(componente.totalIngresos()).toBeCloseTo(3399.2, 2);
      expect(componente.totalGastos()).toBe(735);
      expect(componente.saldo()).toBeCloseTo(2664.2, 2);
    });

    it('muestra los tres importes en las tarjetas', () => {
      expect(texto()).toContain('3399,20 €');
      expect(texto()).toContain('735,00 €');
      expect(texto()).toContain('2664,20 €');
    });

    it('reparte los gastos por categoría de mayor a menor', () => {
      expect(componente.gastosPorCategoria().map((f) => f.categoria)).toEqual([
        'Vivienda',
        'Alimentación',
      ]);
      expect(componente.ingresosPorCategoria().map((f) => f.categoria)).toEqual([
        'Trabajo',
        'Otros',
      ]);
      expect(html().querySelectorAll('.barra')).toHaveLength(4);
    });

    it('al pulsar "Este mes" filtra los movimientos del mes en curso', async () => {
      botonPeriodo('Este mes').click();
      await refrescar();
      expect(componente.periodo()).toBe('mes');
      expect(componente.totalIngresos()).toBe(2000);
      expect(componente.totalGastos()).toBe(735);
      expect(texto()).toContain('1265,00 €');
    });

    it('cambiar de periodo cierra el detalle abierto', async () => {
      componente.alternarCategoria('Gasto', 'Vivienda');
      componente.cambiarPeriodo('anio');
      expect(componente.seleccion()).toBeNull();
    });

    it('al pulsar una categoría muestra sus movimientos, y al pulsarla otra vez los oculta', async () => {
      barra('Vivienda').click();
      await refrescar();
      expect(html().querySelector('.informes__detalle')).toBeTruthy();
      expect(texto()).toContain('Gastos · Vivienda');
      expect(texto()).toContain('Alquiler');
      expect(barra('Vivienda').getAttribute('aria-pressed')).toBe('true');

      barra('Vivienda').click();
      await refrescar();
      expect(html().querySelector('.informes__detalle')).toBeFalsy();
    });

    it('el detalle ordena del más reciente al más antiguo', () => {
      componente.alternarCategoria('Ingreso', 'Trabajo');
      expect(componente.detalle().map((m) => m.fecha)).toEqual(['2026-11-10', '2026-10-30']);
    });

    it('muestra el estado de las facturas con su cantidad', () => {
      const cantidades = componente.facturasPorEstado().map((f) => [f.estado, f.cantidad]);
      expect(cantidades.map(([estado]) => estado)).toEqual(['Pendiente', 'Vencida', 'Pagada']);
      expect(html().querySelectorAll('.informes__facturas app-tarjeta-resumen')).toHaveLength(3);
      expect(texto()).toContain('Pendientes de cobro');
      expect(texto()).toContain('Vencidas');
      expect(texto()).toContain('Cobradas');
    });

    it('se actualiza cuando cambian los movimientos del servicio', async () => {
      TestBed.inject(MovimientoService).agregarMovimiento({
        concepto: 'Venta',
        categoria: 'Trabajo',
        fecha: '2026-11-15',
        importe: 100,
        tipo: 'Ingreso',
      });
      await refrescar();
      expect(componente.totalIngresos()).toBeCloseTo(3499.2, 2);
    });

    it('se actualiza cuando se cobra una factura', () => {
      const servicio = TestBed.inject(FacturaService);
      const pendientes = () => componente.facturasPorEstado()[0].cantidad;
      const antes = pendientes();
      const factura = servicio
        .facturas()
        .find((f) => f.estado === 'Pendiente' && f.fechaVencimiento >= '2026-11-18');
      servicio.marcarPagada(factura!.id, '2026-11-18');
      expect(pendientes()).toBe(antes - 1);
    });

    it('textoFacturas usa singular y plural', () => {
      expect(componente.textoFacturas(1)).toBe('1 factura');
      expect(componente.textoFacturas(0)).toBe('0 facturas');
      expect(componente.textoFacturas(3)).toBe('3 facturas');
    });

    it('tipoTarjetaEstado asigna un color a cada estado', () => {
      expect(componente.tipoTarjetaEstado('Pagada')).toBe('ingreso');
      expect(componente.tipoTarjetaEstado('Vencida')).toBe('gasto');
      expect(componente.tipoTarjetaEstado('Pendiente')).toBe('saldo');
    });
  });

  describe('sin movimientos en el periodo', () => {
    it('avisa y no dibuja barras (marzo de 2027, "Este mes")', async () => {
      await crear(new Date(2027, 2, 1, 12));
      componente.cambiarPeriodo('mes');
      await refrescar();
      expect(html().querySelector('[role="status"]')?.textContent).toContain(
        'No hay movimientos en este periodo.',
      );
      expect(html().querySelectorAll('.barra')).toHaveLength(0);
      expect(texto()).toContain('0,00 €');
    });
  });
});
