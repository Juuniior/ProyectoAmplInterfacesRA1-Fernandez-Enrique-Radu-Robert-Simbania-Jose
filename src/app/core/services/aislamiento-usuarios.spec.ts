/// <reference types="node" />
import { webcrypto } from 'node:crypto';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTENTICACION } from '../auth/autenticacion.token';
import { ServicioAutenticacion, DatosRegistro } from '../auth/autenticacion.model';
import { MovimientoService } from './movimiento.service';
import { FacturaService } from './factura.service';

const ANA: DatosRegistro = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-05-20',
  password: 'clave-segura-ana',
};
const LUIS: DatosRegistro = {
  nombre: 'Luis García',
  email: 'luis@ejemplo.com',
  fechaNacimiento: '1998-02-11',
  password: 'clave-segura-luis',
};

/** Deja que terminen los efectos que cargan los datos al cambiar de sesión. */
async function esperarCarga(): Promise<void> {
  await new Promise((resolver) => setTimeout(resolver, 0));
}

describe('aislamiento de datos por usuario', () => {
  let auth: ServicioAutenticacion;
  let movimientos: MovimientoService;
  let facturas: FacturaService;

  beforeEach(async () => {
    vi.stubGlobal('crypto', webcrypto);
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({});
    auth = TestBed.inject(AUTENTICACION);
    movimientos = TestBed.inject(MovimientoService);
    facturas = TestBed.inject(FacturaService);

    // Dos cuentas, ninguna con sesión iniciada todavía.
    await auth.registrar(ANA);
    await auth.registrar(LUIS);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  async function entrar(usuario: DatosRegistro): Promise<void> {
    await auth.iniciarSesion(usuario.email, usuario.password);
    await esperarCarga();
  }

  async function salir(): Promise<void> {
    auth.cerrarSesion();
    await esperarCarga();
  }

  it('caduca cada usuario empieza con su propia copia de los datos de ejemplo', async () => {
    // Ana añade un movimiento y una factura a su nombre.
    await entrar(ANA);
    movimientos.agregarMovimiento({
      concepto: 'Proyecto privado de Ana',
      categoria: 'Trabajo',
      fecha: '2026-11-15',
      importe: 500,
      tipo: 'Ingreso',
    });
    facturas.crearFactura({
      cliente: 'Solo de Ana',
      fechaEmision: '2026-11-15',
      fechaVencimiento: '2026-12-15',
      lineas: [{ descripcion: 'Trabajo', cantidad: 1, precioUnitario: 100 }],
      tipoIva: 21,
      aplicaIrpf: false,
    });
    expect(movimientos.movimientos().length).toBe(6);
    expect(facturas.facturas().length).toBe(5);

    // Luis entra: ve sus propios datos de ejemplo, NO los cambios de Ana.
    await salir();
    await entrar(LUIS);
    expect(movimientos.movimientos().length).toBe(5);
    expect(facturas.facturas().length).toBe(4);
    expect(movimientos.movimientos().some((m) => m.concepto.includes('Ana'))).toBe(false);
    expect(facturas.facturas().some((f) => f.cliente === 'Solo de Ana')).toBe(false);
  });

  it('los datos se guardan por separado y persisten al cerrar y volver a entrar', async () => {
    await entrar(ANA);
    movimientos.eliminarMovimiento(1); // Ana borra su Nómina.

    await salir();
    await entrar(LUIS);
    expect(movimientos.movimientos().length).toBe(5); // Luis sigue con las 5 de ejemplo.

    await salir();
    await entrar(ANA);
    expect(movimientos.movimientos().length).toBe(4); // Ana vuelve a ver su copia sin la Nómina.
    expect(movimientos.movimientos().some((m) => m.id === 1)).toBe(false);

    // Cada usuario guarda los datos en una clave distinta de localStorage.
    expect(localStorage.getItem('app.movimientos.ana@ejemplo.com')).not.toBeNull();
    expect(localStorage.getItem('app.movimientos.luis@ejemplo.com')).not.toBeNull();
  });
});
