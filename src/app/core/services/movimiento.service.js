import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
/** Gestiona los movimientos y permite compartirlos entre las páginas. */
export class MovimientoService {
    // Los datos iniciales son de ejemplo y se mantienen en memoria.
    listaMovimientos = signal([
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
    ], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "listaMovimientos" }] : /* istanbul ignore next */ []));
    /** Devuelve una señal de solo lectura con todos los movimientos. */
    movimientos = this.listaMovimientos.asReadonly();
    /** Añade un movimiento y le asigna un identificador único. */
    agregarMovimiento(movimiento) {
        const nuevoMovimiento = {
            ...movimiento,
            id: this.listaMovimientos().length > 0
                ? Math.max(...this.listaMovimientos().map(item => item.id)) + 1
                : 1
        };
        this.listaMovimientos.update(lista => [...lista, nuevoMovimiento]);
    }
    /** Elimina el movimiento que tenga el identificador indicado. */
    eliminarMovimiento(id) {
        this.listaMovimientos.update(lista => lista.filter(movimiento => movimiento.id !== id));
    }
    static ɵfac = function MovimientoService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MovimientoService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: MovimientoService, factory: MovimientoService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MovimientoService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
