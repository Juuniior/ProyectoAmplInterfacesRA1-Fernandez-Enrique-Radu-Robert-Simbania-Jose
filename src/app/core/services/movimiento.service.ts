import { Injectable, effect, inject, signal } from '@angular/core';
import { AUTENTICACION } from '../auth/autenticacion.token';
import { Movimiento } from '../interfaces/movimiento.interface';

/**
 * Usuario ficticio que se usa cuando no hay sesión iniciada (por ejemplo, en
 * los tests o antes de entrar). Con él los datos de ejemplo siguen viéndose
 * sin necesidad de una cuenta real.
 */
export const DEMO_EMAIL = 'demo@contalite.local';

/** Datos de ejemplo, usados solo por el usuario de demostración (sin sesión, en las pruebas). */
const MOVIMIENTOS_DEMO: Movimiento[] = [
  {
    id: 1,
    concepto: 'Nómina',
    categoria: 'Trabajo',
    fecha: '2026-11-10',
    importe: 1800,
    tipo: 'Ingreso'
  },
  {
    id: 2,
    concepto: 'Alquiler',
    categoria: 'Vivienda',
    fecha: '2026-11-08',
    importe: 650,
    tipo: 'Gasto'
  },
  {
    id: 3,
    concepto: 'Compra supermercado',
    categoria: 'Alimentación',
    fecha: '2026-11-07',
    importe: 85,
    tipo: 'Gasto'
  },
  {
    id: 4,
    concepto: 'Trabajo extra',
    categoria: 'Otros',
    fecha: '2026-11-05',
    importe: 200,
    tipo: 'Ingreso'
  },
  {
    id: 5,
    concepto: 'Cobro factura F-2026-001 · Estudio Lumen S.L.',
    categoria: 'Trabajo',
    fecha: '2026-10-30',
    importe: 1399.2,
    tipo: 'Ingreso',
    facturaId: 1
  }
];

/**
 * Gestiona los movimientos de la persona que tiene la sesión iniciada.
 *
 * Cada usuario guarda sus propios movimientos en `localStorage`, separados por
 * su correo (`app.movimientos.<email>`). Así, dos cuentas no comparten datos:
 * al iniciar sesión, el servicio carga solo lo de ese usuario.
 */
@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly auth = inject(AUTENTICACION);

  /** Copia en memoria por usuario, para no leer de localStorage a cada rato. */
  private readonly cache = new Map<string, Movimiento[]>();

  /** Movimientos visibles del usuario actual. */
  private readonly listaMovimientos = signal<Movimiento[]>([]);

  constructor() {
    // Carga inicial inmediata para el usuario que ya tuviera la sesión.
    this.listaMovimientos.set(this.leerOCrear(this.owner()));

    // Cuando cambia la sesión (iniciar o cerrar sesión), se cargan los datos.
    effect(() => {
      this.listaMovimientos.set(this.leerOCrear(this.owner()));
    });
  }

  /** Devuelve una señal de solo lectura con los movimientos del usuario actual. */
  readonly movimientos = this.listaMovimientos.asReadonly();

  /** Añade un movimiento y le asigna un identificador único. */
  agregarMovimiento(movimiento: Omit<Movimiento, 'id'>): void {
    const actual = this.listaMovimientos();
    const nuevoMovimiento: Movimiento = {
      ...movimiento,
      id: actual.length > 0 ? Math.max(...actual.map((item) => item.id)) + 1 : 1
    };
    this.guardar([...actual, nuevoMovimiento]);
  }

  /** Elimina el movimiento que tenga el identificador indicado. */
  eliminarMovimiento(id: number): void {
    this.guardar(this.listaMovimientos().filter((movimiento) => movimiento.id !== id));
  }

  /** Correo del usuario actual, o el de demostración si no hay sesión. */
  private owner(): string {
    return this.auth.sesion()?.email ?? DEMO_EMAIL;
  }

  /** Clave de localStorage que guarda los movimientos de un usuario. */
  private clave(email: string): string {
    return `app.movimientos.${email}`;
  }

  /**
   * Devuelve la lista de un usuario, creándola con los datos de ejemplo si es
   * la primera vez que entra. La mantiene en memoria para lecturas rápidas.
   */
  private leerOCrear(email: string): Movimiento[] {
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
      // Cada usuario nuevo recibe los movimientos de ejemplo (marcados como tales)
      // para que vea cómo funciona la app sin partir de cero. Puede borrarlos.
      datos = MOVIMIENTOS_DEMO.map((movimiento) => ({ ...movimiento, ejemplo: true }));
      // El usuario de demostración no se guarda: solo persisten los usuarios reales.
      if (email !== DEMO_EMAIL) {
        try {
          localStorage.setItem(this.clave(email), JSON.stringify(datos));
        } catch {
          // Sin localStorage (por ejemplo, en el servidor con SSR) se usa solo en memoria.
        }
      }
    }

    const lista = datos as Movimiento[];
    this.cache.set(email, lista);
    return lista;
  }

  /** Actualiza la lista visible y la guarda en localStorage del usuario actual. */
  private guardar(lista: Movimiento[]): void {
    const email = this.owner();
    this.cache.set(email, lista);
    this.listaMovimientos.set(lista);
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
