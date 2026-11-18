import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { MovimientoService } from '../../core/services/movimiento.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let movimientoService: MovimientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    movimientoService = TestBed.inject(MovimientoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate income, expenses and current balance', () => {
    expect(component.totalIngresos).toBeCloseTo(3399.2, 2);
    expect(component.totalGastos).toBe(735);
    expect(component.saldoActual).toBeCloseTo(2664.2, 2);
  });

  it('should order the latest movements by date', () => {
    expect(component.ultimosMovimientos[0].concepto).toBe('Nómina');
    expect(component.ultimosMovimientos[3].concepto).toBe('Trabajo extra');
  });

  it('should reflect movements added to the shared service', () => {
    movimientoService.agregarMovimiento({
      concepto: 'Venta',
      categoria: 'Trabajo',
      fecha: '2026-11-15',
      importe: 100,
      tipo: 'Ingreso'
    });

    expect(component.totalIngresos).toBeCloseTo(3499.2, 2);
    expect(component.saldoActual).toBeCloseTo(2764.2, 2);
    expect(component.ultimosMovimientos[0].concepto).toBe('Venta');
  });

  it('should display the summary in the template', () => {
    const contenido = fixture.nativeElement.textContent;
    expect(contenido).toContain('Saldo actual');
    expect(contenido).toContain('Ingresos');
    expect(contenido).toContain('Gastos');
    expect(contenido).toContain('Últimos movimientos');
  });
});
