import { Injectable, signal } from '@angular/core';
import { Movimiento } from '../interfaces/movimiento.interface';

/** Gestiona los movimientos y permite compartirlos entre las páginas. */
@Injectable({ providedIn: 'root' })
export class MovimientoService {
  // Los datos iniciales son de ejemplo y se mantienen en memoria.
  private readonly listaMovimientos = signal<Movimiento[]>([
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
    }
  ]);

  /** Devuelve una señal de solo lectura con todos los movimientos. */
  readonly movimientos = this.listaMovimientos.asReadonly();

  /** Añade un movimiento y le asigna un identificador único. */
  agregarMovimiento(movimiento: Omit<Movimiento, 'id'>): void {
    const nuevoMovimiento: Movimiento = {
      ...movimiento,
      id: this.listaMovimientos().length > 0
        ? Math.max(...this.listaMovimientos().map(item => item.id)) + 1
        : 1
    };

    this.listaMovimientos.update(lista => [...lista, nuevoMovimiento]);
  }

  /** Elimina el movimiento que tenga el identificador indicado. */
  eliminarMovimiento(id: number): void {
    this.listaMovimientos.update(lista =>
      lista.filter(movimiento => movimiento.id !== id)
    );
  }
}
