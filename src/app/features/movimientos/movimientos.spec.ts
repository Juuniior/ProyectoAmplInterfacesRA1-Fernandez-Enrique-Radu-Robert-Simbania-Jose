import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Movimientos } from './movimientos';
import { MovimientoService } from '../../core/services/movimiento.service';
import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import { ServicioAutenticacion, UsuarioPublico } from '../../core/auth/autenticacion.model';
import { AccesoModalService } from '../../core/auth/acceso-modal.service';

const ANA: UsuarioPublico = {
  nombre: 'Ana',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-01-01',
};

describe('Movimientos', () => {
  let component: Movimientos;
  let fixture: ComponentFixture<Movimientos>;
  let movimientoService: MovimientoService;
  let modalAcceso: AccesoModalService;
  let sesionSignal: ReturnType<typeof signal<UsuarioPublico | null>>;

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    sesionSignal = signal<UsuarioPublico | null>(ANA);
    const authFalso: ServicioAutenticacion = {
      registrar: async () => ANA,
      iniciarSesion: async () => ANA,
      cerrarSesion: () => sesionSignal.set(null),
      usuarioActual: () => sesionSignal(),
      sesion: sesionSignal,
    };

    await TestBed.configureTestingModule({
      imports: [Movimientos],
      providers: [provideRouter([]), { provide: AUTENTICACION, useValue: authFalso }],
    }).compileComponents();

    fixture = TestBed.createComponent(Movimientos);
    component = fixture.componentInstance;
    movimientoService = TestBed.inject(MovimientoService);
    modalAcceso = TestBed.inject(AccesoModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the initial movements', () => {
    expect(component.cantidadMovimientos).toBe(5);
    expect(component.movimientosFiltrados.length).toBe(5);
  });

  it('should add a valid movement to the shared list', () => {
    component.nuevoConcepto = 'Venta de material';
    component.nuevaCategoria = 'Trabajo';
    component.nuevaFecha = '2026-11-15';
    component.nuevoImporte = 125.5;
    component.nuevoTipo = 'Ingreso';

    component.agregarMovimiento();

    expect(component.cantidadMovimientos).toBe(6);
    expect(component.movimientos[5].concepto).toBe('Venta de material');
    expect(component.movimientos[5].importe).toBe(125.5);
    expect(component.nuevoConcepto).toBe('');
    expect(component.nuevoImporte).toBeNull();
  });

  it('should not add a movement with an empty concept or invalid amount', () => {
    component.nuevoConcepto = '   ';
    component.nuevoImporte = 20;
    component.agregarMovimiento();
    expect(component.cantidadMovimientos).toBe(5);

    component.nuevoConcepto = 'Movimiento incorrecto';
    component.nuevoImporte = 0;
    component.agregarMovimiento();
    expect(component.cantidadMovimientos).toBe(5);
  });

  it('should filter movements by type', () => {
    component.filtroTipo = 'Ingreso';
    expect(component.movimientosFiltrados.length).toBe(3);
    expect(component.movimientosFiltrados.every(m => m.tipo === 'Ingreso')).toBe(true);
  });

  it('should remove a movement from the shared list', () => {
    component.eliminarMovimiento(1);
    expect(component.cantidadMovimientos).toBe(4);
    expect(movimientoService.movimientos().some(m => m.id === 1)).toBe(false);
  });

  it('should link invoice payments to their invoice', () => {
    fixture.detectChanges();
    const enlace = fixture.nativeElement.querySelector('.enlace-factura');
    expect(enlace?.textContent).toContain('Factura F-2026-001');
  });

  it('should warn that the invoice is pending again when its payment is removed', () => {
    const cobro = movimientoService.movimientos().find(m => m.facturaId === 1)!;
    component.eliminarMovimiento(cobro.id);
    expect(component.aviso).toContain('F-2026-001');

    component.eliminarMovimiento(2);
    expect(component.aviso).toBeNull();
  });

  it('should show the form and the movement list', () => {
    const contenido = fixture.nativeElement.textContent;
    expect(contenido).toContain('Añadir movimiento');
    expect(contenido).toContain('Listado de movimientos');
  });

  describe('modo vista previa (sin iniciar sesión)', () => {
    beforeEach(() => {
      sesionSignal.set(null);
      fixture.detectChanges();
    });

    it('oculta las etiquetas amarillas de ejemplo cuando no se ha iniciado sesión', () => {
      const marcas = fixture.nativeElement.querySelectorAll('.marca-ejemplo');
      expect(marcas.length).toBe(0);
    });

    it('abre el modal de acceso al intentar añadir o eliminar un movimiento sin sesión', () => {
      component.nuevoConcepto = 'Intento sin sesión';
      component.nuevoImporte = 50;
      component.agregarMovimiento();
      expect(modalAcceso.abierto()).toBe(true);
      expect(component.cantidadMovimientos).toBe(5);

      modalAcceso.cerrar();
      component.eliminarMovimiento(1);
      expect(modalAcceso.abierto()).toBe(true);
      expect(component.cantidadMovimientos).toBe(5);
    });
  });
});
