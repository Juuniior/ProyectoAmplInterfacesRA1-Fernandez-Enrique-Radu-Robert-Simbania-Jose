import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Factura, NuevaFactura } from '../interfaces/factura.interface';
import { siguienteNumero, totalFactura } from '../utils/calculos-factura';
import { AUTENTICACION } from '../auth/autenticacion.token';
import { DEMO_EMAIL, MovimientoService } from './movimiento.service';

/** Lo que se guarda de cada factura: el estado y la fecha de pago se calculan. */
type FacturaGuardada = Omit<Factura, 'estado' | 'fechaPago'>;

/**
 * Datos de ejemplo, usados solo por el usuario de demostración (sin sesión, en las pruebas).
 * La F-2026-001 está cobrada: su ingreso (facturaId: 1) está en los datos de
 * ejemplo de MovimientoService.
 */
const FACTURAS_DEMO: FacturaGuardada[] = [
  {
    id: 1,
    numero: 'F-2026-001',
    cliente: 'Estudio Lumen S.L.',
    fechaEmision: '2026-10-05',
    fechaVencimiento: '2026-11-04',
    lineas: [
      { descripcion: 'Diseño de página web', cantidad: 1, precioUnitario: 1200 },
      { descripcion: 'Alojamiento web (1 año)', cantidad: 1, precioUnitario: 120 },
    ],
    tipoIva: 21,
    aplicaIrpf: true,
  },
  {
    id: 2,
    numero: 'F-2026-002',
    cliente: 'Panadería Robles',
    fechaEmision: '2026-10-20',
    fechaVencimiento: '2026-11-10',
    lineas: [{ descripcion: 'Mantenimiento mensual', cantidad: 2, precioUnitario: 90 }],
    tipoIva: 21,
    aplicaIrpf: false,
  },
  {
    id: 3,
    numero: 'F-2026-003',
    cliente: 'Clínica Dental Sonrisa',
    fechaEmision: '2026-11-03',
    fechaVencimiento: '2026-12-03',
    lineas: [
      { descripcion: 'Campaña en redes sociales', cantidad: 1, precioUnitario: 450 },
      { descripcion: 'Sesión de fotos', cantidad: 3, precioUnitario: 60 },
    ],
    tipoIva: 21,
    aplicaIrpf: true,
  },
  {
    id: 4,
    numero: 'F-2026-004',
    cliente: 'Asociación Vecinal Norte',
    fechaEmision: '2026-11-12',
    fechaVencimiento: '2026-12-12',
    lineas: [{ descripcion: 'Taller de formación', cantidad: 4, precioUnitario: 75 }],
    tipoIva: 10,
    aplicaIrpf: false,
  },
];

/**
 * Gestiona las facturas de la persona que tiene la sesión iniciada y las
 * conecta con sus Movimientos.
 *
 * Cada usuario guarda sus facturas en `localStorage`, separadas por su correo
 * (`app.facturas.<email>`). Así cada cuenta ve solo sus facturas, sus cobros y
 * sus movimientos, sin compartirlos con otros usuarios.
 *
 * Una factura está pagada si existe un movimiento con su `facturaId` (el cobro).
 * Así hay una sola fuente de verdad: si el cobro se borra en Movimientos,
 * la factura vuelve a estar pendiente sin tener que sincronizar nada.
 */
@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly auth = inject(AUTENTICACION);
  private readonly movimientoService = inject(MovimientoService);

  /** Copia en memoria por usuario, para no leer de localStorage a cada rato. */
  private readonly cache = new Map<string, FacturaGuardada[]>();

  /** Facturas vivas del usuario actual (aún sin estado, que se calcula). */
  private readonly listaFacturas = signal<FacturaGuardada[]>([]);

  constructor() {
    // Carga inicial inmediata para el usuario que ya tuviera la sesión.
    this.listaFacturas.set(this.leerOCrear(this.owner()));

    // Cuando cambia la sesión (iniciar o cerrar sesión), se cargan los datos.
    effect(() => {
      this.listaFacturas.set(this.leerOCrear(this.owner()));
    });
  }

  /**
   * Todas las facturas con su estado. Se recalcula sola cuando cambian las
   * facturas o los movimientos del usuario actual.
   */
  readonly facturas = computed<Factura[]>(() => {
    const cobros = new Map(
      this.movimientoService
        .movimientos()
        .filter((m) => m.facturaId !== undefined)
        .map((m) => [m.facturaId, m]),
    );
    return this.listaFacturas().map((factura) => {
      const cobro = cobros.get(factura.id);
      return cobro
        ? { ...factura, estado: 'Pagada', fechaPago: cobro.fecha }
        : { ...factura, estado: 'Pendiente' };
    });
  });

  /** Número que recibirá la próxima factura emitida en esa fecha. */
  siguienteNumero(fechaEmision: string): string {
    return siguienteNumero(this.listaFacturas(), fechaEmision);
  }

  /** Crea una factura pendiente con número correlativo y la devuelve. */
  crearFactura(datos: NuevaFactura): Factura {
    const lista = this.listaFacturas();
    const nueva: FacturaGuardada = {
      ...datos,
      lineas: datos.lineas.map((l) => ({ ...l })),
      id: lista.length > 0 ? Math.max(...lista.map((f) => f.id)) + 1 : 1,
      numero: siguienteNumero(lista, datos.fechaEmision),
    };
    this.sustituir([...lista, nueva]);
    return { ...nueva, estado: 'Pendiente' };
  }

  /**
   * Registra el cobro de la factura como un Ingreso en Movimientos vinculado
   * a ella (facturaId). Con eso la factura pasa a "Pagada" y el saldo de Inicio
   * se actualiza. Devuelve la factura actualizada, o `null` si no existe o ya
   * estaba pagada.
   */
  marcarPagada(id: number, fechaPago: string): Factura | null {
    const factura = this.buscar(id);
    if (!factura || factura.estado === 'Pagada') {
      return null;
    }

    this.movimientoService.agregarMovimiento({
      concepto: `Cobro factura ${factura.numero} · ${factura.cliente}`,
      categoria: 'Trabajo',
      fecha: fechaPago,
      importe: totalFactura(factura),
      tipo: 'Ingreso',
      facturaId: factura.id,
    });

    return this.buscar(id);
  }

  /**
   * Elimina una factura pendiente. Las pagadas no se pueden eliminar porque
   * tienen un cobro en Movimientos (si se borra ese cobro, vuelven a pendiente).
   */
  eliminarFactura(id: number): boolean {
    const factura = this.buscar(id);
    if (!factura || factura.estado === 'Pagada') {
      return false;
    }
    this.sustituir(this.listaFacturas().filter((f) => f.id !== id));
    return true;
  }

  /** Número de la factura con ese id (lo usa Movimientos para mostrar el vínculo). */
  numeroDe(id: number): string | undefined {
    return this.listaFacturas().find((f) => f.id === id)?.numero;
  }

  private buscar(id: number): Factura | null {
    return this.facturas().find((f) => f.id === id) ?? null;
  }

  /** Correo del usuario actual, o el de demostración si no hay sesión. */
  private owner(): string {
    return this.auth.sesion()?.email ?? DEMO_EMAIL;
  }

  /** Clave de localStorage que guarda las facturas de un usuario. */
  private clave(email: string): string {
    return `app.facturas.${email}`;
  }

  /**
   * Devuelve las facturas de un usuario, creándolas con los datos de ejemplo
   * si es la primera vez que entra. Las mantiene en memoria para lecturas rápidas.
   */
  private leerOCrear(email: string): FacturaGuardada[] {
    const enCache = this.cache.get(email);
    if (enCache) {
      return enCache;
    }

    let datos: unknown = null;
    try {
      const texto = localStorage.getItem(this.clave(email));
      datos = texto ? JSON.parse(texto) : null;
    } catch {
      datos = null;
    }

    if (!Array.isArray(datos)) {
      // Cada usuario nuevo recibe las facturas de ejemplo (marcadas como tales)
      // para que vea cómo funciona la app sin partir de cero. Puede borrarlas.
      datos = FACTURAS_DEMO.map((factura) => ({
        ...factura,
        ejemplo: true,
        lineas: factura.lineas.map((linea) => ({ ...linea })),
      }));
      // El usuario de demostración no se guarda: solo persisten los usuarios reales.
      if (email !== DEMO_EMAIL) {
        try {
          localStorage.setItem(this.clave(email), JSON.stringify(datos));
        } catch {
          // Sin localStorage (por ejemplo, en el servidor con SSR) se usa solo en memoria.
        }
      }
    }

    const lista = datos as FacturaGuardada[];
    this.cache.set(email, lista);
    return lista;
  }

  /** Actualiza la lista visible y la guarda en localStorage del usuario actual. */
  private sustituir(lista: FacturaGuardada[]): void {
    const email = this.owner();
    this.cache.set(email, lista);
    this.listaFacturas.set(lista);
    // El usuario de demostración no se guarda: solo persisten los usuarios reales.
    if (email !== DEMO_EMAIL) {
      try {
        localStorage.setItem(this.clave(email), JSON.stringify(lista));
      } catch {
        // Sin localStorage (SSR) la lista sigue viva en memoria.
      }
    }
  }
}
