import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Movimientos } from './movimientos';
import { MovimientoService } from '../../core/services/movimiento.service';

describe('Movimientos', () => {
  let component: Movimientos;
  let fixture: ComponentFixture<Movimientos>;
  let movimientoService: MovimientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movimientos]
    }).compileComponents();

    fixture = TestBed.createComponent(Movimientos);
    component = fixture.componentInstance;
    movimientoService = TestBed.inject(MovimientoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the initial movements', () => {
    expect(component.cantidadMovimientos).toBe(4);
    expect(component.movimientosFiltrados.length).toBe(4);
  });

  it('should add a valid movement to the shared list', () => {
    component.nuevoConcepto = 'Venta de material';
    component.nuevaCategoria = 'Trabajo';
    component.nuevaFecha = '2026-11-15';
    component.nuevoImporte = 125.5;
    component.nuevoTipo = 'Ingreso';

    component.agregarMovimiento();

    expect(component.cantidadMovimientos).toBe(5);
    expect(component.movimientos[4].concepto).toBe('Venta de material');
    expect(component.movimientos[4].importe).toBe(125.5);
    expect(component.nuevoConcepto).toBe('');
    expect(component.nuevoImporte).toBeNull();
  });

  it('should not add a movement with an empty concept or invalid amount', () => {
    component.nuevoConcepto = '   ';
    component.nuevoImporte = 20;
    component.agregarMovimiento();
    expect(component.cantidadMovimientos).toBe(4);

    component.nuevoConcepto = 'Movimiento incorrecto';
    component.nuevoImporte = 0;
    component.agregarMovimiento();
    expect(component.cantidadMovimientos).toBe(4);
  });

  it('should filter movements by type', () => {
    component.filtroTipo = 'Ingreso';
    expect(component.movimientosFiltrados.length).toBe(2);
    expect(component.movimientosFiltrados.every(m => m.tipo === 'Ingreso')).toBe(true);
  });

  it('should remove a movement from the shared list', () => {
    component.eliminarMovimiento(1);
    expect(component.cantidadMovimientos).toBe(3);
    expect(movimientoService.movimientos().some(m => m.id === 1)).toBe(false);
  });

  it('should show the form and the movement list', () => {
    const contenido = fixture.nativeElement.textContent;
    expect(contenido).toContain('Añadir movimiento');
    expect(contenido).toContain('Listado de movimientos');
  });
});
