import { TestBed } from '@angular/core/testing';
import { MovimientoService } from './movimiento.service';

describe('MovimientoService', () => {
  let service: MovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide the initial example movements', () => {
    expect(service.movimientos().length).toBe(5);
  });

  it('should add a movement and assign it an id', () => {
    service.agregarMovimiento({
      concepto: 'Venta',
      categoria: 'Trabajo',
      fecha: '2026-11-15',
      importe: 100,
      tipo: 'Ingreso'
    });

    expect(service.movimientos().length).toBe(6);
    expect(service.movimientos()[5].id).toBe(6);
    expect(service.movimientos()[5].concepto).toBe('Venta');
  });

  it('should remove a movement by its id', () => {
    service.eliminarMovimiento(2);

    expect(service.movimientos().length).toBe(4);
    expect(service.movimientos().some(movimiento => movimiento.id === 2)).toBe(false);
  });
});
